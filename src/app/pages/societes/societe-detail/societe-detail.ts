import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocietesService } from '../../../services/societes';
import { ProjetsService } from '../../../services/projets';
import { Societe } from '../../../models/societe.model';
import { Projet } from '../../../models/projet.model';
import { ProjetFormComponent } from '../../projets/projet-form/projet-form';

@Component({
  selector: 'app-societe-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './societe-detail.html',
  styleUrl: './societe-detail.scss'
})
export class SocieteDetail implements OnInit {
  societe = signal<Societe | null>(null);
  projets = signal<Projet[]>([]);
  isLoading = signal(false);
  societeId!: number;

  constructor(
    private route: ActivatedRoute,
    private societesService: SocietesService,
    private projetsService: ProjetsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.societeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSociete();
    this.loadProjets();
  }

  loadSociete(): void {
    this.societesService.findOne(this.societeId).subscribe({
      next: (societe) => this.societe.set(societe)
    });
  }

  loadProjets(): void {
    this.isLoading.set(true);
    this.projetsService.findBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets.set(projets);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  
  openCreateProjetModal(): void {
    const modalRef = this.modalService.open(ProjetFormComponent);
    modalRef.componentInstance.mode = 'create';
    modalRef.componentInstance.preselectedSocieteId = this.societeId;

    modalRef.closed.subscribe((result) => {
      if (result === 'saved') {
        this.loadProjets();
      }
    });
  }


  openEditProjetModal(projet: Projet): void {
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