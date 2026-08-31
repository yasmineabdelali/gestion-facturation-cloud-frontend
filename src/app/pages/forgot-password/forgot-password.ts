import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  email = '';
  message = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.message.set(null);
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.message.set(res.message);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Une erreur est survenue');
      }
    });
  }
}