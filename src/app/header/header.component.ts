import { AuthService } from './../app-service/auth.service';
import { PublicService } from './../app-service/public.service';
import { EventService } from './../app-service/event.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppRoutes } from '../constant/routes';
import config from 'src/config';
import { HeaderService, actions } from './../app-service/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  // styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  noLogo = config.noLogo.noLogo;
  AppRoutes = AppRoutes;
  actions = actions;
  actionNow = actions.LetterEdit;
  title;
  user;
  isLogin;

  constructor(
    public headerService: HeaderService,
    private router: Router,
    private publicService: PublicService,
    private auth: AuthService
  ) {
    this.auth.isLogin().subscribe((isLogin) => {
      this.isLogin = isLogin;
      const { user } = this.auth;
      this.user = user;
    });

    this.headerService.getTitle().subscribe((res) => {
      this.title = res;
    });

    this.headerService.listenAction().subscribe((action) => {
      switch (action) {
        case actions.LetterEdit:
          this.actionNow = actions.LetterDone;
          break;

        case actions.LetterDone:
          this.actionNow = actions.LetterEdit;
          break;
        case actions.LetterDetailShowDelet:
          this.actionNow = actions.LetterDetailShowDelet;
          break;

        case actions.LetterNoneEdit:
          this.actionNow = actions.LetterNoneEdit;
          break;
      }
    });

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const route = event.url.split('/')[1];
        // 檢查 localstorage 的資料，不是當前登入者就 init
        if (this.user) {
          let localUserId = parseInt(localStorage.getItem('userId'));
          if (localUserId !== this.user.id) {
            this.publicService.init();
          }
        }
      }
    });
  }

  ngOnInit(): void {
  }

  letterEdit(): void {
    this.headerService.emitAction(actions.LetterEdit);
  }

  letterEditDone(): void {
    this.headerService.emitAction(actions.LetterDone);
  }

  letterDelet(): void {
    this.headerService.emitAction(actions.LetterDetailDelet);
  }

  refreshMywallet(): void {
    // this.headerService.emitAction(actions.MyWalletRefresh);
    EventService.dispatch(actions.MyWalletRefresh);
  }
}
