import { DayjsService } from './../app-service/dayjs.service';
import { debounceTime } from 'rxjs/operators';
import { AppRoutes } from './../constant/routes';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { WalletService, WalletType } from './../app-service/wallet.service';
import { AuthService } from './../app-service/auth.service';
import { ToastService, ToastType } from './../app-service/toast.service';
import { LangService } from './../app-service/lang.service';
import { Dayjs } from 'dayjs';

@Component({
  selector: 'app-coupon-wallet',
  templateUrl: './coupon-wallet.component.html',
  // styleUrls: ['./coupon-wallet.component.scss']
})
export class CouponWalletComponent implements OnInit, OnDestroy {

  AppRoutes = AppRoutes;
  // WalletType = WalletType;
  isOpen = false;
  @Input() type: string;
  @Input() tab: string;
  data = [];
  $data;
  clientTime;

  isActivityLogShow = false;
  activityLogId;

  constructor(
    private walletService: WalletService,
    private auth: AuthService,
    private toastService: ToastService,
    private langService: LangService,
  ) {


  }

  ngOnInit(): void {

    if (this.tab == WalletType.COUPON_HISTORY) {

      this.walletService.getActivityWalletHistory()
        .subscribe((res) => {

          // console.log('getActivityWalletHistory', res);
          this.data = res.data.content;
        });

    } else {

      this.subscribeLog();
      this.walletService.getActivityWalletLogBySubject();
    }


  }

  subscribeLog() {

    this.$data = this.walletService.getActivityWalletLogSub()
      .pipe(debounceTime(500))
      .subscribe((res: any) => {

        // console.log('getActivityWalletLogSub*', res);
        if (res.data?.total > 0) {

          this.clientTime = DayjsService.now(false);
          res.data.content.forEach((item) => {

            item.limitGiveUp = Number(item.limitGiveUp);

            // console.log(item.endAt);
            if (item.endAt) {
              const endAt = DayjsService.getDayjsObj(item.endAt);
              item.isOverdue = (this.clientTime.isBefore(endAt) === false) ? true : false;

            } else {
              item.isOverdue = false;
            }


          });


          this.data = res.data.content;

        }
      });
  }

  open(): void {
    this.isOpen = !this.isOpen;
  }

  transIn(item): void {
    let data = {
      purchaseLogId: item.id
    };
    this.walletService.getFromWalletActivityWallet(data)
      .subscribe(
        (res: any) => {
          // console.log('resssss', res);
          if (res.result === 'ok') {
            this.auth.getWallet();
            this.ngOnInit();
          } else {
            this.toastService.error(this.langService.translations.SERVER_ERROR);
          }
        },
        (err) => {

          if (err.error && typeof err.error === 'string') {
            this.toastService.error(err.error);

          }
        });
  }

  giveup(item) {

    let data = {
      purchaseLogId: item.id
    };

    this.walletService.giveup(data)
      .subscribe(
        (res: any) => {
          if (res.result === 'ok') {

            this.auth.getWallet();
            this.ngOnInit();

          } else {

            this.toastService.error(this.langService.translations.SERVER_ERROR);

          }
        },
        (err) => {
          console.log('err', err);
          if (err.error && typeof err.error === 'string') {
            this.toastService.error(err.error);
          } else {

            this.toastService.error(err.error.message);
          }

        }
      );

  }


  checkoutLog(logId) {
    console.log("checkoutLog", logId);
    this.activityLogId = logId;
    this.isActivityLogShow = true;
  }

  closePopup() {
    this.isActivityLogShow = false;
  }


  ngOnDestroy(): void {
    if (this.tab == WalletType.COUPON) {

      this.$data.unsubscribe();
    }



  }

}
