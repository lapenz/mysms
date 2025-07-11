import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  phone_number: string;
}

export interface AuthResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    user: User;
  };
  token: string;
}

export interface MeResponse {
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const token = this.getToken();
    if (token) {
      this.getCurrentUser().subscribe({
        next: (response) => {
          this.currentUserSubject.next(response.user);
        },
        error: (error) => {
          console.error('Error getting current user:', error);
          // If token is invalid, clear it
          this.clearToken();
          this.currentUserSubject.next(null);
        }
      });
    }
  }

  register(userData: { email: string; password: string; password_confirmation: string; name: string; phone_number: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users`, { user: userData });
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/users/sign_in`, { user: credentials })
      .pipe(
        map(response => {
          // Check if this is actually an error response
          if (response.status && response.status.message && 
              (response.status.message.includes('Invalid') || 
               response.status.message.includes('failed') ||
               response.status.message.includes('error'))) {
            throw { error: response };
          }
          
          // Check if we have the required fields for success
          if (!response.token || !response.data || !response.data.user) {
            throw { error: { message: 'Invalid response format' } };
          }
          
          return response as AuthResponse;
        }),
        tap(response => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.data.user);
        }),
        catchError(error => {
          throw error;
        })
      );
  }

  logout(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/sign_out`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => {
          this.clearToken();
          this.currentUserSubject.next(null);
        })
      );
  }

  getCurrentUser(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/auth/me`, { headers: this.getAuthHeaders() });
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    localStorage.removeItem('auth_token');
  }

  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
} 