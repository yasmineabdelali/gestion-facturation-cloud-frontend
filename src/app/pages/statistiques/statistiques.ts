import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexPlotOptions } from 'ng-apexcharts';
import { StatistiquesService } from '../../services/statistiques';
import { ConsommationParClient, ConsommationParRessource } from '../../models/statistiques.model';

export type BarOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  colors: string[];
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-statistiques',
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './statistiques.html',
  styleUrl: './statistiques.scss'
})
export class Statistiques implements OnInit {
  vueActive: 'client' | 'ressource' = 'client';
  typePeriodeFiltre = '';

  parClient = signal<ConsommationParClient[]>([]);
  parRessource = signal<ConsommationParRessource[]>([]);
  isLoading = signal(false);

  chartClientOptions = signal<BarOptions | null>(null);
  chartRessourceOptions = signal<BarOptions | null>(null);

  constructor(private statistiquesService: StatistiquesService) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  changerVue(vue: 'client' | 'ressource'): void {
    this.vueActive = vue;
  }

  onFiltreChange(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.isLoading.set(true);
    const filtre = this.typePeriodeFiltre || undefined;

    this.statistiquesService.getConsommationParClient(filtre).subscribe({
      next: (data) => {
        this.parClient.set(data);
        this.chartClientOptions.set({
          series: [{ name: 'Montant facturé', data: data.map((d) => d.montantTotal) }],
          chart: { type: 'bar', height: 350 },
          xaxis: { categories: data.map((d) => d.nom) },
          colors: ['#11376C'],
          plotOptions: { bar: { borderRadius: 6, horizontal: true } }
        });
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    this.statistiquesService.getConsommationParRessource(filtre).subscribe({
      next: (data) => {
        this.parRessource.set(data);
        this.chartRessourceOptions.set({
          series: [{ name: 'Montant facturé', data: data.map((d) => d.montantTotal) }],
          chart: { type: 'bar', height: 350 },
          xaxis: { categories: data.map((d) => d.ressourceCloud) },
          colors: ['#00A8E7'],
          plotOptions: { bar: { borderRadius: 6, horizontal: true } }
        });
      }
    });
  }
}