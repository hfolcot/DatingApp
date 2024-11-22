import { Component, inject, input, output, viewChild } from '@angular/core';
import { Message } from '../../_models/Message';
import { TimeagoModule } from 'ngx-timeago';
import { MessageService } from '../../_services/message.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-message',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-message.component.html',
  styleUrl: './member-message.component.css'
})
export class MemberMessageComponent {
  private messageService = inject<MessageService>(MessageService);
  username = input.required<string>();
  messages = input.required<Message[]>();
  messageContent: string = "";
  updateMessages = output<Message>();
  messageForm = viewChild<NgForm>('messageForm');

  sendMessage() {
    this.messageService.sendMessage(this.username(), this.messageContent).subscribe({
      next: message => {
        this.updateMessages.emit(message);
        this.messageForm()?.reset();
      }
    })
  }
}
