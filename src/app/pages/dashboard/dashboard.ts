import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { DashboardService } from '../../services/dashboard';
import { DashboardIndicateurs } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  indicateurs = signal<DashboardIndicateurs | null>(null); //indicateurs démarre à null → tant que les données ne sont pas encore arrivées du backend
  isLoading = signal(false); //isLoading → pour afficher "Chargement..." pendant l'attente

  constructor(
    protected authService: AuthService,
    private dashboardService: DashboardService
  ) {}
 //on charge les données dès que le composant s'affiche.
  ngOnInit(): void {
    this.loadIndicateurs();
  }                   
//Pattern identique à loadUsers(), loadSocietes(), etc. — active le chargement, appelle le service, remplit le signal au succès, désactive le chargement dans tous les cas.
  loadIndicateurs(): void {
    this.isLoading.set(true);
    this.dashboardService.getIndicateurs().subscribe({
      next: (data) => {
        this.indicateurs.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}