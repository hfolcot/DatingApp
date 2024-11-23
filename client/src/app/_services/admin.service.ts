import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject<HttpClient>(HttpClient);

  getUserWithRoles(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'admin/users-with-roles');
  }

  updateUserRoles(username: string, roles: string[]): Observable<string[]> {
    return this.http.post<string[]>(this.baseUrl  + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }
}
