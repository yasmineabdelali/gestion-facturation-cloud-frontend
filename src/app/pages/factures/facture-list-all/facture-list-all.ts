import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FacturesService } from '../../../services/factures';
import { FacturesConsolideesService } from '../../../services/factures-consolidees';
import { RechercheService } from '../../../services/recherche';
import { SocietesService } from '../../../services/societes';
import { ProjetsService } from '../../../services/projets';
import { Facture, TypePeriode } from '../../../models/facture.model';
import { FactureConsolidee } from '../../../models/facture-consolidee.model';
import { RechercheFiltres } from '../../../models/recherche.model';
import { Societe } from '../../../models/societe.model';
import { Projet } from '../../../models/projet.model';

type Onglet = 'individuelles' | 'consolidees';

@Component({
  selector: 'app-facture-list-all',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './facture-list-all.html',
  styleUrl: './facture-list-all.scss'
})
export class FactureListAll implements OnInit {
  // --- Filtres de recherche ---
  client = '';
  projetId: number | null = null;
  typePeriode: TypePeriode | '' = '';
  annee: number | null = null;
  numeroPeriode: number | null = null;

  societes = signal<Societe[]>([]);
  projets = signal<Projet[]>([]);
  facturesDuProjet = signal<Facture[]>([]);
  isLoadingPeriodes = signal(false);

  // --- Données affichées ---
  factures = signal<Facture[]>([]);
  facturesConsolidees = signal<FactureConsolidee[]>([]);
  isLoading = signal(false);
  activeTab = signal<Onglet>('individuelles');

  // --- Cascade de filtres ---
  projetsFiltres = computed(() => {
    const client = this.client.trim().toLowerCase();
    const liste = this.projets();
    if (!client) return liste;
    return liste.filter((p) => p.societe?.nom?.toLowerCase().includes(client));
  });

  typesDisponibles = computed(() => {
    const types = new Set(this.facturesDuProjet().map((f) => f.type_periode));
    return Array.from(types);
  });

  anneesDisponibles = computed(() => {
    const factures = this.facturesDuProjet().filter(
      (f) => !this.typePeriode || f.type_periode === this.typePeriode
    );
    const annees = new Set(factures.map((f) => f.annee));
    return Array.from(annees).sort((a, b) => b - a);
  });

  numerosDisponibles = computed(() => {
    const factures = this.facturesDuProjet().filter(
      (f) =>
        (!this.typePeriode || f.type_periode === this.typePeriode) &&
        (!this.annee || f.annee === this.annee)
    );
    const numeros = new Set(factures.map((f) => f.numero_periode));
    return Array.from(numeros).sort((a, b) => a - b);
  });

  constructor(
    private facturesService: FacturesService,
    private facturesConsolideesService: FacturesConsolideesService,
    private rechercheService: RechercheService,
    private societesService: SocietesService,
    private projetsService: ProjetsService
  ) {}

  ngOnInit(): void {
    this.societesService.findAll().subscribe({ next: (data) => this.societes.set(data) });
    this.projetsService.findAll().subscribe({ next: (data) => this.projets.set(data) });
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading.set(true);
    this.facturesService.findAll().subscribe({
      next: (data) => {
        this.factures.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
    this.facturesConsolideesService.findAll().subscribe({
      next: (data) => this.facturesConsolidees.set(data)
    });
  }

  onClientChange(): void {
    if (this.projetId === null) return;
    const toujoursValide = this.projetsFiltres().some((p) => p.id === this.projetId);
    if (!toujoursValide) {
      this.onProjetChange(null);
    }
  }

  onProjetChange(projetId: number | null): void {
    this.projetId = projetId;
    this.typePeriode = '';
    this.annee = null;
    this.numeroPeriode = null;
    this.facturesDuProjet.set([]);

    if (projetId === null) return;

    this.isLoadingPeriodes.set(true);
    this.facturesService.findByProjet(projetId).subscribe({
      next: (factures) => {
        this.facturesDuProjet.set(factures);
        this.isLoadingPeriodes.set(false);
      },
      error: () => this.isLoadingPeriodes.set(false)
    });
  }

  onTypePeriodeChange(): void {
    if (this.annee !== null && !this.anneesDisponibles().includes(this.annee)) {
      this.annee = null;
    }
    if (this.numeroPeriode !== null && !this.numerosDisponibles().includes(this.numeroPeriode)) {
      this.numeroPeriode = null;
    }
  }

  onAnneeChange(): void {
    if (this.numeroPeriode !== null && !this.numerosDisponibles().includes(this.numeroPeriode)) {
      this.numeroPeriode = null;
    }
  }

  onRechercher(): void {
    const aucunFiltre =
      !this.client && this.projetId === null && !this.typePeriode && this.annee === null && this.numeroPeriode === null;

    if (aucunFiltre) {
      this.loadAll();
      return;
    }

    this.isLoading.set(true);

    const projetSelectionne = this.projets().find((p) => p.id === this.projetId);

    const filtres: RechercheFiltres = {
      client: this.client || undefined,
      so: projetSelectionne?.numero_so || undefined,
      typePeriode: this.typePeriode || undefined,
      annee: this.annee || undefined,
      numeroPeriode: this.numeroPeriode || undefined
    };

    this.rechercheService.rechercher(filtres).subscribe({
      next: (data) => {
        this.factures.set(data.factures);
        this.facturesConsolidees.set(data.facturesConsolidees);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onReset(): void {
    this.client = '';
    this.onProjetChange(null);
    this.loadAll();
  }

  libellePeriode(typePeriode: string, numeroPeriode: number, annee: number): string {
    if (typePeriode === 'mensuelle') {
      const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      return `${mois[numeroPeriode - 1]} ${annee}`;
    }
    if (typePeriode === 'trimestrielle') {
      return `T${numeroPeriode} ${annee}`;
    }
    return `S${numeroPeriode} ${annee}`;
  }

  libelleNumero(numeroPeriode: number): string {
    if (this.typePeriode === 'mensuelle') {
      const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      return mois[numeroPeriode - 1] || `${numeroPeriode}`;
    }
    if (this.typePeriode === 'trimestrielle') {
      return `T${numeroPeriode}`;
    }
    if (this.typePeriode === 'semestrielle') {
      return `S${numeroPeriode}`;
    }
    return `${numeroPeriode}`;
  }
}