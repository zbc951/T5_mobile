import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppRoutes } from './../constant/routes';
import { UtilService } from './../app-service/util.service';
import { TranslateService } from '@ngx-translate/core';
import { PublicService } from './../app-service/public.service';
import { LangService } from './../app-service/lang.service';
import { ToastService } from './../app-service/toast.service';
import { MemberService, IMoneyLimit, amountType } from './../app-service/member.service';
import { BankService } from './../app-service/bank.service';
import { WithdrawService } from './../app-service/withdraw.service';
import { AuthService } from './../app-service/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ReviewService } from './../app-service/review.service';
@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  // styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit, OnDestroy {

  isOpen = false;
  type = 'withdraw';

  form: FormGroup;
  ctrlBankid: FormControl;
  user;
  limit;
  lastWithdraw;
  withDrawInvalidErr = {
    money: null,
    // password: null,
    msg: null,
  };

  bank;
  banks;

  bankTail = '';
  ableMoney = 0;

  // 不能存轉提
  locked = false;

  $review;

  $rank;
  mylv;

  constructor(
    private router: Router,
    private auth: AuthService,
    private withdrawService: WithdrawService,
    private bankService: BankService,
    private memberService: MemberService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private decimalPipe: DecimalPipe,
    private publicService: PublicService,
    private langService: LangService,
    private translateService: TranslateService,
    public reviewService: ReviewService,
  ) {
    this.$review = this.reviewService.getReviewApproved().subscribe((res: any) => {
      if (res.reviewTypeKey === "withdraw") {
        this.ngOnInit();
      }
    })



  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      money: new FormControl({ value: null, disabled: true }, Validators.required),
      memberBankId: 0
    });

    this.ctrlBankid = this.form.get('memberBankId') as FormControl;

    this.auth.getWalletSub()
      .subscribe((res: boolean) => {
        if (res) {
          // console.log('getWalletSub', res);
          this.user = this.auth.user;
        }
      });

    this.memberService.getLimit()
      // .subscribe((limit: IMoneyLimit) => {
      .subscribe((limit: any) => {

        const nolimitTxt = this.langService.translations.MEMBER_WITHDRAW.NO_LIMIT;
        limit.numTxt = (limit.withdrawDayTimes !== 0) ? (limit.withdrawDayTimes - limit.withdrawNowTimes + 1) : nolimitTxt;
        limit.amountTxt = (limit.withdrawDayTimes !== 0) ? (limit.withdrawMaxPer * limit.withdrawDayTimes) : nolimitTxt;

        // console.log('limit', limit);

        this.limit = limit;
      });

    this.auth.getWallet();
    this.user = this.auth.user;

    this.$rank = this.memberService.listenClubRank()
      .subscribe((res) => {

        this.mylv = res.find((l) => {
          return this.user.clubRankId == l.id;
        });

      });

    this.getAmount();
    this.locked = this.publicService.locked;

    if (this.locked) {
      this.form.disable();
    }

    this.memberService.resetLock()
      .subscribe((res) => {
        if (res.reset_lock && res.reset_lock == 'ok') {
          this.auth.getWallet();
        }
      });

    this.getBank();
    this.memberService.moneyLimit();
    this.ctrlBankid.valueChanges.subscribe((val) => {
      this.banks.forEach((item) => {
        if (item.id === parseInt(val)) {
          this.bankTail = item.account.slice(-4);
          return this.bankTail;
        };
      });
    })

  }

  getBank(): void {
    this.bankService.banks()
      .subscribe((res: any) => {

        // console.log('banks res', res);
        const banks = this.banks = res.data;

        if (banks.length > 0) {

          this.loadLastWithdraw();

        } else {


          this.toast.forceAlert(this.langService.translations.MEMBER_WITHDRAW.NO_BANK, () => {

            this.router.navigateByUrl(AppRoutes.BANK_CARD);

          });
        }

      });

  }


  loadLastWithdraw(): void {
    this.withdrawService.lastWithdraw()
      .subscribe((res: any) => {

        // console.log('lastWithdraw res', res);
        this.lastWithdraw = res.data;

        if (this.lastWithdraw) {

          const tmp = Object.assign(this.form.value, { money: this.lastWithdraw.money });

          for (const key in tmp) {
            if (tmp.hasOwnProperty(key)) {
              const element = tmp[key];

              // console.log(key, 'val', element);
              if (element) {

                const ctrl = this.form.get(key);
                if (ctrl) {
                  ctrl.patchValue(element);
                }
              }
            }
          }


          const reviewbank = this.banks
            .find((bank) => {
              return bank.account == this.lastWithdraw.payeeAccount;
            });

          // console.log('reviewbank', reviewbank);

          if (reviewbank) {

            // console.log('reviewbank', reviewbank);
            this.bank = reviewbank;

            this.ctrlBankid.patchValue(reviewbank.id);
            this.ctrlBankid.disable();

          }


          this.form.addControl('password', new FormControl(null, Validators.required));

          this.form.get('money').disable();
          // this.form.get('password').disable();

        } else {


          this.form.controls.memberBankId.patchValue(this.banks[0].id);
          // this.form.get('money').enable();
          this.form.enable();
        }

      }, (err) => {
        this.toast.error(err.error.message);
      });
  }

  withdraw(form: FormGroup): void {

    for (const key in this.withDrawInvalidErr) {
      if (this.withDrawInvalidErr.hasOwnProperty(key)) {
        this.withDrawInvalidErr[key] = '';
      }
    }

    if (form.invalid) {
      console.log('invalid');
      return;
    }

    if (this.limit.withdrawDayTimes > 0 && this.limit.withdrawNowTimes > this.limit.withdrawDayTimes) {

      // this.translate.get('MEMBER_WITHDRAW.withdraw_limit')
      //   .subscribe((res: string) => {
      //     this.toast.error(res, 3000);
      //   });

      this.toast.error(this.langService.translations.MEMBER_WITHDRAW.withdraw_limit);
      return;
    }


    const money = form.controls.money.value;
    if (this.limit.withdrawMaxPer > 0 && !(money >= this.limit.withdrawMinPer && money <= this.limit.withdrawMaxPer) || (money < this.limit.withdrawMinPer)) {
      const min = this.decimalPipe.transform(this.limit.withdrawMinPer, '1.0-2');
      const max = (this.limit.withdrawMaxPer == 0) ? this.langService.translations.MEMBER_WITHDRAW.NO_LIMIT : this.decimalPipe.transform(this.limit.withdrawMaxPer, '1.0-2');
      const limitMsg = `${this.langService.translations.MEMBER_WITHDRAW.MONEY_PS1} ${min}~${max}`;
      this.toast.error(limitMsg);
      return;
    }

    if (this.user.wallet.money < this.limit.withdrawMinPer) {

      // this.toast.error(this.translations.MEMBER_WITHDRAW.NOT_ENOUGH);
      this.toast.error(this.langService.translations.MEMBER_WITHDRAW.NOT_ENOUGH);
      return;

    }

    if (this.publicService.withdraw_fee_enbled) {

      // console.log('withdraw_fee_enbled');

      let fee = this.limit.withdrawFeeType == 'fixed' ? this.limit.withdrawFee : (this.limit.withdrawFee * money) / 100;

      fee = this.decimalPipe.transform(fee, '1.0-2');

      if ((this.limit.withdrawFreeTimes > 0 && this.limit.withdrawNowTimes > this.limit.withdrawFreeTimes) || this.limit.withdrawFreeTimes == 0) {

        // console.log('bb');
        this.translateService.get('MEMBER_WITHDRAW.FEE', {
          fee: fee
        })
          .subscribe((res: string) => {

            this.toast.confirm(res, () => {
              // console.log('******submit******');
              this.doWithdraw();
            });

          });


        return;
      }

    }

    this.doWithdraw();


  }


  doWithdraw(): void {

    this.withdrawService.withdraw(this.form.value)
      .subscribe(() => {
        this.loadLastWithdraw();
        this.memberService.wallet();

        this.form.reset();

      }, ({ error }) => {

        // console.log('error', error);

        if (error.errors) {

          const { errors } = error;
          Object.assign(this.withDrawInvalidErr, errors);
          const msg = UtilService.contactErrMsg(errors);
          this.toast.error(msg);

        } else if (error.message) {
          // this.withDrawInvalidErr.msg = err.message;
          this.toast.error(error.message);
        }

      }).add(() => {
        this.memberService.moneyLimit();
      });

  }

  walletOpen(): void {
    this.isOpen = !this.isOpen;
  }


  refresh(): void {
    this.auth.getWallet();
    this.getAmount();
  }

  getAmount(): void {

    this.memberService.getAmount([amountType.able])
      .subscribe((res: any) => {

        this.ableMoney = res.data.able_money;

      });

  }

  goAmountRecord() {
    this.publicService.chkAmountFromWithdraw = true;
    this.router.navigateByUrl(AppRoutes.REVIEW_MAIN);
  }

  ngOnDestroy(): void {
    this.$review.unsubscribe();

    if (this.$rank) {
      this.$rank.unsubscribe();
    }
  }

}
