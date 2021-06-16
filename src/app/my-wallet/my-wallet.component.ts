import { PublicService } from './../app-service/public.service';
import { debounceTime, first } from 'rxjs/operators';
import { MemberService, amountType } from './../app-service/member.service';
import { WalletService, moneyLoadStatus } from './../app-service/wallet.service';
import { HeaderService, actions as headerActions } from './../app-service/header.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AppRoutes } from '../constant/routes';
import { AuthService } from './../app-service/auth.service';
import { combineLatest, Observable } from 'rxjs';

export enum WalletType {
  COUPON = 'coupon-wallet',
  PLATFORM = 'platform-wallet',
  COUPON_HISTORY = 'coupon-hisotry'
}

enum tips {
  none,
  sum,
  withdraw
}

@Component({
  selector: 'app-my-wallet',
  templateUrl: './my-wallet.component.html',
  // styleUrls: ['./my-wallet.component.scss']
})
export class MyWalletComponent implements OnInit, OnDestroy {

  AppRoutes = AppRoutes;
  WalletType = WalletType;
  curWalletType = WalletType.COUPON;
  tips = tips;
  nowTip = tips.none;

  user;
  // userMoney;
  walletSumup = 0;

  total_0 = 0;
  total = 0;

  ableMoney = 0;
  platformWallet = [];

  $data;
  $dataWallet;

  isActivityWallet;

  constructor(
    private auth: AuthService,
    private headerService: HeaderService,
    private walletService: WalletService,
    private memberService: MemberService,
    private publicService: PublicService
  ) {

    this.user = this.auth.user;
    this.total = this.user.money;

    // this.auth.getWallet();
    this.$dataWallet = this.auth.getWalletSub()
      .subscribe((res: boolean) => {
        if (res) {
          // console.log('getWalletSub', res);
          this.user = this.auth.user;

          this.getAmount();
        }
      });

    this.$data = this.memberService.getAmountSub()
      .subscribe((res: any) => {

        // console.log('getAmountSub', res);

        if (res?.data?.able_money) {
          this.ableMoney = Number(res.data.able_money);
        }


        if (res?.data?.activity_wallet_total) {
          this.walletSumup = res.data.activity_wallet_total;
        }

        if (res?.data?.total_money) {

          this.total = this.total_0 = parseFloat(res.data.total_money);

        }


        // if (this.isActivityWallet) {
        //   this.walletService.getMultiPlatforms()
        //     .subscribe((res) => {

        //       this.platformWallet = res;

        //       if (this.platformWallet.length > 0) {
        //         this.getTransAllBalance();

        //       }

        //     });
        // }


      });
  }

  ngOnInit(): void {

    this.isActivityWallet = this.publicService.isActivityWallet;

    if (!this.isActivityWallet) {

      this.curWalletType = WalletType.PLATFORM;

    }

    // console.log('ngOnInit isActivityWallet', this.isActivityWallet);

    this.getAmount();

  }

  ngOnDestroy(): void {

    this.$data.unsubscribe();
    if (this.$dataWallet) {
      this.$dataWallet.unsubscribe();
    }

  }

  typeChange(type): void {
    this.curWalletType = type;
  }


  showTips(t): void {

    if (t == this.nowTip) {
      this.nowTip = tips.none;
      return;
    }

    this.nowTip = t;

  }

  getAmount(): void {

    // console.log('do getAmount');

    const keys = this.isActivityWallet ? [
      amountType.able,
      amountType.activity,
      amountType.total] : [
      amountType.able,
      amountType.total];

    this.memberService.getAmount(keys).subscribe();

  }


  getTransAllBalance(): void {


    // console.log('platformWallet', this.platformWallet);


    this.platformWallet.forEach((platform: any) => {

      platform.getStatus = moneyLoadStatus.LOADING;

      this.walletService.getMultiBalance(platform.key)
        .subscribe(
          (balanceRes: any) => {

            if (balanceRes.result == 'ok') {
              platform.getStatus = moneyLoadStatus.GOT;
              platform.balance = Number(balanceRes.balance);


              let tmpSum = 0;
              this.platformWallet.forEach((p: any) => {

                tmpSum += Number(p.balance);
              });

              this.total = Number(this.total_0) + tmpSum;
              // this.total = this.total + parseFloat((balanceRes.balance).toString());
            }
          }, (err) => {
            platform.getStatus = moneyLoadStatus.GOT;
          });
    });
  }


  @HostListener(`window:${headerActions.MyWalletRefresh}`, ['$event'])
  refresh(evt): void {

    // console.log('refresh');

    this.auth.getWallet();
    this.getAmount();
  }

}
