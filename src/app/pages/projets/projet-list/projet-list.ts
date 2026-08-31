import { Component, OnInit, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjetsService } from '../../../services/projets';
import { Projet } from '../../../models/projet.model';
import { ProjetFormComponent } from '../projet-form/projet-form';
import { CommonModule } from '@angular/common';
import { RouterLink} from '@angular/router';

@Component({
  selector: 'app-projet-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './projet-list.html',
  styleUrl: './projet-list.scss'
})
export class ProjetList implements OnInit {
  projets = signal<Projet[]>([]);
  isLoading = signal(false);

  constructor(
    private projetsService: ProjetsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadProjets();
  }

  loadProjets(): void {
    this.isLoading.set(true);
    this.projetsService.findAll().subscribe({
      next: (projets) => {
        this.projets.set(projets);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    const modalRef = this.modalService.open(ProjetFormComponent);
    modalRef.componentInstance.mode = 'create';

    modalRef.closed.subscribe((result) => {
      if (result === 'saved') {
        this.loadProjets();
      }
    });
  }

  openEditModal(projet: Projet): void {
    const modalRef = this.modalService.open(ProjetFormComponent);
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.projetToEdit = projet;

    modalRef.closed.subscribe((result) => {
      if (result === 'saved') {
        this.loadProjets();
      }
    });
  }

  deleteProjet(projet: Projet): void {
    if (!confirm(`Supprimer le projet "${projet.nom_projet}" ?`)) {
      return;
    }
    this.projetsService.remove(projet.id).subscribe({
      next: () => this.loadProjets()
    });
  }

  statutBadgeClass(statut: string): string {
    switch (statut) {
      case 'actif': return 'bg-success';
      case 'inactif': return 'bg-warning';
      case 'termine': return 'bg-secondary';
      default: return 'bg-light';
    }
  }
}