import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  private spinnerService = inject<NgxSpinnerService>(NgxSpinnerService);

  busy(): void {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: "ball-spin-clockwise-fade",
      bdColor: 'rgba(255, 255, 255, 0.25)',
      color: '#333333'
    })
  }

  idle(): void {
    this.busyRequestCount--;

    if(this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
