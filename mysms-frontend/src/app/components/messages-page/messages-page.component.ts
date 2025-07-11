import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageFormComponent } from '../message-form/message-form.component';

@Component({
  selector: 'app-messages-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MessageListComponent, MessageFormComponent],
  templateUrl: './messages-page.component.html',
  styleUrls: ['./messages-page.component.css']
})
export class MessagesPageComponent {
  @ViewChild(MessageListComponent) messageListComponent?: MessageListComponent;

  onMessageSent(): void {
    this.messageListComponent?.loadMessages();
  }
} 