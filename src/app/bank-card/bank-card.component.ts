import { PublicService } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
import { AppRoutes } from './../constant/routes';
import { Router } from '@angular/router';
import { UtilService } from './../app-service/util.service';
import { DayjsService, periodType } from './../app-service/dayjs.service';
import { ReviewService } from './../app-service/review.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastService } from './../app-service/toast.service';
import { BankService, IReviewBank } from './../app-service/bank.service';
import { AuthService } from './../app-service/auth.service';
import { LangService } from './../app-service/lang.service';
import { debounceTime, distinctUntilChanged, startWith, map, publishReplay } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { MemberService } from '../app-service/member.service';

@Component({
  selector: 'app-bank-card',
  templateUrl: './bank-card.component.html',
  // styleUrls: ['./bank-card.component.scss']
})
export class BankCardComponent implements OnInit {

  banks = [];
  lastReview: IReviewBank | null = null;
  banksLimit = 0;

  user;
  addBankForm: FormGroup;
  bankVlidErrors = {
    bankName: '',
    branchName: '',
    name: '',
    account: '',
    confirmAccount: ''
  };
  optionCtrl: FormControl;

  bankOptions;

  // 不能存轉提
  locked = false;

  private data$;
  $review;


  constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private auth: AuthService,
    private bankService: BankService,
    private toastService: ToastService,
    private reviewService: ReviewService,
    private router: Router,
    private memberService: MemberService,
    private publicService: PublicService
  ) {

    this.$review = this.reviewService.getReviewApproved().subscribe((res: any) => {
      if (res.reviewTypeKey === "bank") {
        this.ngOnInit();
      }
    })


  }


  ngOnInit(): void {

    this.user = this.auth.user;
    // console.log('user', this.user);

    this.getBanks();
    this.lastReviews();
    this.optionCtrl = new FormControl();
    this.optionCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((val) => {

        // console.log('val', val);

        this.bankService.getBanklist(val)
          .subscribe((res: any) => {
            if (res) {

              this.bankOptions = res.data;
            }
          });
      });
    this.addBankForm = this.formBuilder
      .group(
        {
          bankName: '',
          branchName: '',
          name: this.user.name,
          account: '',
          confirmAccount: '',
          fpCode: ''
        }
      );


    this.locked = this.publicService.locked;
    if (this.locked) {
      this.addBankForm.disable();
      this.optionCtrl.disable();
    }

    this.memberService.getInfo()
      .subscribe((res: any) => {
        // console.log('memberService.getInfo', res);

        const { data } = res;

        if (!(data.name && data.email && data.birth && (data.line || data.wechat))) {

          this.toastService.forceAlert(this.langService.translations.MEMBER_BANK.TIPS_TO_INFO,
            () => {
              this.router.navigateByUrl(AppRoutes.USER_INFO);
            });

        }

        // console.log('**', this.user.name);
        if (data.name) {

          this.addBankForm.controls.name.patchValue(data.name);

        }

      });

  }

  getBanks(): void {

    const period = DayjsService.getPeriodTime(periodType.twoMonth);

    const reviewData = {
      startTime: period.start,
      endTime: period.end,
      status: 'review',
    };

    this.data$ = forkJoin([
      this.reviewService.bankEdit(reviewData),
      this.bankService.banks()]
    )
      .subscribe((res: any[]) => {

        const review = res[0].data.content;
        // console.log('review', review);

        let banks = res[1].data;

        this.banksLimit = res[1].limit;
        // console.log('banks', banks);

        if (banks) {

          if (review) {
            banks = review.concat(banks);
          }

          this.banks = banks;
          // console.log('banks***', this.banks);
        }

      });



  }

  lastReviews(): void {
    this.bankService.lastReview()
      .subscribe((res: any) => {
        // console.log('lastReview res', res);
        this.lastReview = res.data;

        if (this.lastReview) {
          // this.toastService.error(this.translations.MEMBER_BANK.applied);
          this.toastService.error(this.langService.translations.MEMBER_BANK.applied);

        }

      });
  }

  getCode(data): void {
    this.addBankForm.controls.fpCode.patchValue(data.code);
    this.addBankForm.controls.bankName.patchValue(data.name);
  }

  addBank(form): void {

    // console.log('addBank', form.value);
    // 代表 使用者 有試著欄位填東西
    if (this.optionCtrl.value) {

      if (!form.value.fpCode) {

        // 有 key 東西, 但沒有 fpCode 就是 自己填的

        const no_fpCode = this.langService.translations.MEMBER_BANK.no_fpCode;
        this.bankVlidErrors.bankName = no_fpCode;

        this.toastService.forceAlert(no_fpCode, () => {
          this.bankVlidErrors.bankName = '';
        });

        return;

      }

    } else {

      // 真的什麼都沒填
      this.bankVlidErrors.bankName = this.langService.translations.REQUIRED;

      return;
    }

    if (form.value.account && (form.value.account !== form.value.confirmAccount)) {

      this.bankVlidErrors.confirmAccount = this.langService.translations.MEMBER_BANK.notSame;
      return;
    }

    // console.log('lastReview', this.lastReview);

    if (this.lastReview) {
      // 有審核中的資料，不可申請

      // this.toastService.error('已有资料审核中', 3000);
      this.toastService.error(this.langService.translations.MEMBER_BANK.applied, 3000);

    } else {


      // 沒有審核中的資料，可送出申請

      console.log('form.value', form.value);


      if (form.value.account) {

        this.addBankForm.controls.account.patchValue(form.value.account.trim());
      }

      if (form.value.confirmAccount) {

        this.addBankForm.controls.confirmAccount.patchValue(form.value.confirmAccount.trim());
      }


      this.bankService.add(form.value)
        .subscribe((res: any) => {

          // console.log('bankService.add res', res);
          this.getBanks();

          if (res.data.review === true) {

            this.lastReview = Object.assign({}, form.value);

            this.toastService.error(this.langService.translations.MEMBER_BANK.submitted, 3000);

            const errors = {
              bankName: '',
              branchName: '',
              name: '',
              account: '',
              confirmAccount: ''
            };
            Object.assign(this.bankVlidErrors, errors);


          } else {

            this.toastService.error(this.langService.translations.MEMBER_BANK.success, 3000);
            const errors = {
              bankName: '',
              branchName: '',
              name: '',
              account: '',
              confirmAccount: ''
            };
            Object.assign(this.bankVlidErrors, errors);

          }

        }, ({ error }) => {

          // console.log('error', error);

          if (error.errors) {

            const { errors } = error;
            Object.assign(this.bankVlidErrors, errors);
            const msg = UtilService.contactErrMsg(errors);

            if (error.errors.fpCode) {
              this.toastService.error(this.langService.translations.MEMBER_BANK.no_bank);
            }

            // this.toastService.error(msg, 3000);

          } else if (error.message) {

            this.toastService.error(error.message);
          }


        }
        ).add(() => {
          console.log('**** final'); //works

          form.reset({
            name: this.user.name
          });

          this.optionCtrl.reset();


        })
        ;
    }
  }

  ngOnDestroy(): void {
    this.$review.unsubscribe();
  }
}
