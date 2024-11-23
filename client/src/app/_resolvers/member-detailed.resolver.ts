import { ResolveFn } from '@angular/router';
import { Member } from '../_models/Member';
import { MembersService } from '../_services/members.service';
import { inject } from '@angular/core';

export const memberDetailedResolver: ResolveFn<Member | null> = (route, state) => {
  const memberService = inject<MembersService>(MembersService);

  const username = route.paramMap.get('username');

  if(!username) return null;

  return memberService.getMember(username);
};