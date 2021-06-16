import { Injectable } from '@angular/core';
import { Router, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { OfferApplyComponent, tabs } from './offer-apply/offer-apply.component';
import { AppRoutes } from './constant/routes';
import { MemberService } from './app-service/member.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<OfferApplyComponent> {

  constructor(
    private router: Router,
    private memberService: MemberService
  ) {

  }

  canDeactivate(
    component: OfferApplyComponent,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (component.nowType !== tabs.PRIORITY) {
      return true;
    }

    if (component.isOrderChanged) {

      return component.canDeactivate();

    } else {

      return true;

    }



  }

}
