import { Component, OnInit, signal, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetsService } from '../../../services/projets';
import { OffresService } from '../../../services/offres';
import { FacturesService } from '../../../services/factures';
import { Projet } from '../../../models/projet.model';
import { OffreFinanciere } from '../../../models/offre.model';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels
} from 'ng-apexcharts';
import { ComparaisonResultat } from '../../../models/comparaison.model';

export type MiniChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  colors: string[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
};

export interface ComparaisonCarte {
  ressourceCloud: string;
  unite: string;
  quantitePrevue: number;
  quantiteReelle: number;
  ecart: number;
  chartOptions: MiniChartOptions;
}

@Component({
  selector: 'app-projet-detail',
  imports: [CommonModule, RouterLink, NgApexchartsModule],
  templateUrl: './projet-detail.html',
  styleUrl: './projet-detail.scss'
})
export class ProjetDetail implements OnInit {
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  projet = signal<Projet | null>(null);
  offreActive = signal<OffreFinanciere | null>(null);
  historique = signal<OffreFinanciere[]>([]);
  showHistorique = signal(false);
  isLoading = signal(false);
  isUploading = signal(false);
  uploadError = signal<string | null>(null);
  uploadSuccess = signal<string | null>(null);
  projetId!: number;

  comparaisonInfo = signal<ComparaisonResultat | null>(null);
  comparaisonCartes = signal<ComparaisonCarte[]>([]);

  constructor(
    private route: ActivatedRoute,
    private projetsService: ProjetsService,
    private offresService: OffresService,
    private facturesService: FacturesService
  ) {}

  ngOnInit(): void {
    this.projetId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProjet();
    this.loadOffreActive();
    this.loadComparaison();
  }

  loadProjet(): void {
    this.projetsService.findOne(this.projetId).subscribe({
      next: (projet) => this.projet.set(projet)
    });
  }

  loadOffreActive(): void {
    this.isLoading.set(true);
    this.offresService.findActive(this.projetId).subscribe({
      next: (offre) => {
        this.offreActive.set(offre);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadHistorique(): void {
    this.offresService.findHistorique(this.projetId).subscribe({
      next: (historique) => {
        this.historique.set(historique);
        this.showHistorique.set(true);
      }
    });
  }

  loadComparaison(): void {
    this.facturesService.getComparaison(this.projetId).subscribe({
      next: (data) => {
        this.comparaisonInfo.set(data);

        const cartes: ComparaisonCarte[] = data.comparaison.map((c) => {
          const max = Math.max(c.quantite_prevue, c.quantite_reelle, 1);
          const enDepassement = c.quantite_reelle > c.quantite_prevue;

          return {
            ressourceCloud: c.ressource_cloud,
            unite: c.unite,
            quantitePrevue: c.quantite_prevue,
            quantiteReelle: c.quantite_reelle,
            ecart: c.quantite_prevue > 0 ? ((c.quantite_reelle - c.quantite_prevue) / c.quantite_prevue) * 100 : 0,
            chartOptions: {
              series: [
                {
                  name: 'Quantité',
                  data: [
                    { x: 'Prévu', y: c.quantite_prevue },
                    { x: 'Réel', y: c.quantite_reelle }
                  ]
                }
              ],
              chart: {
                type: 'bar',
                height: 180,
                toolbar: { show: false },
                sparkline: { enabled: false }
              },
              xaxis: {
                categories: ['Prévu', 'Réel']
              },
              colors: [enDepassement ? '#e74c3c' : '#00A8E7'],
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  horizontal: false,
                  distributed: true,
                  columnWidth: '55%'
                }
              },
              dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val} ${c.unite}`
              }
            }
          };
        });

        this.comparaisonCartes.set(cartes);
      },
      error: () => {
        // Aucune offre active ou aucune facture — la carte affichera un message vide (géré dans le HTML)
      }
    });
  }

  triggerFileInput(): void {
    this.fileInput()?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.uploadError.set(null);
    this.uploadSuccess.set(null);
    this.isUploading.set(true);

    this.offresService.importOffre(this.projetId, file).subscribe({
      next: (offre) => {
        this.isUploading.set(false);
        this.uploadSuccess.set(`Offre importée avec succès (version ${offre.version}, ${offre.ressources.length} ressources).`);
        this.offreActive.set(offre);
        input.value = '';
      },
      error: (err) => {
        this.isUploading.set(false);
        this.uploadError.set(err.error?.message || "Erreur lors de l'import du fichier");
        input.value = '';
      }
    });
  }

  calculTotal(offre: OffreFinanciere): number {
    return offre.ressources.reduce((sum, r) => sum + r.quantite * r.prix_unitaire, 0);
  }
}