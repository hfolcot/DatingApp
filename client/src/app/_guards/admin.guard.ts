import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject<AccountService>(AccountService);
  const toastr = inject<ToastrService>(ToastrService);

  if(accountService.roles().includes("Admin") || accountService.roles().includes("Moderator")) {
    return true;
  }

  toastr.error("You cannot enter this area");
  return false;
};
