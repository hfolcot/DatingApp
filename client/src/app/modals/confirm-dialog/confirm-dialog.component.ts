import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  bsModalRef = inject<BsModalRef>(BsModalRef);
  title: string = "";
  message: string = "";
  btnOkText: string = "";
  btnCancelText: string = "";
  result: boolean = false;

  confirm(): void {
    this.result = true;
    this.bsModalRef.hide();
  }

  decline(): void {
    this.bsModalRef.hide();
  }
}
