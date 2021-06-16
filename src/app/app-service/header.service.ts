import { WalletService } from './wallet.service';
import { LetterService, tabs as letterDetailtypes } from './letter.service';
import { AppRoutes } from './../constant/routes';
import { GameService } from './game.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HistoryService } from './history.service';
import { LangService } from './../app-service/lang.service';

export enum actions {
  LetterEdit = 'letter-edit',
  LetterDone = 'letter-done',
  LetterDetailShowDelet = 'letter-detail-show-delet',
  LetterDetailDelet = 'letter-detail-delet',
  LetterNoneEdit = 'letter-none-edit',
  MyWalletRefresh = 'my-wallet-refresh'
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  public title = '';
  public curType = 1;
  public route = '';
  // public appRoutes = AppRoutes;
  // help
  public nowCnt = '';

  actionSubject = new BehaviorSubject('');
  actionNow = actions.LetterEdit;
  letterDetailType;
  titleSubject = new BehaviorSubject('');

  goTeachFrom = '';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private historyService: HistoryService,
    private langService: LangService,
    private gameService: GameService,
    private letterService: LetterService,
    private walletService: WalletService,
    private activatedRoute: ActivatedRoute
  ) {
    this.langService.onloadSub.subscribe((boo) => {
      if (boo) {
        const urlChk = this.route.indexOf('popup');
        if (urlChk < 0) {
          this.changeTitle();
        }
      }
    });

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.route = event.url.split('?')[0].split('/')[1];
        switch (this.route) {
          case AppRoutes.HOME:
            this.curType = 1;
            break;
          case AppRoutes.BET_LOG:
          case AppRoutes.QUEST:
          case AppRoutes.OLD_QUEST_CENTER:
          case AppRoutes.REVIEW_MAIN:
          case AppRoutes.BANK_CARD:
          case AppRoutes.JOIN_US:
          case AppRoutes.QUEST_DETAIL:
          case AppRoutes.USER_INFO:
          case AppRoutes.USER_INFO_PLATFORM:
          case AppRoutes.SlotCenter:
          case AppRoutes.VIP_DETAIL:
          case AppRoutes.DOWNLOAD_APP:
            this.curType = 2;
            break;
          case AppRoutes.DEPOSIT:
          case AppRoutes.VIP:
          case AppRoutes.WITHDRAWAL:
          case AppRoutes.TRANSFER:
            this.curType = 3;
            break;
          case AppRoutes.LETTER:
            this.curType = 4;
            this.actionSubject.next(actions.LetterDone);
            break;
          case AppRoutes.LETTER_DETAIL:
            if (this.letterDetailType === letterDetailtypes.msg) {
              this.emitAction(actions.LetterDetailShowDelet);
            } else {
              this.emitAction(actions.LetterNoneEdit);
            }
            this.curType = 4;
            break;
          case AppRoutes.MY_WALLET:
            this.curType = 5;
            break;
          case AppRoutes.MEMBER_CENTER:
          // case AppRoutes.QUEST_CENTER:
          case AppRoutes.Activity_Wallet:
          case AppRoutes.HELP:
          case AppRoutes.HELP_ABOUT:
          case AppRoutes.HELP_PORBLEM:
          case AppRoutes.CUSTOMER:
            this.curType = 6;
            break;
          case AppRoutes.HELP_CENTER:
            let tab = activatedRoute.snapshot.queryParams.tab;
            let file = activatedRoute.snapshot.queryParams.file;
            if (file) {
              this.curType = 8;
            } else {
              this.curType = 6;
            }
            break;
        }

        const urlChk = this.route.indexOf('popup');
        if (urlChk < 0) {
          this.changeTitle();
        }
      }
    });
  }

  changeTitle(): void {
    if (this.langService.translations) {
      this.title = this.langService.translations.header[this.route];
      this.titleSubject.next(this.title);
      this.setSlotTitle();
      this.setLetterTitle();
      this.setActivityTitle();
    }
  }

  getTitle() {
    return this.titleSubject.asObservable();
  }

  setSlotTitle(): void {
    if (this.route === AppRoutes.SlotCenter) {
      if (typeof this.gameService.slotPlatform == 'string') {
        this.title = this.langService.translations.HEADER_NAV[this.gameService.slotPlatform];
      } else {
        this.title = this.gameService.slotPlatform.key.toUpperCase();
      }
      this.titleSubject.next(this.title);
    }
  }

  setLetterTitle() {
    if (this.route === AppRoutes.LETTER_DETAIL) {
      const tmpletter = this.letterService.tmpMsg;
      this.title = (this.letterDetailType === letterDetailtypes.msg) ? tmpletter.title : tmpletter.content;
      this.titleSubject.next(this.title);
    }
  }

  setActivityTitle() {
    if (this.route === AppRoutes.Activity_Wallet) {
      this.title = this.langService.translations.MEMBER_NAV.ACTIVITY_WALLET;
      this.titleSubject.next(this.title);
    }

    if (this.route === AppRoutes.QUEST_DETAIL) {
      this.title = this.walletService.tmpActivity.name;
      this.titleSubject.next(this.title);
    }
  }

  setTitle(title) {
    this.translate.get(title).subscribe((trans) => {
      this.setTxt(trans);
    });
  }

  setTxt(translations): void {
    this.title = translations;
    this.titleSubject.next(this.title);
  }

  goBack(): void {
    this.historyService.back();
  }

  goHelpBack(): void {
    if (this.goTeachFrom) {
      this.goTeachFrom = '';
      this.historyService.back();
      return;
    }

    this.nowCnt = '';
    this.curType = 6;
    this.translate.get(`header.${this.route}`).subscribe((trans) => {
      this.setTxt(trans);
    });
  }

  newHelpGoBack() {
    history.back();
  }

  goTeach(): void {
    let data = {
      item1: '',
      item2: ''
    };

    const url = this.router.url.split('/')[1];
    this.goTeachFrom = url;
    let tmpFile = '';

    switch (url) {
      case AppRoutes.DEPOSIT:
        data.item1 = 'teach2';
        data.item2 = 'NEWBIE.DEPOSIT.TITLE';
        tmpFile = 'deposit';
        break;
      case AppRoutes.TRANSFER:
        data.item1 = 'teach4';
        data.item2 = 'NEWBIE.TRANSFER.TITLE';
        tmpFile = 'transfer';
        break;
      case AppRoutes.WITHDRAWAL:
        data.item1 = 'teach3';
        data.item2 = 'NEWBIE.WITHDRAW.TITLE';
        tmpFile = 'withdraw';
        break;
    }

    this.router.navigate(['/help-center'], { queryParams: { tab: 'help', file: tmpFile } })
      .then(() => {
        this.goCnt(data.item1, data.item2);
      });
  }

  goComm() {
    let data = {
      item1: 'problem4',
      item2: 'COMMON.CONTACT.TITLE'
    };

    this.router.navigate(['/help-center'], { queryParams: { tab: 'common', file: 'contact' } })
      .then(() => {
        // this.goCnt(data.item1, data.item2);
      });

  }

  goCnt(t, title) {
    this.nowCnt = t;
    this.setTitle(title);
    this.curType = 7;
  }

  goVipDetail() {
    this.router.navigateByUrl(AppRoutes.VIP_DETAIL);
  }

  listenAction() {
    return this.actionSubject.asObservable();
  }

  emitAction(action): void {
    this.actionNow = action;
    this.actionSubject.next(action);
  }

  setLetterAction(act): void {
    this.emitAction(act);
  }
}

