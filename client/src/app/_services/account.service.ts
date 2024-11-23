import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../_models/User';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject<HttpClient>(HttpClient);
  private likeService = inject<LikesService>(LikesService);
  private currentUser = signal<User | null>(null);
  roles = computed(() => {
    const user = this.currentUser();
    if(user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    };
    return [];
  })
  
  baseUrl = environment.apiUrl;

  currentUser$ = this.currentUser.asReadonly();

  login(model: any): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user => {
        this.setCurrentUser(user);
          return user;
      }
    ));
  }
  
  register(model: any): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
          this.setCurrentUser(user);
          return user;
      }
    ));
  }

  setCurrentUser(user: User):void {
    localStorage.setItem("user", JSON.stringify(user))
    this.currentUser.set(user);
    this.likeService.getLikeIds();
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
