import { MembersService } from './members.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Member } from "../_models/member";

@Injectable({
  providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member>{

  constructor(private memberService: MembersService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
    return this.memberService.getMember(route.paramMap.get('username'));
  }

}
