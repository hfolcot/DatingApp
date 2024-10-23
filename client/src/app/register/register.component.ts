import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accountService= inject<AccountService>(AccountService);

  model: any = {};

  users = input.required();

  cancelRegister = output<void>();

  register(): void {
    this.accountService.register(this.model).subscribe({
      next: user => {
        this.cancel();
      },
      error: error => console.error(error)
    });
  }

  cancel(): void {
    this.cancelRegister.emit();
  }
}
