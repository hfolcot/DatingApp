import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Dating App';
  users: any;

  http = inject<HttpClient>(HttpClient);

  ngOnInit(): void {
    this.http.get(`https://localhost:5001/api/users`).subscribe({
      next: users => this.users = users,
      error: error => console.log(error),
      complete: () => console.log("Request has completed")
    })
  }
}
