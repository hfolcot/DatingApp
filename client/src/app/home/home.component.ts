import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private http = inject<HttpClient>(HttpClient);
  registerMode = false;

  users: any;

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  
  getUsers(): void {
    this.http.get(`https://localhost:5001/api/users`).subscribe({
      next: users => this.users = users,
      error: error => console.log(error),
      complete: () => console.log("Request has completed")
    })
  }
}
