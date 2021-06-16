import { AuthService } from './auth.service';
import { PublicService } from './public.service';
import { LangService } from './lang.service';
import { AppRoutes } from './../constant/routes';
import { environment } from './../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, empty } from 'rxjs';
import { finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import { CacheService } from './cache/cache.service';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import config from 'src/config';



@Injectable()
export class ResponseHandleHttpInterceptor implements HttpInterceptor {


  constructor(
    private injector: Injector,
    private router: Router,
    private toast: ToastService,
    private publicService: PublicService,
    private langService: LangService,
    private auth: AuthService
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log(req.url);

    // console.log('req', req);
    const { host, port } = config.Api;

    // console.log('host', host, 'port', port);

    // tell if proxy works
    if (environment.production === true) {


      if (req.url.startsWith('/api/')) {

        const tmpHost = port ? `${host}:${port}` : `${host}`;

        let tmpUrl = '';
        let tempurl = '';
        if (tmpHost.endsWith('/')) {

          // console.log('**');

          tempurl = req.url.substr(1);
          // console.log('tempurl', tempurl);


          tmpUrl = `${tmpHost}${tempurl}`;

        } else {
          tmpUrl = port ? `${host}:${port}${req.url}` : `${host}${req.url}`;
        }

        req = req.clone({
          withCredentials: true,
          url: tmpUrl
        });

        // console.log('req', req);
        // console.log('map', this.map);

      }
    } else {

      // console.log('withCredentials');

      req = req.clone({
        withCredentials: true,
      });
      // }

    }

    // if (req.method === 'GET') {

    //   const d = new Date();
    //   req = req.clone({
    //     url: req.url + '?&t=' + d.getTime()
    //   });
    // }
    if (req.method === 'GET') {
      let hasParam = req.url.indexOf('?');
      const d = new Date();
      // console.log(d.getTime());
      if (hasParam >= 0) {
        req = req.clone({
          url: req.url + '&t=' + d.getTime()
        });
      } else {
        req = req.clone({
          url: req.url + '?&t=' + d.getTime()
        });
      }

      if (this.auth.user && environment.production == false) {

        req = req.clone({
          url: req.url + '&token=' + this.auth.user.token
        });
      }


    } else {

      if (this.auth.user && environment.production == false) {

        req = req.clone({
          url: req.url + '?&token=' + this.auth.user.token
        });

      }
    }

    return next
      .handle(req)
      .pipe(
        tap(
          // Succeeds when there is a response; ignore other events
          (event: any) => {

          },
          // Operation failed; error is an HttpErrorResponse
          (error) => {

            if (error.error && error.error.message && error.error.message === 'maintain') {

              this.publicService.isMaintain = true;
              this.toast.error(this.langService.translations.MAINTAINING);

            }

            if (error.status === 401) {

              this.publicService.logout().subscribe();

              const langService = this.injector.get(LangService);

              this.toast.forceAlert(langService.translations.loginFirst, () => {
                this.router.navigateByUrl(AppRoutes.HOME);
              });
            }

          }
        ),
        finalize(() => {

          // console.log('final', req);

          // if (idx != -1) {
          // this.eventService.dispatch(EventService.TOGGLE_LOADING, false);
          // }

          // setTimeout(() => {
          //     this.eventService.dispatch(EventService.TOGGLE_LOADING);
          // }, 500);
        })
      );

  }
}
