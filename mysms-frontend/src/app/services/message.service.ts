import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Message {
  _id?: string;
  id?: string;
  body: string;
  to: string;
  from: string;
  direction: 'outbound' | 'inbound';
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`, { 
      headers: this.authService.getAuthHeaders()
    });
  }

  getMessagesAfter(timestamp: string): Observable<Message[]> {
    const params = new HttpParams().set('after', timestamp);
    return this.http.get<Message[]>(`${this.apiUrl}/messages`, { 
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  sendMessage(message: { body: string; to: string }): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages`, { 
      message
    }, { 
      headers: this.authService.getAuthHeaders()
    });
  }
}
