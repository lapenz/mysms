import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userData = {
    email: '',
    password: '',
    password_confirmation: '',
    name: '',
    phone_number: ''
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

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.loading = false;
        // After successful registration, log the user in
        this.authService.login({
          email: this.userData.email,
          password: this.userData.password
        }).subscribe({
          next: () => {
            this.router.navigate(['/messages']);
          },
          error: (error) => {
            this.errorMessage = 'Registration successful but login failed. Please try logging in.';
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.errors?.join(', ') || 'Registration failed';
      }
    });
  }
} 