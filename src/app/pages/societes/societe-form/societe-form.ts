import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SocietesService } from '../../../services/societes';
import { Societe } from '../../../models/societe.model';
import { Devise } from '../../../models/devise.model';

@Component({
  selector: 'app-societe-form',
  imports: [FormsModule],
  templateUrl: './societe-form.html',
  styleUrl: './societe-form.scss'
})
export class SocieteFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() societeToEdit: Societe | null = null;

  nom = '';
  adresse = '';
  telephone = '';
  email = '';
  personne_contact = '';
  devise: Devise = Devise.TND;

  devisesDisponibles = Object.values(Devise);

  errorMessage = signal<string | null>(null);
  isSaving = signal(false);

  constructor(
    public activeModal: NgbActiveModal,
    private societesService: SocietesService
  ) {}

  ngOnInit(): void {
    if (this.mode === 'edit' && this.societeToEdit) {
      this.nom = this.societeToEdit.nom;
      this.adresse = this.societeToEdit.adresse || '';
      this.telephone = this.societeToEdit.telephone;
      this.email = this.societeToEdit.email;
      this.personne_contact = this.societeToEdit.personne_contact || '';
      this.devise = this.societeToEdit.devise || Devise.TND;
    }
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.isSaving.set(true);

    const payload = {
      nom: this.nom,
      adresse: this.adresse,
      telephone: this.telephone,
      email: this.email,
      personne_contact: this.personne_contact,
      devise: this.devise
    };

    const request$ = this.mode === 'create'
      ? this.societesService.create(payload)
      : this.societesService.update(this.societeToEdit!.id, payload);

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