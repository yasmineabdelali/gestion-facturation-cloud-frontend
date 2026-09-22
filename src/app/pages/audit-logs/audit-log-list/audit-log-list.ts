import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogsService } from '../../../services/audit-logs';
import { AuditLog } from '../../../models/audit-log.model';

@Component({
  selector: 'app-audit-log-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-log-list.html',
  styleUrl: './audit-log-list.scss'
})
export class AuditLogList implements OnInit {
  logs = signal<AuditLog[]>([]);
  isLoading = signal(false);

  filtreAction = '';
  filtreEntite = '';
  filtreDateDebut = '';
  filtreDateFin = '';

  entitesDisponibles = ['Facture', 'FactureConsolidee', 'Offre', 'Societe', 'Projet', 'User'];
  actionsDisponibles = ['CREATE', 'UPDATE', 'DELETE', 'VALIDER', 'DEVALIDER', 'IMPORT_OFFRE', 'UPDATE_LIGNES'];

  constructor(private auditLogsService: AuditLogsService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading.set(true);
    this.auditLogsService
      .findAll({
        action: this.filtreAction || undefined,
        entite: this.filtreEntite || undefined,
        dateDebut: this.filtreDateDebut || undefined,
        dateFin: this.filtreDateFin || undefined
      })
      .subscribe({
        next: (data) => {
          this.logs.set(data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
  }

  onReset(): void {
    this.filtreAction = '';
    this.filtreEntite = '';
    this.filtreDateDebut = '';
    this.filtreDateFin = '';
    this.loadLogs();
  }

  badgeClass(action: string): string {
    if (action === 'CREATE') return 'bg-success';
    if (action === 'DELETE') return 'bg-danger';
    if (action === 'VALIDER') return 'bg-primary';
    if (action === 'DEVALIDER') return 'bg-warning';
    return 'bg-secondary';
  }
}