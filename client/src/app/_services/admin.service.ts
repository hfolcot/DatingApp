import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/User';
import { Observable, tap } from 'rxjs';
import { Photo } from '../_models/Photo';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject<HttpClient>(HttpClient);
  private _photosForApproval = signal<Photo[]>([]);
  photosForApproval = this._photosForApproval.asReadonly();

  getUserWithRoles(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'admin/users-with-roles');
  }

  updateUserRoles(username: string, roles: string[]): Observable<string[]> {
    return this.http.post<string[]>(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }

  getPhotosForApproval(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.baseUrl + 'admin/photos-to-moderate').pipe(tap(photos => {
      this._photosForApproval.set(photos);
    }));
  }

  approvePhoto(photoId: number): Observable<void> {
    return this.http.post<void>(this.baseUrl + 'admin/approve-photo/' + photoId, {}).pipe(tap(() => {
      this.removePhotoFromPhotosToApprove(photoId);
    }));
  }

  rejectPhoto(photoId: number): Observable<void> {
    return this.http.post<void>(this.baseUrl + 'admin/reject-photo/' + photoId, {}).pipe(tap(() => {
      this.removePhotoFromPhotosToApprove(photoId);
    }));
  }

  private removePhotoFromPhotosToApprove(photoId: number): void {
    this._photosForApproval.update(photos => {
      return photos.filter(p => p.id !== photoId);
    })
  }
}
