import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule,
    RouterLink,
    RouterLinkActive,
    BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  private accountService = inject<AccountService>(AccountService);
  private router = inject<Router>(Router);
  private toastr = inject<ToastrService>(ToastrService);
  currentUser = this.accountService.currentUser$;

  model: any = {};
  loggedIn = false;

  login(): void {
    this.accountService.login(this.model).subscribe({
      next: () => this.router.navigateByUrl('/members'),
      error: error => this.toastr.error(error.error)
    })
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}