import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjetsService } from '../../../services/projets';
import { SocietesService } from '../../../services/societes';
import { Projet, StatutProjet } from '../../../models/projet.model';
import { Societe } from '../../../models/societe.model';

@Component({
  selector: 'app-projet-form',
  imports: [FormsModule],
  templateUrl: './projet-form.html',
  styleUrl: './projet-form.scss'
})
export class ProjetFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() projetToEdit: Projet | null = null;
  @Input() preselectedSocieteId: number | null = null;
  numero_so = '';
  nom_projet = '';
  date_debut = '';
  statut: StatutProjet = StatutProjet.ACTIF;
  societe_id: number | null = null;

  societes = signal<Societe[]>([]);
  statutOptions = Object.values(StatutProjet);

  errorMessage = signal<string | null>(null);
  isSaving = signal(false);

  constructor(
    public activeModal: NgbActiveModal,
    private projetsService: ProjetsService,
    private societesService: SocietesService
  ) {}

  ngOnInit(): void {
    this.societesService.findAll().subscribe({
      next: (societes) => this.societes.set(societes)
    });

    if (this.mode === 'edit' && this.projetToEdit) {
      this.numero_so = this.projetToEdit.numero_so;
      this.nom_projet = this.projetToEdit.nom_projet;
      this.date_debut = this.projetToEdit.date_debut.substring(0, 10);
      this.statut = this.projetToEdit.statut;
      this.societe_id = this.projetToEdit.societe_id;
    }
    else if (this.preselectedSocieteId) {
    this.societe_id = this.preselectedSocieteId;
  }
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (!this.societe_id) {
      this.errorMessage.set('Veuillez sélectionner une société.');
      return;
    }

    this.isSaving.set(true);

    const payload = {
      numero_so: this.numero_so,
      nom_projet: this.nom_projet,
      date_debut: this.date_debut,
      statut: this.statut,
      societe_id: this.societe_id
    };

    const request$ = this.mode === 'create'
      ? this.projetsService.create(payload)
      : this.projetsService.update(this.projetToEdit!.id, payload);

    request$.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.activeModal.close('saved');
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.message || "Erreur lors de l'enregistrement");
      }
    });
  }
}