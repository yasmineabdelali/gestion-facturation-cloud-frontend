import { Component, OnInit, signal, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { DashboardService } from '../../services/dashboard';
import { DashboardIndicateurs,RepartitionFactures} from '../../models/dashboard.model';
import { NgApexchartsModule, ChartComponent, ApexChart, ApexNonAxisChartSeries, ApexAxisChartSeries,ApexXAxis, ApexPlotOptions, ApexLegend, ApexResponsive } from 'ng-apexcharts';
export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  responsive: ApexResponsive[];
  colors: string[];
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  colors: string[];
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, NgApexchartsModule],  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  @ViewChild('chart') chart!: ChartComponent; 
  indicateurs = signal<DashboardIndicateurs | null>(null); //indicateurs démarre à null → tant que les données ne sont pas encore arrivées du backend
  isLoading = signal(false); //isLoading → pour afficher "Chargement..." pendant l'attente
  pieChartOptions = signal<PieChartOptions | null>(null);    
  barChartOptions = signal<BarChartOptions | null>(null);
  typePeriodeSelectionne = 'mensuelle';
  constructor(
    protected authService: AuthService,
    private dashboardService: DashboardService
  ) {}
 //on charge les données dès que le composant s'affiche.
  ngOnInit(): void {
    this.loadIndicateurs();
    this.loadRepartitionFactures(); 
    this.loadMontantParSociete();
  }                   
//Pattern identique à loadUsers(), loadSocietes(), etc. — active le chargement, appelle le service, remplit le signal au succès, désactive le chargement dans tous les cas.
  loadIndicateurs(): void {
  this.isLoading.set(true);
  this.dashboardService.getIndicateurs(this.typePeriodeSelectionne).subscribe({
      next: (data) => {
        this.indicateurs.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadRepartitionFactures(): void {
  this.dashboardService.getRepartitionFactures().subscribe({
    next: (data: RepartitionFactures) => {
      this.pieChartOptions.set({  //On met à jour le signal pieChartOptions
        series: data.series,
        chart: {
          type: 'pie',
          height: 320
        },
        labels: data.labels,
        colors: ['#2ed8b6', '#ffb64d'],
        legend: {
          position: 'bottom'
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: { width: 280 },
              legend: { position: 'bottom' }
            }
          }
        ]
      });
    }
  });
}

loadMontantParSociete(): void {
  this.dashboardService.getMontantParSociete(this.typePeriodeSelectionne).subscribe({
    next: (data: RepartitionFactures) => {
      this.barChartOptions.set({
        series: [
          {
            name: 'Montant facturé',
            data: data.series
          }
        ],
        chart: {
          type: 'bar',
          height: 320
        },
        xaxis: {
          categories: data.labels
        },
        colors: ['#11376C'],
        plotOptions: {
          bar: {
            borderRadius: 6,
            horizontal: false
          }
        }
      });
    }
  });
}
onChangeTypePeriode(): void {
  this.loadIndicateurs();
  this.loadMontantParSociete();
}
 
}