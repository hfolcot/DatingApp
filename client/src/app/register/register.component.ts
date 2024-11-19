import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private accountService= inject<AccountService>(AccountService);
  private router = inject<Router>(Router);
  private fb = inject<FormBuilder>(FormBuilder);

  model: any = {};

  cancelRegister = output<void>();

  registerForm: FormGroup = new FormGroup({});
  maxDate = new Date();
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initialiseForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    const values = this.registerForm.value;
    values.dateOfBirth = dob;
    this.accountService.register(values).subscribe({
      next: _ => this.router.navigateByUrl('/members') ,
      error: error => this.validationErrors = error
    })
  }

  cancel(): void {
    this.cancelRegister.emit();
  }

  private initialiseForm(): void {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', [Validators.required]],
      knownAs: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching : true};
    }
  }

  private getDateOnly(dob: string | undefined) {
    if(!dob) return;

    return new Date(dob).toISOString().slice(0, 10);
  }
}
