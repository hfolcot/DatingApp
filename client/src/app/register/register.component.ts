import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accountService= inject<AccountService>(AccountService);
  private toastr = inject<ToastrService>(ToastrService);

  model: any = {};

  cancelRegister = output<void>();

  register(): void {
    this.accountService.register(this.model).subscribe({
      next: user => {
        this.cancel();
      },
      error: error => this.toastr.error(error.error)
    });
  }

  cancel(): void {
    this.cancelRegister.emit();
  }
}
