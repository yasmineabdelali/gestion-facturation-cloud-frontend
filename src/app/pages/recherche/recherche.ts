import { Component, signal, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OperatorFunction, Subject, merge } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { RechercheService } from '../../services/recherche';
import { RechercheFiltres, RechercheResultats } from '../../models/recherche.model';
import { TypePeriode } from '../../models/facture.model';
import { SocietesService } from '../../services/societes';
import { ProjetsService } from '../../services/projets';
import { Societe } from '../../models/societe.model';
import { Projet } from '../../models/projet.model';
import { NgbTypeahead, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recherche',
  imports: [CommonModule, FormsModule, RouterLink, NgbTypeaheadModule],
  templateUrl: './recherche.html',
  styleUrl: './recherche.scss'
})
export class Recherche implements OnInit {
  @ViewChild('instanceSo', { static: true }) instanceSo!: NgbTypeahead;

  client = '';
  so = '';
  typePeriode: TypePeriode | '' = '';
  annee: number | null = null;
  numeroPeriode: number | null = null;
  typeOptions = Object.values(TypePeriode);
  societes = signal<Societe[]>([]);
  projets = signal<Projet[]>([]);

  focusSo$ = new Subject<string>();
  clickSo$ = new Subject<string>();

  resultats = signal<RechercheResultats | null>(null);
  isLoading = signal(false);
  aRecherche = signal(false);

  constructor(
    private rechercheService: RechercheService,
    private societesService: SocietesService,
    private projetsService: ProjetsService
  ) {}

  ngOnInit(): void {
    this.societesService.findAll().subscribe({
      next: (data) => this.societes.set(data)
    });
    this.projetsService.findAll().subscribe({
      next: (data) => this.projets.set(data)
    });
  }

  rechercheClient: OperatorFunction<string, readonly string[]> = (text$) =>
    text$.pipe(
      map((term) =>
        term.length < 1
          ? []
          : this.societes()
              .map((s) => s.nom)
              .filter((nom) => nom.toLowerCase().includes(term.toLowerCase()))
              .slice(0, 10)
      )
    );

  rechercheSo: OperatorFunction<string, readonly string[]> = (text$) => {
    const debouncedText$ = text$;
    const clicksWithClosedPopup$ = this.clickSo$.pipe(
      filter(() => !this.instanceSo.isPopupOpen())
    );
    const inputFocus$ = this.focusSo$;

    return merge(debouncedText$, clicksWithClosedPopup$, inputFocus$).pipe(
      map((term) =>
        this.projets()
          .filter((p) => !this.client || p.societe?.nom === this.client)
          .map((p) => `${p.numero_so} - ${p.nom_projet}`)
          .filter((label) => label.toLowerCase().includes(term.toLowerCase()))
          .slice(0, 10)
      )
    );
  };

  onRechercher(): void {
    this.isLoading.set(true);
    this.aRecherche.set(true);

    const filtres: RechercheFiltres = {
      client: this.client || undefined,
      so: this.so || undefined,
      typePeriode: this.typePeriode || undefined,
      annee: this.annee || undefined,
      numeroPeriode: this.numeroPeriode || undefined
    };

    this.rechercheService.rechercher(filtres).subscribe({
      next: (data) => {
        this.resultats.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onReset(): void {
    this.client = '';
    this.so = '';
    this.typePeriode = '';
    this.annee = null;
    this.numeroPeriode = null;
    this.resultats.set(null);
    this.aRecherche.set(false);
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
}