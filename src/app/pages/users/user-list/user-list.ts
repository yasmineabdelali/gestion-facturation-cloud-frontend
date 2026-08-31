import { Component, OnInit, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../../services/users';
import { User } from '../../../models/user.model';
import { UserFormComponent } from '../user-form/user-form';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  users = signal<User[]>([]);
  isLoading = signal(false);

  constructor(
    private usersService: UsersService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.usersService.findAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    const modalRef = this.modalService.open(UserFormComponent);
    modalRef.componentInstance.mode = 'create';

    modalRef.closed.subscribe((result) => {
      if (result === 'saved') {
        this.loadUsers();
      }
    });
  }

  openEditModal(user: User): void {
    const modalRef = this.modalService.open(UserFormComponent);
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.userToEdit = user;

    modalRef.closed.subscribe((result) => {
      if (result === 'saved') {
        this.loadUsers();
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Supprimer l'utilisateur "${user.nom}" ?`)) {
      return;
    }
    this.usersService.remove(user.id).subscribe({
      next: () => this.loadUsers(),
    });
  }
}