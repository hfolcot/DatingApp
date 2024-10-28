import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject<AccountService>(AccountService);
  const toastr = inject<ToastrService>(ToastrService);

  if(accountService.currentUser()) {
    return true;
  }
  else {
    toastr.info("Login required");
    return false;
  }
};
