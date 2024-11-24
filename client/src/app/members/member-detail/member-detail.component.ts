import { Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../_models/Member';
import { DatePipe } from '@angular/common';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessageComponent } from "../member-message/member-message.component";
import { Message } from '../../_models/Message';
import { MessageService } from '../../_services/message.service';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [DatePipe, TabsModule, GalleryModule, TimeagoModule, MemberMessageComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  private messageService = inject<MessageService>(MessageService);
  private accountService = inject<AccountService>(AccountService);
  private route = inject<ActivatedRoute>(ActivatedRoute);
  private router = inject<Router>(Router);
  presenceService = inject<PresenceService>(PresenceService);

  memberTabs = viewChild<TabsetComponent>('memberTabs');
  activeTab?: TabDirective;
  member: Member = {} as Member;
  images: GalleryItem[] = [];

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.member && this.member.photos.map(photo => {
          this.images.push(new ImageItem({
            src: photo.url,
            thumb: photo.url
          }))
        })
      }
    });
    
    this.route.paramMap.subscribe({
      next: () => this.onRouteParamsChange()
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  selectTab(heading: string): void {
    if(this.memberTabs()) {
      const messageTab = this.memberTabs()?.tabs.find(x => x.heading === heading);
      if(messageTab) messageTab.active = true;
    }
  }

  onRouteParamsChange(): void {
    const user = this.accountService.currentUser$();
    if(!user) return;

    if(this.messageService.hubConnection?.state == HubConnectionState.Connected && this.activeTab?.heading == "Messages"){
      this.messageService.hubConnection?.stop().then(() => {
        this.messageService.createHubConnection(user, this.member.username);
      })
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: this.activeTab.heading},
      queryParamsHandling: 'merge'
    });

    if (this.activeTab.heading === 'Messages' && this.member) {
     const user = this.accountService.currentUser$();
     if(!user) return;
     this.messageService.createHubConnection(user, this.member.username);
    }
    else {
      this.messageService.stopHubConnection();
    }
  }

}
