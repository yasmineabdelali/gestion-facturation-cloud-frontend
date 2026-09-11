import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocietesService } from '../../../services/societes';
import { ProjetsService } from '../../../services/projets';
import { Societe } from '../../../models/societe.model';
import { Projet } from '../../../models/projet.model';
import { ProjetFormComponent } from '../../projets/projet-form/projet-form';
import { FormsModule } from '@angular/forms';
import { FacturesConsolideesService } from '../../../services/factures-consolidees';
import { FactureConsolidee } from '../../../models/facture-consolidee.model';
import { TypePeriode } from '../../../models/facture.model';
@Component({
  selector: 'app-societe-detail',
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './societe-detail.html',
  styleUrl: './societe-detail.scss'
})
export class SocieteDetail implements OnInit {
  societe = signal<Societe | null>(null);
  projets = signal<Projet[]>([]);
  isLoading = signal(false);
  societeId!: number;
  consolidees = signal<FactureConsolidee[]>([]);
  showConsolideeForm = signal(false);
  consolideeError = signal<string | null>(null);

  typePeriodeConsolidee: TypePeriode = TypePeriode.MENSUELLE;
  anneeConsolidee = new Date().getFullYear();
  numeroPeriodeConsolidee = 1;
  typeOptions = Object.values(TypePeriode);

  constructor(
    private route: ActivatedRoute,
    private societesService: SocietesService,
    private projetsService: ProjetsService,
    private facturesConsolideesService: FacturesConsolideesService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.societeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSociete();
    this.loadProjets();
    this.loadConsolidees();
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

  // pour factures-Consolidees 

  loadConsolidees(): void {
  this.facturesConsolideesService.findBySociete(this.societeId).subscribe({
    next: (consolidees) => this.consolidees.set(consolidees)
  });
}

get maxNumeroPeriodeConsolidee(): number {
  switch (this.typePeriodeConsolidee) {
    case TypePeriode.MENSUELLE: return 12;
    case TypePeriode.TRIMESTRIELLE: return 4;
    case TypePeriode.SEMESTRIELLE: return 2;
    default: return 12;
  }
}

onCreateConsolidee(): void {
  this.consolideeError.set(null);

  this.facturesConsolideesService.create({
    societe_id: this.societeId,
    type_periode: this.typePeriodeConsolidee,
    annee: this.anneeConsolidee,
    numero_periode: this.numeroPeriodeConsolidee
  }).subscribe({
    next: () => {
      this.showConsolideeForm.set(false);
      this.loadConsolidees();
    },
    error: (err) => {
      this.consolideeError.set(err.error?.message || "Erreur lors de la création de la consolidation");
    }
  });
}

libellePeriodeConsolidee(fc: FactureConsolidee): string {
  if (fc.type_periode === TypePeriode.MENSUELLE) {
  const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${mois[fc.numero_periode - 1]} ${fc.annee}`;
  }
  if (fc.type_periode === TypePeriode.TRIMESTRIELLE) {
    return `T${fc.numero_periode} ${fc.annee}`;
  }
  return `S${fc.numero_periode} ${fc.annee}`;
}

}