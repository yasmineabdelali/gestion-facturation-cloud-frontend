import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../../services/users';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [FormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() userToEdit: User | null = null;

  nom = '';
  email = '';
  password = '';
  role = 'consultant';

  errorMessage = signal<string | null>(null);
  isSaving = signal(false);

  constructor(
    public activeModal: NgbActiveModal,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    if (this.mode === 'edit' && this.userToEdit) {
      this.nom = this.userToEdit.nom;
      this.email = this.userToEdit.email;
      this.role = this.userToEdit.role;
      // Le mot de passe reste vide en édition : on ne le change que si l'admin le renseigne
    }
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.isSaving.set(true);

    if (this.mode === 'create') {
      this.usersService.create({ nom: this.nom, email: this.email, password: this.password, role: this.role }).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.activeModal.close('saved');
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.message || 'Erreur lors de la création');
        },
      });
    } else if (this.userToEdit) {
      const payload: Record<string, string> = { nom: this.nom, email: this.email, role: this.role };
      if (this.password) {
        payload['password'] = this.password;
      }
      this.usersService.update(this.userToEdit.id, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.activeModal.close('saved');
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.message || 'Erreur lors de la modification');
        },
      });
    }
  }
}