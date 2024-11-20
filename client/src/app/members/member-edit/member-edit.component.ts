import { Component, HostListener, inject, OnInit, viewChild } from '@angular/core';
import { Member } from '../../_models/Member';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, DatePipe, TimeagoModule, FormsModule, PhotoEditorComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  member?: Member;
  private accountService = inject<AccountService>(AccountService);
  private memberService = inject<MembersService>(MembersService);
  private toastr = inject<ToastrService>(ToastrService);

  editForm = viewChild<NgForm>("editForm");

  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if(this.editForm()?.dirty) {
      $event.returnValue = true;
    }
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(): void {
    const user = this.accountService.currentUser$();

    if (!user) {
      return;
    }
    this.memberService.getMember(user.username).subscribe({
      next: member => this.member = member
    })
  }

  updateMember(): void {
    this.memberService.updateMember(this.editForm()?.value).subscribe({
      complete: () => {
        this.toastr.success("Profile updated successfully");
        this.editForm()?.reset(this.member);
      }
    })
  }

  onMemberChange(member: Member): void {
    this.member = member;
  }
}
