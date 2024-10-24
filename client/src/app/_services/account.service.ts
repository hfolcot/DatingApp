import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject<HttpClient>(HttpClient);
  baseUrl = 'https://localhost:5001/api/';
  currentUser = signal<User | null>(null);

  currentUser$ = this.currentUser.asReadonly();

  login(model: any): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user => {
          localStorage.setItem("user", JSON.stringify(user))
          this.currentUser.set(user);
          return user;
      }
    ));
  }
  
  register(model: any): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
          localStorage.setItem("user", JSON.stringify(user))
          this.currentUser.set(user);
          return user;
      }
    ));
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
