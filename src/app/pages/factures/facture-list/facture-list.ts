import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FacturesService } from '../../../services/factures';
import { ProjetsService } from '../../../services/projets';
import { Facture, TypePeriode } from '../../../models/facture.model';
import { Projet } from '../../../models/projet.model';

@Component({
  selector: 'app-facture-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './facture-list.html',
  styleUrl: './facture-list.scss'
})
export class FactureList implements OnInit {
  projet = signal<Projet | null>(null);
  factures = signal<Facture[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  projetId!: number;

  showCreateForm = signal(false);
  typePeriode: TypePeriode = TypePeriode.MENSUELLE;
  annee = new Date().getFullYear();
  numeroPeriode = 1;
  typeOptions = Object.values(TypePeriode);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturesService: FacturesService,
    private projetsService: ProjetsService
  ) {}

  ngOnInit(): void {
    this.projetId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProjet();
    this.loadFactures();
  }

  loadProjet(): void {
    this.projetsService.findOne(this.projetId).subscribe({
      next: (projet) => this.projet.set(projet)
    });
  }

  loadFactures(): void {
    this.isLoading.set(true);
    this.facturesService.findByProjet(this.projetId).subscribe({
      next: (factures) => {
        this.factures.set(factures);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  get maxNumeroPeriode(): number {
    switch (this.typePeriode) {
      case TypePeriode.MENSUELLE: return 12;
      case TypePeriode.TRIMESTRIELLE: return 4;
      case TypePeriode.SEMESTRIELLE: return 2;
      default: return 12;
    }
  }

  onCreateFacture(): void {
    this.errorMessage.set(null);

    this.facturesService.create({
      projet_id: this.projetId,
      type_periode: this.typePeriode,
      annee: this.annee,
      numero_periode: this.numeroPeriode
    }).subscribe({
      next: (facture) => {
        this.showCreateForm.set(false);
        this.router.navigate(['/factures', facture.id]);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || "Erreur lors de la création de la facture");
      }
    });
  }

  libellePeriode(facture: Facture): string {
    if (facture.type_periode === TypePeriode.MENSUELLE) {
      const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      return `${mois[facture.numero_periode - 1]} ${facture.annee}`;
    }
    if (facture.type_periode === TypePeriode.TRIMESTRIELLE) {
      return `T${facture.numero_periode} ${facture.annee}`;
    }
    return `S${facture.numero_periode} ${facture.annee}`;
  }
}