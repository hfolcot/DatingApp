import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Member } from '../_models/Member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject<HttpClient>(HttpClient);
  baseUrl = environment.apiUrl;

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.baseUrl + "users");
  }

  getMember(username: string): Observable<Member> {
   return this.http.get<Member>(this.baseUrl + "users/" + username);
  }

}
