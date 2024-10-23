import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule,
    BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  private accountService = inject<AccountService>(AccountService);
  currentUser = this.accountService.currentUser$;

  model: any = {};
  loggedIn = false;

  login(): void {
    this.accountService.login(this.model).subscribe()
  }

  logout(): void {
    this.accountService.logout();
  }
}
