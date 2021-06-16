import { EventService } from './../app-service/event.service';
import { UtilService } from './../app-service/util.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppRoutes } from '../constant/routes';
import { HeaderService } from './../app-service/header.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  // styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  AppRoutes = AppRoutes;
  // HeaderService = HeaderService;
  curRoute = '';

  isContactPage = false;

  constructor(
    private router: Router,
    public HeaderService: HeaderService,

  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const route = event.url.split('/')[1];
        this.curRoute = route.replace(/\?(.*)/, '');

        const tab = UtilService.getParameterByName('tab', route);
        // console.log('tab', tab);
        if (tab && tab == 'common') {
          const file = UtilService.getParameterByName('file', route);
          // console.log('tab', tab, 'file', file);

          if (file == 'contact') {
            this.isContactPage = true;
          }

        } else {
          this.isContactPage = false;
        }

      }
    });
  }

  ngOnInit(): void {
  }

  @HostListener(`window:${EventService.isContactPage}`, ['$event'])
  updateIsContactPage() {
    this.isContactPage = true;
  }

}
