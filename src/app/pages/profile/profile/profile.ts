import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  UserRole = UserRole;

  constructor(protected authService: AuthService) {}

  roleLabel(role: UserRole): string {
    return role === UserRole.ADMIN ? 'Administrateur' : 'Consultant';
  }
}