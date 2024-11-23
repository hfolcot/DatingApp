import { Directive, inject, input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  appHasRole = input.required<string[]>();
  private accountService = inject<AccountService>(AccountService);
  private viewContainerRef = inject<ViewContainerRef>(ViewContainerRef);
  private templateRef = inject<TemplateRef<any>>(TemplateRef);

  ngOnInit(): void {
    if(this.accountService.roles()?.some(r => this.appHasRole().includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainerRef.clear();
    }
  }
}
