import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/Member';
import { DatePipe } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [DatePipe, TabsModule, GalleryModule, TimeagoModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  private memberService = inject<MembersService>(MembersService);
  private router = inject<ActivatedRoute>(ActivatedRoute);

  member?: Member;
  images: GalleryItem[] = [];

ngOnInit(): void {
this.loadMember();
}

loadMember(): void {
  const username = this.router.snapshot.paramMap.get('username');
  
  if(!username) {
    return;
  }

  this.memberService.getMember(username).subscribe({
    next: member => {
      this.member = member;
      member.photos.map(photo => {
        this.images.push(new ImageItem({
          src: photo.url,
          thumb: photo.url
        }))
      })
    }
  });
}
}
