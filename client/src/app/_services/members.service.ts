import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, model, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of, tap } from 'rxjs';
import { Member } from '../_models/Member';
import { Photo } from '../_models/Photo';
import { PaginatedResult } from '../_models/Pagination';
import { UserParams } from '../_models/UserParams';
import { AccountService } from './account.service';
import { setPaginatedResult, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject<HttpClient>(HttpClient);
  private accountService = inject<AccountService>(AccountService);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberCache = new Map();
  userParams = signal<UserParams>(new UserParams(this.accountService.currentUser$()));

  resetUserParams(): void {
    this.userParams.set(new UserParams(this.accountService.currentUser$()));
  }

  getMembers(): void {
    const response = this.memberCache.get(Object.values(this.userParams()).join('-'));

    if(response) {
      setPaginatedResult(response, this.paginatedResult);
      return;
    }

    let params = setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);

    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    this.http.get<Member[]>(this.baseUrl + "users", { params, observe: 'response' }).subscribe({
      next: (response) => {
       setPaginatedResult(response, this.paginatedResult);
       this.memberCache.set(Object.values(this.userParams()).join('-'), response);
      }
    }
    );
  }

  getMember(username: string): Observable<Member> {
    const member: Member = [...this.memberCache.values()].reduce((arr, elem) => arr.concat(elem.body), [])
    .find((m: Member) => m.username === username);

    console.log(member)

    if(member) {
      return of(member);
    }

    return this.http.get<Member>(this.baseUrl + "users/" + username);
  }

  updateMember(member: Member): Observable<void> {
    return this.http.put<void>(this.baseUrl + 'users', member).pipe(
      // tap(() => {
      //   this._members.update(prevMembers => {
      //     return [...prevMembers.filter(m => m.username != member.username), member]
      //   })
      // })
    )
  }

  setMainPhoto(photo: Photo): Observable<any> {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photo.id, {})
    // .pipe(tap(
    //   () => {
    //     this._members.update(members => members.map(m => {
    //       if(m.photos.includes(photo)) {
    //         m.photoUrl == photo.url;
    //       }
    //       return m;
    //     }))
    //   }
    // ))
  }

  deletePhoto(photo: Photo): Observable<any> {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photo.id).pipe(
      // tap(() => {
      //   this._members.update(members => members.map(m => {
      //     if(m.photos.includes(photo)) {
      //       m.photos = m.photos.filter(c => c.id != photo.id);
      //     }
      //     return m;
      //   }))
      // })
    );
  }


}
