import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';

@Component({
  selector: 'app-photo-management',
  standalone: true,
  imports: [],
  templateUrl: './photo-management.component.html',
  styleUrl: './photo-management.component.css'
})
export class PhotoManagementComponent implements OnInit {
  adminService = inject<AdminService>(AdminService);

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.adminService.getPhotosForApproval().subscribe();
  }

  approvePhoto(photoId: number): void {
    this.adminService.approvePhoto(photoId).subscribe({
      next: () => console.log("photo approved")
    })
  }

  rejectPhoto(photoId: number): void {
    this.adminService.rejectPhoto(photoId).subscribe({
      next: () => console.log("photo rejected")
    })
  }
}
