import { Component, inject, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/Member';
import { DatePipe } from '@angular/common';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessageComponent } from "../member-message/member-message.component";
import { Message } from '../../_models/Message';
import { MessageService } from '../../_services/message.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [DatePipe, TabsModule, GalleryModule, TimeagoModule, MemberMessageComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  private messageService = inject<MessageService>(MessageService);
  private router = inject<ActivatedRoute>(ActivatedRoute);

  memberTabs = viewChild<TabsetComponent>('memberTabs');
  activeTab?: TabDirective;
  messages: Message[] = [];
  member: Member = {} as Member;
  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.router.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.member && this.member.photos.map(photo => {
          this.images.push(new ImageItem({
            src: photo.url,
            thumb: photo.url
          }))
        })
      }
    })

    this.router.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  onUpdateMessages(message: Message): void {
    this.messages.push(message);
  }

  selectTab(heading: string): void {
    if(this.memberTabs()) {
      const messageTab = this.memberTabs()?.tabs.find(x => x.heading === heading);
      if(messageTab) messageTab.active = true;
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0 && this.member) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

}
