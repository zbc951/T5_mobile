import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../constant/routes';
import { HeaderService } from './../app-service/header.service';

enum Tabs {
  TEACH = 'teach',
  PROBLEM = 'problem',
  ABOUT = 'about',
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  // styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  public tabs = Tabs;
  public activeTab: Tabs;
  public selectPresent: any;

  appRoutes = AppRoutes;
  url = '';
  // 存款內文
  serial = true;
  wechat = false;
  wanin = false;
  alipay = false;
  unionpay = false;
  numberdeposit = false;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    public headerService: HeaderService
  ) {
    this.headerService.nowCnt = '';
  }

  ngOnInit(): void {
    this.url = this.router.url.split('/')[1];
    switch (this.url) {
      case this.appRoutes.HELP:
        this.activeTab = Tabs.TEACH;
        this.translateService.get('NAV.NEWBIE')
          .subscribe((trans) => {
            this.setTxt(trans);
          });
        break;

      case this.appRoutes.HELP_PORBLEM:
        this.activeTab = Tabs.PROBLEM;
        this.translateService.get('NAV.QNA')
          .subscribe((trans) => {
            this.setTxt(trans);
          });
        break;

      case this.appRoutes.HELP_ABOUT:
        this.activeTab = Tabs.ABOUT;
        this.translateService.get('NAV.ABOUT')
          .subscribe((trans) => {
            this.setTxt(trans);
          });
        break;
    }
  }

  goNav(val: any) {
    this.activeTab = val.target.value;
    this.headerService.nowCnt = '';

    switch (this.activeTab) {
      case Tabs.TEACH:
        this.router.navigateByUrl(AppRoutes.HELP);
        this.translateService.get('NAV.NEWBIE').subscribe((trans) => {
          this.setTxt(trans);
        });
        break;

      case Tabs.PROBLEM:
        this.router.navigateByUrl(AppRoutes.HELP_PORBLEM);
        this.translateService.get('NAV.QNA').subscribe((trans) => {
          this.setTxt(trans);
        });
        break;

      case Tabs.ABOUT:
        this.router.navigateByUrl(AppRoutes.HELP_ABOUT);
        this.translateService.get('NAV.ABOUT').subscribe((trans) => {
          this.setTxt(trans);
        });
        break;
    }
  }

  setTxt(translations): void {
    this.selectPresent = translations;
  }

  toggleDiv(e: any) {
    const target = e.currentTarget.childNodes[3];
    target.checked = target.checked ? false : true;
  }
}
