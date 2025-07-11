import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/messages']);
      },
      error: (error) => {
        this.loading = false;
        this.handleLoginError(error);
      }
    });
  }

  private handleLoginError(error: any): void {
    // Set a default error message
    this.errorMessage = 'Login failed. Please try again.';
    
    // Try to extract a more specific error message
    if (error.error) {
      if (typeof error.error === 'string') {
        this.errorMessage = error.error;
      } else if (error.error.status && error.error.status.message) {
        this.errorMessage = error.error.status.message;
      } else if (error.error.error) {
        this.errorMessage = error.error.error;
      } else if (error.error.message) {
        this.errorMessage = error.error.message;
      } else if (Array.isArray(error.error)) {
        this.errorMessage = error.error.join(', ');
      }
    } else if (error.message) {
      this.errorMessage = error.message;
    } else if (error.status === 401) {
      this.errorMessage = 'Invalid email or password';
    } else if (error.status === 422) {
      this.errorMessage = 'Please check your input and try again';
    } else if (error.status === 0) {
      this.errorMessage = 'Unable to connect to server. Please check your connection.';
    }
  }

  clearError(): void {
    this.errorMessage = '';
  }
} 