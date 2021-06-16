import { PublicService } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
import { AppRoutes } from '../constant/routes';
import { Router } from '@angular/router';
import {
  WalletService,
  buyResponse,
  Activity_type,
} from './../app-service/wallet.service';

import { ToastService } from './../app-service/toast.service';
import { LangService } from './../app-service/lang.service';
import { AuthService } from './../app-service/auth.service';

enum Tabs {
  ALL = 'all',

}

@Component({
  selector: 'app-quest-center',
  templateUrl: './quest-center.component.html',
  // styleUrls: ['./quest-center.component.scss']
})
export class QuestCenterComponent implements OnInit {
  Activity_type = Activity_type;
  public tabs: any = Tabs;
  public selected: any;
  public listData: any = [];
  public pageConfig: {
    itemsPerPage: number,
    currentPage: number,
    totalItems: number
  } = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0,
    };

  // questData: any[] | null = null;
  public AppRoutes = AppRoutes;

  url;

  questTypes = [];
  quest_method;

  constructor(
    private walletService: WalletService,
    private router: Router,
    private toast: ToastService,
    private langService: LangService,
    private auth: AuthService,
    private publicService: PublicService
  ) {

    this.url = this.router.url.split('/')[1];
    this.langService.onloadSub
      .subscribe((boo) => {
        if (boo) {
          this.init();
        }
      });

  }

  init() {

    this.publicService.getQuestGroupList()
      .subscribe((res: any) => {

        // console.log('getQuestGroupList res', res);
        this.questTypes = res.data.content;

        this.getList(Tabs.ALL);

      });

  }

  ngOnInit(): void {

  }

  getList(t: Tabs = null) {
    switch (this.url) {
      case AppRoutes.Activity_Wallet:
        this.getActivityWallet();
        break;

      case AppRoutes.QUEST:

        if (t) {
          this.selected = t;
        }

        this.initQuest();

        break;
    }
  }

  selectType(t: Tabs): void {
    this.pageConfig.currentPage = 1;
    this.listData = [];
    this.getList(t);
  }

  initQuest(): void {

    const tmpPagin: any = {
      page: this.pageConfig.currentPage,
      perPage: this.pageConfig.itemsPerPage
    };

    if (this.selected == Tabs.ALL) {

    } else {
      tmpPagin.groupId = this.selected;
    }

    this.publicService.getPublicQuestList(tmpPagin)
      .subscribe((response) => {
        // let questList = response.data.content;
        let questList = [];

        response.data.content.forEach((item) => {
          questList.push({
            name: item.name,
            startAt: item.startTime,
            endAt: item.endTime,
            information: item.information,
            image: item.imageUrl,
            informationDisplay: item.informationDisplay,
            method: item.method,
            type: item.type,
          });
        });

        this.pageConfig.totalItems = response.data.total;
        this.pageConfig.itemsPerPage = response.data.perPage;
        this.pageConfig.currentPage = response.data.page;

        this.listData = this.listData.concat(questList)
      });
  }

  getActivityWallet(): void {
    this.walletService.getActivityWallet().subscribe((res) => {
      // console.log('getActivityWallet', res);
      this.listData = res.data.products;
    });
  }

  goDetail(data): void {
    this.walletService.tmpActivity = data;
    this.router.navigateByUrl(AppRoutes.QUEST_DETAIL);
  }

  buy(item): void {
    if (this.auth.user.money < item.price) {
      this.toast.error(
        this.langService.translations.QUEST_CENTER.buy_moneyNotEnough
      );
      return;
    }

    this.walletService.buy(
      item,
      this.langService.translations.QUEST_CENTER,
      () => {
        this.getActivityWallet();
      }
    );
  }

  onBtm(evt): void {

    if (this.listData.length < this.pageConfig.totalItems) {

      this.pageConfig.currentPage++;
      this.initQuest();
    }

  }
}
