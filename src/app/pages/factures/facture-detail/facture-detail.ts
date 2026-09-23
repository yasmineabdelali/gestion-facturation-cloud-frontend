import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FacturesService, UpdateLignePayload } from '../../../services/factures';
import { AuthService } from '../../../services/auth';
import { Facture } from '../../../models/facture.model';
import { NotificationsService } from '../../../services/notifications';
import { DevisePipe } from '../../../pipes/devise.pipe';

@Component({
  selector: 'app-facture-detail',
  imports: [CommonModule, RouterLink, FormsModule,DevisePipe],
  templateUrl: './facture-detail.html',
  styleUrl: './facture-detail.scss'
})
export class FactureDetail implements OnInit {
  facture = signal<Facture | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

quantites: Record<number, number | undefined> = {};
  factureId!: number;

  constructor(
    private route: ActivatedRoute,
    private facturesService: FacturesService,
    protected authService: AuthService,
      private notificationsService: NotificationsService

  ) {}

  ngOnInit(): void {
    this.factureId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadFacture();
  }

  loadFacture(): void {
    this.isLoading.set(true);
    this.facturesService.findOne(this.factureId).subscribe({
      next: (facture) => {
        this.facture.set(facture);
        for (const ligne of facture.lignes) {
          this.quantites[ligne.id] = Number(ligne.quantite_consommee);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  get isModifiable(): boolean {
    return this.facture()?.statut === 'brouillon';
  }

  get isAdmin(): boolean {
    return this.authService.currentUser()?.role === 'admin';
  }

  get montantEstime(): number {
    const f = this.facture();
    if (!f) return 0;
    return f.lignes.reduce((sum, l) => sum + (this.quantites[l.id] ?? 0) * Number(l.prix_unitaire), 0);
  }

  onSaveLignes(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isSaving.set(true);

    const lignes: UpdateLignePayload[] = this.facture()!.lignes.map((l) => ({
      id: l.id,
      quantite_consommee: this.quantites[l.id] ?? 0
    }));

    this.facturesService.updateLignes(this.factureId, lignes).subscribe({
      next: (facture) => {
        this.facture.set(facture);
        this.isSaving.set(false);
        this.successMessage.set('Consommation enregistrée avec succès.');
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.message || "Erreur lors de l'enregistrement");
      }
    });
  }

onValider(): void {
  if (!confirm('Valider cette facture ? Elle ne pourra plus être modifiée sans autorisation administrateur.')) {
    return;
  }
  this.facturesService.valider(this.factureId).subscribe({
    next: (facture) => {
      this.facture.set(facture);
      this.successMessage.set('Facture validée avec succès.');
      this.notificationsService.retirerFacture(this.factureId);
    },
    error: (err) => {
      this.errorMessage.set(err.error?.message || 'Erreur lors de la validation');
    }
  });
}

  onDevalider(): void {
    if (!confirm('Remettre cette facture en brouillon ?')) {
      return;
    }
    this.facturesService.devalider(this.factureId).subscribe({
      next: (facture) => {
        this.facture.set(facture);
        this.successMessage.set('Facture remise en brouillon.');
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erreur lors de la dévalidation');
      }
    });
  }
  onDownloadPdf(): void {
  this.facturesService.downloadPdf(this.factureId);
}
  onDownloadExcel(): void {
  this.facturesService.downloadExcel(this.factureId);
}
}