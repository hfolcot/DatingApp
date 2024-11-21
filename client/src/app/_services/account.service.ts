import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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
