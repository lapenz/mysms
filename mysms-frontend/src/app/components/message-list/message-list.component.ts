import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageService, Message } from '../../services/message.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  
  messages: Message[] = [];
  loading = false;
  private shouldScroll = false;
  private pollSub?: Subscription;
  private lastMessageTimestamp?: string;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.pollSub = interval(5000).subscribe(() => this.loadNewMessages());
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  loadMessages(): void {
    this.loading = true;
    this.messageService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.updateLastTimestamp();
        this.loading = false;
        this.shouldScroll = true;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.loading = false;
      }
    });
  }

  loadNewMessages(): void {
    if (!this.lastMessageTimestamp) {
      // If no timestamp, fall back to full load
      this.loadMessages();
      return;
    }

    this.messageService.getMessagesAfter(this.lastMessageTimestamp).subscribe({
      next: (newMessages) => {
        if (newMessages.length > 0) {
          // Check for new incoming messages
          const newIncomingMessages = newMessages.filter(msg => msg.direction === 'inbound');
          
          if (newIncomingMessages.length > 0) {
            // Play sound for new incoming messages
            this.playNotificationSound();
          }
          
          // Add new messages to the existing list
          this.messages = [...this.messages, ...newMessages];
          this.updateLastTimestamp();
          this.shouldScroll = true;
          
          // Trigger visual pulse for new messages after DOM update
          setTimeout(() => {
            this.triggerMessagePulse(newMessages);
          }, 300);
        }
      },
      error: (error) => {
        console.error('Error loading new messages:', error);
        // On error, fall back to full load
        this.loadMessages();
      }
    });
  }

  private updateLastTimestamp(): void {
    if (this.messages.length > 0) {
      const lastMessage = this.messages[this.messages.length - 1];
      this.lastMessageTimestamp = lastMessage.created_at;
    }
  }

  private playNotificationSound(): void {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Silent fail for audio errors
    }
  }

  private triggerMessagePulse(newMessages: Message[]): void {
    // Get all message elements
    const messageElements = document.querySelectorAll('.message-card');
    
    newMessages.forEach((newMessage, index) => {
      // Try both _id and id fields
      const messageId = newMessage._id || newMessage.id;
      
      // Find the element that corresponds to this new message
      const messageElement = Array.from(messageElements).find(element => {
        const elementId = element.getAttribute('data-message-id');
        return elementId === messageId;
      });
      
      if (messageElement) {
        setTimeout(() => {
          messageElement.classList.add('new-message-pulse');
          
          setTimeout(() => {
            messageElement.classList.remove('new-message-pulse');
          }, 2000); // Remove pulse class after 2 seconds
        }, index * 300); // Stagger the pulses with more delay
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  trackByMessage(index: number, message: Message): string {
    return message._id || message.id || index.toString();
  }

  private scrollToBottom(): void {
    try {
      const element = this.messageContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
