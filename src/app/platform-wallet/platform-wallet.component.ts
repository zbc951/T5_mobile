import { PublicService } from './../app-service/public.service';
import { MemberService, amountType } from './../app-service/member.service';
import { LangService } from './../app-service/lang.service';
import { ToastService } from './../app-service/toast.service';
import { AuthService } from './../app-service/auth.service';

import { HeaderService, actions as headerActions } from './../app-service/header.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { WalletService, moneyLoadStatus } from './../app-service/wallet.service';
import { Router } from '@angular/router';
import { AppRoutes } from '../constant/routes';
@Component({
  selector: 'app-platform-wallet',
  templateUrl: './platform-wallet.component.html',
  // styleUrls: ['./platform-wallet.component.scss']
})
export class PlatformWalletComponent implements OnInit, OnDestroy {

  isOpen = false;
  @Input() type: string;

  platformWallet = [];
  @Output() transInEvt = new EventEmitter();

  updateTime;
  $data;

  apiResponseCount = 0;
  isLoading = false;

  isActivityWallet;

  constructor(
    private router: Router,
    private walletService: WalletService,
    private auth: AuthService,
    private toast: ToastService,
    private langService: LangService,
    private memberService: MemberService,
    private publicService: PublicService
  ) {

    this.updateTime = new Date();
    this.$data = this.walletService
      .getMultiPlatforms2()
      .subscribe((res) => {

        // console.log('getMultiPlatforms res', res);

        this.platformWallet = res;

      });

  }

  ngOnInit(): void {

    this.isActivityWallet = this.publicService.isActivityWallet;
  }

  ngOnDestroy(): void {

    this.$data.unsubscribe();

  }

  open(): void {
    this.isOpen = !this.isOpen;
  }

  @HostListener(`window:${headerActions.MyWalletRefresh}`, ['$event'])
  getTransAllBalance(): void {

    console.log('getTransAllBalance');

    this.updateTime = new Date();

    this.platformWallet.forEach((platform: any) => {

      platform.getStatus = moneyLoadStatus.LOADING;

      this.getMultiBalance(platform);

    });
  }

  getTransAllBalanceForBackAll() {

    // console.log('getTransAllBalanceForBackAll');

    this.apiResponseCount = this.platformWallet.length;
    this.isLoading = true;

    this.platformWallet.forEach((platform: any) => {

      // console.log('getMultiBalance', platform.key);
      this.walletService.getMultiBalance(platform.key)
        .subscribe(
          (balanceRes: any) => {

            if (balanceRes.result == 'ok') {
              platform.balance = balanceRes.balance;
            }
          }, (err) => {
          }).add(() => {

            this.apiResponseCount--;

            if (this.apiResponseCount == 0) {

              this.isLoading = false;
              this.tranferBackAll();

            }

          });
    });
  }

  getMultiBalance(platform): void {

    // console.log('getMultiBalance', platform.key);

    this.walletService.getMultiBalance(platform.key)
      .subscribe(
        (balanceRes: any) => {

          if (balanceRes.result == 'ok') {
            platform.getStatus = moneyLoadStatus.GOT;
            platform.balance = balanceRes.balance;

          }
        }, (err) => {
          platform.getStatus = moneyLoadStatus.GOT;
        });

  }

  transinAll(item): void {
    this.transInEvt.emit(item);
  }


  unmountActivityWallet(): void {


    this.isLoading = true;
    this.apiResponseCount = this.platformWallet.length;
    // batch calling
    this.platformWallet.forEach((platform) => {

      this.walletService.unmountActivityWallet({
        platformId: platform.id
      })
        .subscribe(
          (res) => {

            console.log('unmountActivityWallet res', res);
            if (res.result === 'ok') {

              this.getMultiBalance(platform);

            } else {
              this.toast.error(this.langService.translations.SERVER_ERROR);
            }

            this.tellShouldCloseLoading();

          }
          , (err) => {

            if (err.error && typeof err.error === 'string') {
              this.toast.error(err.error);
            }

            this.tellShouldCloseLoading();

          }
        );

    });

    this.updateTime = new Date();
  }

  tellShouldCloseLoading() {
    if (this.apiResponseCount == 0) {
      return;
    }

    this.apiResponseCount--;
    console.log('** tellShouldCloseLoading ', this.apiResponseCount);

    if (this.apiResponseCount == 0) {

      this.auth.getWallet();

      if (this.isActivityWallet) {

        this.memberService.getAmount([
          amountType.able,
          amountType.activity,
          amountType.total])
          .subscribe();
      }
      else {

        this.getTransAllBalance();

      }

      this.isLoading = false;
    }
  }

  clickBackAll() {
    // 現在 我需要先更新平台的錢

    this.getTransAllBalanceForBackAll();

  }

  tranferBackAll() {

    // 沒錢的平台 要不用 轉了
    const platformsWithBal = this.platformWallet.filter((p) => {
      return Number(p.balance);
    });

    // console.log('platformsWithBal', platformsWithBal);

    // 根本沒有有可以轉的平台
    if (platformsWithBal.length == 0) {
      return;
    }

    this.apiResponseCount = platformsWithBal.length;
    this.isLoading = true;

    // console.log('tranferBackAll', this.platformWallet);

    this.platformWallet.forEach((platform: any) => {

      const balance = Number(platform.balance);

      if (balance) {

        this.walletService.multiTranceOut(platform.key, platform.balance, platform.id)
          .subscribe(
            (balanceRes: any) => {

              this.tellShouldCloseLoading();

            }, (err) => {

              this.tellShouldCloseLoading();

            });
      }
    });
  }


}
