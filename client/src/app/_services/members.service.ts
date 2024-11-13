import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of, tap } from 'rxjs';
import { Member } from '../_models/Member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject<HttpClient>(HttpClient);
  baseUrl = environment.apiUrl;
  private _members = signal<Member[]>([]);
  members = this._members.asReadonly();

  getMembers(): void {
    this.http.get<Member[]>(this.baseUrl + "users").subscribe({
      next: (members) => {
        this._members.set(members);
      }
    }
    );
  }

  getMember(username: string): Observable<Member> {
    const member = this.members().find((x => x.username === username));

    if(member) {
      return of(member);
    }

    return this.http.get<Member>(this.baseUrl + "users/" + username);
  }

  updateMember(member: Member): Observable<void> {
    return this.http.put<void>(this.baseUrl + 'users', member).pipe(
      tap(() => {
        this._members.update(prevMembers => {
          return [...prevMembers.filter(m => m.username != member.username), member]
        })
      })
    )
  }

}
