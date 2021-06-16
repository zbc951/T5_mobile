import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../app-service/auth.service';
import { PublicService, MarqueeType } from '../app-service/public.service';
import { Observable } from 'rxjs';

export enum Type {
  HOT = 'hot',
  NORMAL = 'normal',
  DEPOSIT = 'deposit'
}

@Component({
  selector: 'app-popup-bulletin',
  templateUrl: './popup-bulletin.component.html',
  // styleUrls: ['./popup-bulletin.component.scss']
})
export class PopupBulletinComponent implements OnInit {


  MarqueeType = MarqueeType;
  newsList = [];
  navType = MarqueeType.Normal;
  private marquees: Observable<any[]>;
  isLogin = false;



  constructor(
    private router: Router,
    private publicService: PublicService,
    private auth: AuthService

  ) { }

  ngOnInit(): void {
    this.marquees = this.publicService.getMarguee();
    this.marquees.subscribe((list) => {

      this.newsList = list;
    });

    this.auth.isLogin()
      .subscribe((islogin) => {
        this.isLogin = islogin;
      });

  }


  selectNavtype(n): void {
    this.navType = n;
  }

  close(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
  }


}
