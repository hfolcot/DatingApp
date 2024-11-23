import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/User';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private adminService = inject<AdminService>(AdminService);
  private modalService = inject<BsModalService>(BsModalService);
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  openRolesModal(user: User): void {
    const initialState: ModalOptions = {
      class : 'modal-lg',
      initialState: {
        title: "User Roles",
        availableRoles: ["Admin", "Moderator", "Member"],
        username: user.username,
        selectedRoles: [...user.roles],
        users: this.users,
        rolesUpdated: false
      }
    }

    this.bsModalRef = this.modalService.show(RolesModalComponent, initialState);

    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if(this.bsModalRef.content && this.bsModalRef.content.rolesUpdated) {
          const selectedRoles = this.bsModalRef.content.selectedRoles;
          this.adminService.updateUserRoles(user.username, selectedRoles).subscribe({
            next: roles => user.roles = roles
          })
        }
      }
    })
  }

  getUsersWithRoles(): void {
    this.adminService.getUserWithRoles().subscribe({
      next: users => this.users = users
    })
  }
  
}
