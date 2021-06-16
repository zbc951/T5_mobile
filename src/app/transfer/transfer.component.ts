import { first } from 'rxjs/operators';
import { EventService } from './../app-service/event.service';
import { UtilService } from './../app-service/util.service';
import { MaintainService } from './../app-service/maintain.service';
import { MemberService, amountType } from './../app-service/member.service';
import { PublicService } from './../app-service/public.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { ToastService } from './../app-service/toast.service';
import { WalletService, moneyLoadStatus } from './../app-service/wallet.service';
import { AuthService } from './../app-service/auth.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LangService } from './../app-service/lang.service';
import { TranslateService } from '@ngx-translate/core';

export enum WalletType {
  COUPON = 'coupon-wallet',
  PLATFORM = 'platform-wallet'
}

const centerWalletValue = '';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  // styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {

  isLoading = false;
  type = 'transfer';
  WalletType = WalletType;
  curWalletType = WalletType.COUPON;

  user;
  allPlatforms;
  platforms;
  transferform: FormGroup;
  transferBackform: FormGroup;

  getWalletType = [
    {
      id: '',
      name: '中心錢包',
    },
  ];

  couponWallets = [];
  centerWalletTxt = '';

  select1_options = [];
  select2_options = [];

  centerWalletValue = centerWalletValue;

  isActivityWallet;

  platformsWithWallet = [];
  walletSumup = 0;

  platformWallet = [];
  apiResponseCount = 0;

  // 不能存轉提
  locked = false;
  $dataWallet;

  constructor(
    private auth: AuthService,
    private walletService: WalletService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private langService: LangService,
    private translateService: TranslateService,
    private publicService: PublicService,
    private memberService: MemberService,
    private maintainService: MaintainService
  ) {

    this.translateService.get('PFTRANSITION.CENTER')
      .subscribe((res: any) => {

        this.centerWalletTxt = res;

      });

    this.$dataWallet = this.auth.getWalletSub()
      .subscribe(
        this.refreshMoney.bind(this)
      );

  }

  /**
   * 活動錢包 關閉
   * 只有 平台轉
   */
  initPlatformForm() {
    this.transferform = this.formBuilder
      .group({
        select1: this.centerWalletValue,
        select2: -1,
        amount: 0
      });


    this.transferform.controls.select1
      .valueChanges
      .subscribe((res) => {

        // console.log('select1.valueChanges', res);
        if (res == centerWalletValue) {

          this.select2_options = this.allPlatforms;

        } else {
          this.select2_options = [
            {
              name: this.centerWalletTxt,
              value: ''
            }
          ];
        }
      });
  }

  // initActWalletForm() {
  //   this.transferform = this.formBuilder
  //     .group({
  //       platform: -1,
  //       amount: null,
  //       wallet: ''
  //     });

  //   this.transferBackform = this.formBuilder
  //     .group({
  //       item: -1,
  //       wallet: '',
  //     });

  //   this.transferBackform.controls.item
  //     .valueChanges
  //     .subscribe((itemId) => {

  //       // console.log('Platform.valueChanges', itemId);

  //       const item = this.platformsWithWallet.find((item) => {

  //         return item.id == itemId;

  //       });

  //       if (item) {

  //         const name = item.log ? item.log.name : this.centerWalletTxt;
  //         this.transferBackform.controls.wallet.patchValue(name);

  //       }
  //     });

  //   this.transferform.controls.wallet
  //     .valueChanges
  //     .subscribe((id) => {
  //       // console.log('couponWallet valueChanges', id);

  //       this.getPlatformOfWallet(id);

  //     });

  //   this.publicService.getPlatforms()
  //     .subscribe((res: any) => {

  //       const platforms = res.platforms;

  //       platforms.forEach(p => {
  //         p.maintain = this.maintainService.checkByPlatformId(p.id);
  //       });

  //       this.platforms = res.platforms;
  //       this.allPlatforms = res.platforms;

  //       // console.log('**platforms', this.platforms);
  //       // console.log('**allPlatforms', this.allPlatforms);


  //     });

  //   this.memberService.getAmount([
  //     amountType.activity
  //   ])
  //     .subscribe((res: any) => {
  //       console.log('getAmount', res);
  //       this.walletSumup = res.data.activity_wallet_total;
  //     });

  //   this.getUserWalletAll();
  //   this.getPlatformWallet();

  // }


  ngOnInit(): void {

    this.isActivityWallet = this.publicService.isActivityWallet;

    // console.log('isActivityWallet', this.isActivityWallet);

    if (!this.isActivityWallet) {

      this.curWalletType = WalletType.PLATFORM;
      this.initPlatformForm();
      this.getMultiPlatforms();

    } else {

      // this.initActWalletForm();

    }

    this.user = this.auth.user;
    this.locked = this.publicService.locked;

    // console.log('user', this.user);
  }

  ngOnDestroy(): void {

    if (this.$dataWallet) {
      this.$dataWallet.unsubscribe();
    }

  }

  getMultiPlatforms() {
    this.walletService.getMultiPlatforms()
      .pipe(first())
      .subscribe((res) => {

        // console.log('**getMultiPlatforms', res);

        res.forEach(p => {

          p.maintain = this.maintainService.checkByPlatformId(p.id);

        });

        this.allPlatforms = [...res];
        this.select1_options = [...res];
        this.select2_options = [...res];

        // console.log('this.allPlatforms', this.allPlatforms);


      });
  }

  transfer(): void {

    this.isLoading = true;

    const select1_value = this.transferform.controls.select1.value;

    if (select1_value == centerWalletValue) {

      this.transferIntoPlatform();

    } else {

      this.transferOutFromPlatform();

    }

  }

  transferIntoPlatform() {

    // console.log('transferIntoPlatform');
    const key = this.transferform.controls.select2.value;
    const val = this.transferform.controls.amount.value;
    const pl = this.select2_options.find((p) => {
      return key == p.key;
    });

    if (!pl) {
      return;
    }

    this.walletService
      .multiTranceIn(key, val, pl.id)
      .subscribe(
        (res) => {

          // console.log('multiTranceIn', res);

          this.isLoading = false;
          this.refreshOne(key);
        },
        (err) => {
          this.isLoading = false;

          if (err.error.message && typeof err.error.message == 'string') {

            const msg = (err.error.message == 'game maintain') ? this.langService.translations.MAINTAINING : err.error.message;

            this.toast.error(msg);
            return;

          }

          if (err.error && typeof err.error == 'string') {

            this.toast.error(err.error);
            return;

          }

          this.toast.error(err.message);
        });

  }

  transferOutFromPlatform() {

    // console.log('transferOutFromPlatform');
    const key = this.transferform.controls.select1.value;
    const val = this.transferform.controls.amount.value;

    const pl = this.select1_options.find((p) => {
      return key == p.key;
    });

    this.walletService
      .multiTranceOut(key, val, pl.id)
      .subscribe(
        (res) => {

          // console.log('multiTranceOut', res);
          this.isLoading = false;
          this.refreshOne(key);
        },
        (err) => {

          this.isLoading = false;

          if (err.error.message && typeof err.error.message == 'string') {

            this.toast.error(err.error.message);
            return;

          }

          if (err.error && typeof err.error == 'string') {

            this.toast.error(err.error);
            return;

          }


          this.toast.error(err.message);
        });

  }


  getTransAllBalance(callback) {

    console.log('getTransAllBalance');

    this.apiResponseCount = this.allPlatforms.length;
    this.isLoading = true;

    this.allPlatforms.forEach((platform: any) => {

      // platform.getStatus = moneyLoadStatus.LOADING;

      // console.log('getMultiBalance', platform.key);
      this.walletService.getMultiBalance(platform.key)
        .subscribe(
          (balanceRes: any) => {


            if (balanceRes.result == 'ok') {
              // platform.getStatus = moneyLoadStatus.GOT;
              platform.balance = balanceRes.balance;
            }
          }, (err) => {
            // platform.getStatus = moneyLoadStatus.GOT;
          }).add(() => {

            this.apiResponseCount--;

            if (this.apiResponseCount == 0) {

              this.isLoading = false;
              callback();

            }

          });
    });
  }

  refreshMoney(res) {
    this.user = this.auth.user;

  }

  refreshAll(): void {

    // console.log('refreshAll');

    this.auth.getWallet();
    this.walletService.getMultiWalletPlatforms();

  }

  refreshOne(pkey): void {

    this.auth.getWallet();
    // 只需更新 戶內轉帳 所操作的平台
    this.walletService.updatePlatformsBalance(pkey);

  }


  getPlatformOfWallet(pid): void {

    // console.log('getPlatformOfWallet', pid);

    if (pid) {

      const wallet = this.couponWallets.find((item) => {
        return item.id == pid;
      });

      // console.log('wallet', wallet);
      // console.log(this.platforms);

      let tmpArr = [];

      this.allPlatforms.forEach((item) => {

        if (wallet.platforms.includes(item.id)) {
          tmpArr.push(item);
        }

      });


      console.log('tmpArr', tmpArr);


      tmpArr.forEach((p) => {

      });

      this.platforms = tmpArr;


    } else {

      this.platforms = this.allPlatforms;
    }

  }

  typeChange(type) {
    this.curWalletType = type;
  }


  // transferPlatforms() {
  //   // console.log('transferPlatforms');
  //   // console.log('form', this.transferform);
  //   const form = this.transferform;

  //   if (form.invalid) {
  //     return;
  //   }

  //   // console.log(form.value);
  //   this.transferIn();

  // }

  clickBackAll() {
    // 現在 我需要先更新平台的錢

    this.getTransAllBalance(() => {
      this.tranferBackAll();
    });

  }

  tranferBackAll() {

    // 沒錢的平台 要不用 轉了
    const platformsWithBal = this.allPlatforms.filter((p) => {
      return Number(p.balance);
    });

    // 根本沒有有可以轉的平台
    if (platformsWithBal.length == 0) {
      return;
    }

    // console.log("platformsWithBal", platformsWithBal);
    this.apiResponseCount = platformsWithBal.length;

    this.isLoading = true;

    // console.log('tranferBackAll', this.allPlatforms);

    this.allPlatforms.forEach((platform: any) => {

      const balance = Number(platform.balance);

      if (balance) {

        this.walletService.multiTranceOut(platform.key, platform.balance, platform.id)
          .subscribe(
            (balanceRes: any) => {

              // if (balanceRes.result == 'ok') {
              // }

              this.tellShouldCloseLoading();

            }, (err) => {

              this.tellShouldCloseLoading();

            });

      }

    });
  }

  // transferIn(): void {

  //   this.isLoading = true;

  //   const p = this.transferform.value.platform.id;
  //   const w = this.transferform.value.wallet;

  //   const data = {
  //     platformId: p,
  //     purchaseLogId: w
  //   };

  //   this.walletService.mountActivityWallet(data)
  //     .subscribe((res) => {
  //       if (res.result === 'ok') {

  //         this.transferMsg(res);
  //         this.auth.getWallet();

  //       } else {
  //         this.toast.error(this.langService.translations.SERVER_ERROR);
  //       }
  //     },
  //       (err) => {

  //         // console.log('err', err);
  //         if (err.error && typeof err.error === 'string') {
  //           this.toast.error(err.error);
  //         }

  //         if (err.error.message) {
  //           this.toast.error(err.error.message);
  //           return;
  //         }

  //         if (err.error.errors) {

  //           const msg = UtilService.contactErrMsg(err.error.errors);
  //           this.toast.error(msg);

  //         }

  //       }).add(
  //         () => {
  //           this.isLoading = false;
  //           this.getPlatformWallet();
  //           this.getUserWalletAll();
  //         });

  // }



  // getUserWalletAll(): void {

  //   this.walletService.getUserWalletAll()
  //     .subscribe((res) => {

  //       // console.log('getUserWalletAll', res);
  //       this.couponWallets = res.data.wallets;
  //     });
  // }

  /**
  * for platform backto activity-wallet
  * list of platform with activity
  */

  // getPlatformWallet() {

  //   this.walletService.getPlatformWallet()
  //     .subscribe((res) => {

  //       console.log('getPlatformWallet', res);

  //       this.platformsWithWallet = res;

  //       this.platformsWithWallet.forEach((p) => {

  //         const plat = this.platforms.find((p1) => {

  //           return p1.id == p.platformId;

  //         });

  //         if (plat) {
  //           // console.log(plat);

  //           if (plat.maintain) {
  //             p.maintain = true;

  //           }
  //         }
  //       });

  //     });

  // }

  transferMsg(res): void {

    let unmountPlatform = this.allPlatforms.find((p) => {

      return p.id == res.unmount.platformId;

    });

    if (res.unmount.walletId == null) {
      unmountPlatform = {
        name: this.centerWalletTxt
      };
    }

    const mountPlatform = this.allPlatforms.find((p) => {

      return p.id == res.mount.platformId;

    });

    if (res.mount.walletId == null) {

      res.mount.walletName = this.centerWalletTxt;
    }


    const key = res.unmount.walletId == 0 ? 'TRANSFER.MANUAL.MSG1' : 'TRANSFER.MANUAL.MSG0';

    // console.log('key', key, unmountPlatform, mountPlatform);
    if (res.unmount.walletId == 0) {
      this.translateService.get(key, {

        mount: {
          platformName: mountPlatform.name,
          amount: res.mount.amount,
          walletName: res.mount.walletName
        }

      })
        .subscribe((res) => {

          // console.log('transferMsg res', res);

          this.toast.error(res);
          this.refreshAll();
          this.walletService.getMultiWalletPlatforms();
        });

    } else {
      this.translateService.get(key, {

        unmount: {
          platformName: unmountPlatform.name,
          amount: res.unmount.amount,
          walletName: res.unmount.walletName
        },
        mount: {
          platformName: mountPlatform.name,
          amount: res.mount.amount,
          walletName: res.mount.walletName
        }

      })
        .subscribe((res) => {

          // console.log('transferMsg res', res);

          this.toast.error(res);
          this.refreshAll();
          this.walletService.getMultiWalletPlatforms();
        });
    }
  }

  // unmount() {

  //   console.log('unmount', this.transferBackform.value);

  //   const item = this.platformsWithWallet.find((item) => {

  //     return item.id == this.transferBackform.value.item;

  //   });

  //   if (item) {

  //     console.log('item', item);
  //     // return;

  //     this.isLoading = true;

  //     this.walletService.unmountActivityWallet({
  //       platformId: item.platform.id
  //     }).subscribe(
  //       (res) => {

  //         console.log('unmountActivityWallet res', res);
  //         // console.log('unmountActivityWallet res', res);
  //         if (res.result === 'ok') {



  //           // this.unmounting = true;

  //           // this.getMultiBalance(platform);

  //           // if (this.currType === walletType.COUPON) {

  //           //   this.walletService.getActivityWalletLogBySubject();

  //           // }

  //         } else {

  //           this.toast.error(this.langService.translations.SERVER_ERROR);

  //         }


  //       },
  //       (err) => {

  //         // console.log('err', err);
  //         if (err.error && typeof err.error === 'string') {
  //           this.toast.error(err.error);

  //         }

  //         if (err.error.message) {
  //           this.toast.error(err.error.message);
  //           return;
  //         }

  //       }).add(() => {

  //         this.transferBackform.reset();

  //         this.refreshAll();
  //         this.getPlatformWallet();
  //         this.getUserWalletAll();

  //         this.isLoading = false;
  //       });
  //   }


  // }


  // unmountActivityWallet(): void {

  //   console.log('unmountActivityWallet', this.platformsWithWallet);


  //   this.isLoading = true;
  //   this.apiResponseCount = this.platformsWithWallet.length;
  //   // batch calling
  //   this.platformsWithWallet.forEach((platform) => {

  //     this.walletService.unmountActivityWallet({
  //       platformId: platform.id
  //     })
  //       .subscribe(
  //         (res) => {

  //           console.log('unmountActivityWallet res', res);
  //           if (res.result === 'ok') {

  //             this.getMultiBalance(platform);
  //             this.getUserWalletAll();

  //           } else {
  //             this.toast.error(this.langService.translations.SERVER_ERROR);
  //           }

  //           this.tellShouldCloseLoading();

  //         }
  //         , (err) => {

  //           if (err.error && typeof err.error === 'string') {
  //             this.toast.error(err.error);
  //           }

  //           this.tellShouldCloseLoading();

  //         }
  //       );

  //   });

  // }

  tellShouldCloseLoading() {
    if (this.apiResponseCount == 0) {
      return;
    }

    this.apiResponseCount--;
    // console.log('** tellShouldCloseLoading ', this.apiResponseCount);

    if (this.apiResponseCount == 0) {

      this.auth.getWallet();

      if (this.isActivityWallet) {

        this.memberService.getAmount([
          amountType.able,
          amountType.activity,
          amountType.total])
          .subscribe();

      } else {

        // this.getMultiPlatforms();
        // this.getTransAllBalance();
        this.walletService.getMultiWalletPlatforms();

      }

      this.isLoading = false;
    }
  }


  getMultiBalance(platform): void {

    console.log('getMultiBalance', platform.key);

    this.walletService.getMultiBalance(platform.key)
      .subscribe(
        (balanceRes: any) => {

          if (balanceRes.result == 'ok') {
            platform.getStatus = moneyLoadStatus.GOT;
            platform.balance = balanceRes.balance;
            platform.activityWallet = balanceRes.activityWallet;
            platform.isShow = false;
          }
        }, (err) => {
          platform.getStatus = moneyLoadStatus.GOT;
        });

  }

  @HostListener(`window:${EventService.MAINTAIN_UPDATE}`, ['$event'])
  update(event): void {

    // return;

    const { data } = event.detail;

    if (this.isActivityWallet) {

      // if (data.platform && this.platforms) {


      //   const ref = data.platform;

      //   console.log('ref', ref);
      //   this.platforms.forEach((p) => {

      //     // console.log(p, ref);

      //     if (p.id == ref.id) {

      //       p.maintain = (ref.isRoutineMaintainIng || ref.maintain) ? true : false;

      //     }

      //   });

      //   this.allPlatforms.forEach((p) => {

      //     if (p.id == ref.id) {

      //       p.maintain = (ref.isRoutineMaintainIng || ref.maintain) ? true : false;
      //     }

      //   });

      //   // console.log('this.platforms', this.platforms);

      //   this.platformsWithWallet.forEach((p) => {

      //     // console.log('platformsWithWallet', p);

      //     if (p.platformId == ref.id) {

      //       p.maintain = (ref.isRoutineMaintainIng || ref.maintain) ? true : false;
      //     }

      //   });


      //   // this.platforms = res.platforms;
      //   // this.allPlatforms = res.platforms;

      // }
    } else {

      if (data.platform && this.allPlatforms) {


        const ref = data.platform;

        // console.log('ref', ref);

        this.allPlatforms.forEach((p) => {

          if (p.id == ref.id) {

            p.maintain = (ref.isRoutineMaintainIng || ref.maintain) ? true : false;
          }

        });

      }
    }


  }



}
