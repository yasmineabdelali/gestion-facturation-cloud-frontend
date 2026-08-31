import { Component, OnInit, signal, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetsService } from '../../../services/projets';
import { OffresService } from '../../../services/offres';
import { Projet } from '../../../models/projet.model';
import { OffreFinanciere } from '../../../models/offre.model';

@Component({
  selector: 'app-projet-detail',
  imports: [CommonModule, RouterLink],
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

  constructor(
    private route: ActivatedRoute,
    private projetsService: ProjetsService,
    private offresService: OffresService
  ) {}

  ngOnInit(): void {
    this.projetId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProjet();
    this.loadOffreActive();
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