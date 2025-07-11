import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './message-form.component.html',
  styleUrl: './message-form.component.css'
})
export class MessageFormComponent {
  @Output() messageSent = new EventEmitter<void>();
  
  message = {
    body: '',
    to: ''
  };
  
  sending = false;

  constructor(
    private messageService: MessageService,
    private snackBar: MatSnackBar
  ) {}

  sendMessage(): void {
    if (!this.message.body.trim() || !this.message.to.trim()) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }

    this.sending = true;
    this.messageService.sendMessage(this.message).subscribe({
      next: (response) => {
        this.snackBar.open('Message sent successfully!', 'Close', { duration: 3000 });
        // Clear only the message body, keep the phone number
        this.message.body = '';
        this.messageSent.emit();
        this.sending = false;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.snackBar.open('Failed to send message. Please try again.', 'Close', { duration: 3000 });
        this.sending = false;
      }
    });
  }
}
