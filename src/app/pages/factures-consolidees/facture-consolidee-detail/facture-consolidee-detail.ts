import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FacturesConsolideesService } from '../../../services/factures-consolidees';
import { FactureConsolidee } from '../../../models/facture-consolidee.model';

@Component({
  selector: 'app-facture-consolidee-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './facture-consolidee-detail.html',
  styleUrl: './facture-consolidee-detail.scss'
})
export class FactureConsolideeDetail implements OnInit {
  consolidee = signal<FactureConsolidee | null>(null);
  isLoading = signal(false);
  consolideeId!: number;

  constructor(
    private route: ActivatedRoute,
    private facturesConsolideesService: FacturesConsolideesService
  ) {}

  ngOnInit(): void {
    this.consolideeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadConsolidee();
  }

  loadConsolidee(): void {
    this.isLoading.set(true);
    this.facturesConsolideesService.findOne(this.consolideeId).subscribe({
      next: (consolidee) => {
        this.consolidee.set(consolidee);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  libellePeriode(): string {
    const fc = this.consolidee();
    if (!fc) return '';
    if (fc.type_periode === 'mensuelle') {
      const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      return `${mois[fc.numero_periode - 1]} ${fc.annee}`;
    }
    if (fc.type_periode === 'trimestrielle') {
      return `T${fc.numero_periode} ${fc.annee}`;
    }
    return `S${fc.numero_periode} ${fc.annee}`;
  }
}