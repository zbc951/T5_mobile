import { ToastService } from './../app-service/toast.service';
import { PublicService } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { GameService } from './../app-service/game.service';
import { MemberService } from './../app-service/member.service';
import { AuthService } from './../app-service/auth.service';
import { WalletService } from '../app-service/wallet.service';
import { LangService } from '../app-service/lang.service';

@Component({
  selector: 'app-popup-transfer',
  templateUrl: './popup-transfer.component.html',
  // styleUrls: ['./popup-transfer.component.scss']
})
export class PopupTransferComponent implements OnInit {

  isActivityWallet = false;
  isGetpfMoneyErr = false;
  isMultiMoney = false;
  isTransferErr = false;

  money = 0;
  data;

  platformMoney = 0;
  platformName = '';

  tmpMoney = 0;
  retryCount = 0;
  timeoutId;


  transferWalletForm = new FormGroup({
    walletType: new FormControl(null),
    amount: new FormControl(1),
  });

  getWalletType = [];

  // 不能存轉提
  locked = false;

  // 會先鎖住進入遊戲按鈕, 並文字提示正在執行轉點中
  isTransfering = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private walletService: WalletService,
    private memberService: MemberService,
    private gameService: GameService,
    private publicService: PublicService,
    private toast: ToastService,
    private lang: LangService
  ) {

    this.data = this.gameService.transitionData;
    // console.log('data:', this.data);

    if (!this.data || Object.keys(this.data).length === 0) {

      this.close();

    }


    this.auth.getWalletSub()
      .subscribe((res: boolean) => {
        if (res) {
          this.money = this.auth.user.money;
        }
      });

    const amountCtrl = this.transferWalletForm.controls.amount;

    amountCtrl
      .valueChanges
      .subscribe((val) => {

        // console.log('val', val);

        if (val < 0) {
          amountCtrl.patchValue(Math.abs(val));
        }

      });

  }

  ngOnInit(): void {

    this.locked = this.publicService.locked;
    // console.log('locked', this.locked);

    this.isActivityWallet = this.publicService.isActivityWallet;
    if (this.isActivityWallet) {

      this.getMyWallet();

    }


    const data = this.data;
    const { pkey } = data;
    const platforms = this.walletService.multiWalletPlatforms;
    const item = platforms.find((pf) => {
      return pf.key === pkey;
    });

    this.isMultiMoney = (item) ? true : false;

    if (this.isMultiMoney) {

      this.walletService.getMultiBalance(pkey)
        .subscribe(
          (balanceRes: any) => {
            if (balanceRes.result == 'ok') {
              // platform.getStatus = moneyLoadStatus.GOT;
              // platform.balance = balanceRes.balance;
              this.platformMoney = Number(balanceRes.balance);
              this.isGetpfMoneyErr = false;
            }
          },
          (err) => {
            this.isGetpfMoneyErr = true;
          });

    }

    this.money = this.auth.user?.money;

  }

  close(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
  }

  transferIn(): void {

    // console.log(form.value);
    // console.log('transferIn', this.data);
    if (!this.data.pkey) {
      return;
    }

    this.isTransfering = true;

    this.walletService
      .multiTranceIn(this.data.pkey, this.transferWalletForm.value.amount, this.data.pid)
      .subscribe((res) => {
        this.toast.successConfirm(this.lang.translations.PFTRANSITION.TRASFER_OK_ENTER, () => {
          this.memberService.wallet();
          this.gameService.launchGame2(this.data);
          this.close();
        });
      }, (err) => {

        this.isTransferErr = true;

        if (err.error.message && typeof err.error.message == 'string') {

          this.toast.error(err.error.message);
          return;

        }

        if (err.error && typeof err.error == 'string') {

          this.toast.error(err.error);
          return;

        }

      }).add(() => {
        this.walletService.updatePlatformsBalance(this.data.pkey);
        this.isTransfering = false;

      });

  }

  enter(): void {

    // console.log('enter', this.data);
    // console.log(this.transferWalletForm.value);
    if (this.isActivityWallet) {

      const walletType = this.transferWalletForm.value.walletType;
      this.data.purchaseLogId = (walletType === 'null') ? null : this.transferWalletForm.value.walletType;

    }

    this.gameService.launchGame2(this.data);
    this.close();

  }

  getMyWallet() {

    this.walletService.getAactivityWalletWallets({ platformId: this.data.game.platformId })
      .subscribe((res) => {

        console.log('getAactivityWalletWallets res', res);

        if (res.data && res.data.wallets.length > 0) {

          const cnt = [];
          res.data.wallets
            .forEach((item) => {
              cnt.push(item);
            });

          this.getWalletType = cnt;

          this.getWalletType.forEach((item) => {
            if (item.status === 'mounted' && item.mountPlatformId == this.data.pid) {
              this.transferWalletForm.controls.walletType.patchValue(item.id);
            }
          });

        }
      });

  }

}
