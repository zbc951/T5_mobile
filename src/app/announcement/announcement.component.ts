import { AppRoutes } from './../constant/routes';
import { Router } from '@angular/router';
import { AuthService } from './../app-service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicService, MarqueeType } from '../app-service/public.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  // styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  // marquees: Observable<string>;
  marquees = [];
  showCnt;
  total = 0;
  count = 0;

  $login;


  constructor(
    private publicService: PublicService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {

    this.publicService.updateMarquee();

    this.publicService.getMarguee()
      .subscribe((src) => {

        const url = this.router.url.split('/')[1];

        if (url == AppRoutes.DEPOSIT) {

          this.marquees = src.filter(m => m.type === MarqueeType.deposit);

        } else {

          this.marquees = src.filter(m => m.type === MarqueeType.Hot);

        }
        this.total = this.marquees.length;
        this.showCnt = this.marquees[0];
      });
  }

  next(): void {
    this.count++;

    if (this.count === this.total) {
      this.count = 0;
    }
    this.showCnt = this.marquees[this.count];
  }

  go() {

    this.$login = this.auth.isLogin().subscribe((boo) => {

      if (boo) {

        this.publicService.isFromClickMarquee = true;
        this.router.navigateByUrl(AppRoutes.LETTER);
      }

    });
  }

  ngOnDestroy(): void {

    if (this.$login) {
      this.$login.unsubscribe();
    }

  }

}
