import { Injectable } from '@angular/core';
import { IResponseUserData } from './public.service';
import { MemberService } from './member.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { WalletService } from './wallet.service';
import { FavoriteService } from './favorite.service';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: any = null;
  private updateMoneyIntervalId;
  private loginSubject = new BehaviorSubject(false);
  private walletSubject = new BehaviorSubject(false);
  info;

  canUpgrade = false;

  constructor(
    private memberService: MemberService,
    private walletService: WalletService,
    private favoriteService: FavoriteService,

    private router: Router
  ) { }


  set user(data) {

    clearInterval(this.updateMoneyIntervalId);

    this._user = data;
    if (!data) {
      return;
    }

    /* 判斷是否還可以升級的層級, 會決定顯不顯 vip 頁面 */
    this.memberService.getClubRankList()
      .subscribe((res) => {
        // console.log('getClubRankList', res);
        const arr = res.slice(0, 8)
        // console.log('arr', arr);

        const lv = arr.find((l) => {

          return this.user.clubRankId === l.id;
        });

        this.canUpgrade = (lv) ? true : false;

        this.loginSubject.next(true);
      });


    const tmpURl = localStorage.getItem('tmpRoute');
    if (tmpURl) {

      this.router.navigateByUrl(tmpURl).then(() => {
        localStorage.removeItem('tmpRoute');
      });

    }

    this.walletService.getMultiWalletPlatforms();

    /* 更新存/提限制 */
    this.memberService.moneyLimit();

    /* 更新遊戲最愛 */
    this.favoriteService.all();

    this.updateMoneyIntervalId = setInterval(() => {

      this.getWallet();

    }, 1000 * 10);

  }

  getWallet() {
    this.memberService.wallet()
      .subscribe((res: any) => {

        if (!this.user.wallet) {
          this.user.wallet = {};
        }

        const data = res.data;
        const money = Number(data.money);
        const bonus = Number(data.bonus);
        const reviewAmount = Number(data.reviewWithdrawAmount);
        const locked_amount = Number(data.locked_amount);

        // console.log('**', this.user, money, bonus, reviewAmount, locked_amount);
        // console.log('*', this.user.wallet.money != money);
        // console.log('*', this.user.wallet.bonus != bonus);
        // console.log('*', this.user.wallet.reviewAmount != reviewAmount);
        // console.log('*', this.user.wallet.locked_amount != locked_amount);

        let notSame = this.user.wallet.money != money || this.user.wallet.bonus != bonus || this.user.wallet.reviewAmount != reviewAmount || this.user.wallet.locked_amount != locked_amount;


        if (notSame) {

          this.user.money = this.user.wallet.money = Number(res.data.money);
          this.user.wallet.bonus = Number(res.data.bonus);
          this.user.wallet.reviewAmount = Number(res.data.reviewWithdrawAmount);
          this.user.wallet.locked_amount = Number(res.data.locked_amount);

          this.walletSubject.next(true);
        }

      });
  }

  getWalletSub() {
    return this.walletSubject.asObservable().pipe(share());
  }

  get user() {
    return this._user;
  }

  isLogin() {
    return this.loginSubject.asObservable()
      .pipe(share());

  }

  clean() {

    clearInterval(this.updateMoneyIntervalId);
    this.canUpgrade = false;
    this.loginSubject.next(false);
    this.user = null;
    this.favoriteService.clean();

  }
}
