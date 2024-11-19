import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<string>('text');

  constructor(@Self() public ngControl: NgControl){
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
    //throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    //throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    //throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    //throw new Error('Method not implemented.');
  }
  
  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
