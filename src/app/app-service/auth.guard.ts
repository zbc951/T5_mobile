import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AppRoutes } from '../constant/routes';
import { map, tap, delay } from 'rxjs/operators';
import { PublicService } from './../app-service/public.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private publicService: PublicService
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // console.log('next', next);
    // console.log('state', state);
    const url = state.url;
    // console.log('url', url);

    return this.auth.isLogin()
      .pipe(
        // delay(1000),
        // take(1),
        map((res) => {
          // console.log('map res', res);
          return res;
        }),
        // delay(1000),
        tap((isLogin) => {

          // console.log('loggedIn', isLogin);
          if (!isLogin) {

            // console.log(this.auth.user);

            this.router.navigateByUrl(AppRoutes.HOME);

            if (this.publicService.isMaintain) {

              return;

            }

            setTimeout(() => {
              if (this.auth.user) {
                // console.log('url', url);
                this.router.navigateByUrl(url);
              } else {
                this.router.navigate([{ outlets: { popup: [AppRoutes.LOGIN] } }]);
              }

            }, 1000);
          }
        })
      );

  }


}
