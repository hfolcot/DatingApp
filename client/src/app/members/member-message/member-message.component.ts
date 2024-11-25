import { AfterViewInit, Component, inject, input, viewChild } from '@angular/core';
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
export class MemberMessageComponent implements AfterViewInit {
  messageService = inject<MessageService>(MessageService);
  username = input.required<string>();
  messageContent: string = "";
  messageForm = viewChild<NgForm>('messageForm');
  scrollContainer = viewChild<any>('scrollMe');
  
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  sendMessage() {
    this.messageService.sendMessage(this.username(), this.messageContent).then(() => {
      this.messageForm()?.reset();
      this.scrollToBottom();
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if(this.scrollContainer()) {
        this.scrollContainer().nativeElement.scrollTop = this.scrollContainer().nativeElement.scrollHeight;
      }
    }, 100)
  }
}
