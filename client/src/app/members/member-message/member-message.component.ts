import { Component, inject, input, viewChild } from '@angular/core';
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
  messageService = inject<MessageService>(MessageService);
  username = input.required<string>();
  messageContent: string = "";
  messageForm = viewChild<NgForm>('messageForm');

  sendMessage() {
    this.messageService.sendMessage(this.username(), this.messageContent).then(() => {
      this.messageForm()?.reset();
    });
  }
}
