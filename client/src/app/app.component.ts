import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AccountService } from './_services/account.service';
import { User } from './_models/User';
import { HomeComponent } from "./home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private accountService = inject<AccountService>(AccountService);

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    const userString = localStorage.getItem("user");
    
    if(!userString) {
      return;
    }

    const user: User = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

}
