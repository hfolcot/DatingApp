import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from '../_models/Message';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ButtonsModule, FormsModule, TimeagoModule, RouterLink, PaginationModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  messageService = inject<MessageService>(MessageService);
  container = "Inbox";
  pageNumber = 1;
  pageSize = 5;
  isOutbox = this.container === "Outbox";

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container);
  }

  getRoute(message: Message): string {
    if(this.container === 'Outbox') {
      return `/members/${message.recipientUsername}`;
    }
    else {
      return `/members/${message.senderUsername}`;
    }
  }

  pageChanged(event: PageChangedEvent): void {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }

  deleteMessage(id: number): void {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messageService.paginatedResult.update(prev => {
          if(prev && prev.items) {
            prev.items = prev.items?.filter(item => item.id !== id);
            return prev;
          }

          return prev;
        })
      }
    });
  }
}
