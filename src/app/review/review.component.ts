import { Component, OnInit } from '@angular/core';
import { ReviewService, EnumTranslateStatus, EnumStatus } from './../app-service/review.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LangService } from './../app-service/lang.service';
import { reviewType } from './../app-service/log.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  // styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  reviewType = reviewType;
  EnumStatus = EnumStatus;

  pageConfig: {
    itemsPerPage: number,
    currentPage: number,
    totalItems: number
  } = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };

  form: FormGroup;
  reviewOptions = [];
  selectReview = new FormControl();
  data;
  list = [];
  statusMap;
  depositCntMap;
  withdrawCntMap;
  typeNameNow = '';
  type;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private reviewService: ReviewService,
    private langService: LangService
  ) {

    this.form = this.formBuilder.group({
      startTime: '',
      endTime: '',
    });
  }

  ngOnInit(): void {

    const { translations } = this.langService;
    this.reviewOptions = [
      {
        label: translations.NEWBIE.DEPOSIT.TITLE,
        value: reviewType.deposit
      },
      {
        label: translations.NEWBIE.WITHDRAW.TITLE,
        value: reviewType.withdraw
      }
    ];

    this.type = reviewType.deposit;

    this.selectReview.patchValue(reviewType.deposit);
    this.statusMap = {
      // '': '全部',
      // review: '审核中',
      review: translations.REVIEW_STATUS.REVIEW,
      // approved: '审核通过',
      approved: translations.REVIEW_STATUS.APPROVED,
      // disapproved: '审核不通过'
      disapproved: translations.REVIEW_STATUS.DISAPPROVED
    };


    this.depositCntMap = {
      'review_third_party_deposit': translations.MEMBER_REVIEW.review_third_party_deposit,
      'review_member_deposit_bank': translations.MEMBER_REVIEW.review_member_deposit_bank
    };

    this.withdrawCntMap = {
      'none': '',
      'bank': translations.MEMBER_REVIEW.review_member_deposit_bank,
      'third': translations.MEMBER_REVIEW.review_withdraw_third
    };


  }

  searchReview(onBtm = false): void {

    if (!onBtm) {

      this.list = [];

      this.pageConfig = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 0
      };
    }

    const tmpTypeName = (this.selectReview.value === reviewType.deposit)
      ? this.reviewOptions[0].label : this.reviewOptions[1].label;


    // query type changes, reset pageconfig
    if (this.typeNameNow !== '' && tmpTypeName !== this.typeNameNow && onBtm === false) {

      this.pageConfig = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 0
      };
    }


    // this.typeNameNow = tmpTypeName;

    const type = this.selectReview.value;
    console.log('searchReview', type);
    this.type = type;

    const formdata = Object.assign({}, this.form.value);
    formdata.page = this.pageConfig.currentPage;
    formdata.perPage = this.pageConfig.itemsPerPage;

    console.log('formdata', formdata);

    switch (type) {
      case reviewType.deposit:

        this.reviewService.deposit(formdata)
          .subscribe((res: any) => {

            console.log('deposit res', res);

            res.data.content.forEach((item) => {

              item.statTxt = this.statusMap[item.status];
              item.cntTxt = this.depositCntMap[item.tableName];

            });

            this.typeNameNow = this.reviewOptions[0].label;
            this.data = res.data;
            this.list = this.list.concat(this.data.content);
            this.pageConfig.totalItems = this.data.total;
            this.pageConfig.itemsPerPage = this.data.perPage;
            this.pageConfig.currentPage = this.data.page;
          });


        break;

      case reviewType.withdraw:

        formdata.transactionStatus = '';
        this.reviewService.withdraw(formdata)
          .subscribe((res: any) => {

            console.log('this.reviewService.withdraw', res);

            res.data.content.forEach((item: any) => {


              // console.log('item.status', item.status, this.statusMap[item.status]);

              item.statTxt = this.statusMap[item.status];
              item.cntTxt = this.withdrawCntMap[item.type];

              if (item.status !== 'approved') {

                item.transactionStatusTxt = '';

              } else {

                item.transactionStatusTxt = this.langService.translations.TRANSACTION_STATUS[item.transactionStatus];

              }
            });

            this.typeNameNow = this.reviewOptions[1].label;

            console.log('typeNameNow', this.typeNameNow);


            this.data = res.data;
            this.list = this.list.concat(this.data.content);
            this.pageConfig.totalItems = this.data.total;
            this.pageConfig.itemsPerPage = this.data.perPage;
            this.pageConfig.currentPage = this.data.page;

          });

        break;

      case reviewType.activityWallet:

        formdata.transactionStatus = '';
        // this.typeNameNow = this.langService.translations.MEMBER_NAV.ACTIVITY_WALLET;
        this.reviewService.activityWallet(formdata)
          .subscribe((res: any) => {

            console.log('this.reviewService.withdraw', res);

            res.data.content.forEach((item: any) => {


              // console.log('item.status', item.status, this.statusMap[item.status]);

              item.statTxt = this.statusMap[item.status];
              item.cntTxt = item.name;
              item.money = item.price;

              if (item.status !== 'approved') {

                item.transactionStatusTxt = '';

              } else {

                item.transactionStatusTxt = this.langService.translations.TRANSACTION_STATUS[item.transactionStatus];

              }
            });

            this.typeNameNow = this.reviewOptions[2].label;
            this.data = res.data;
            this.list = this.list.concat(this.data.content);
            this.pageConfig.totalItems = this.data.total;
            this.pageConfig.itemsPerPage = this.data.perPage;
            this.pageConfig.currentPage = this.data.page;

          });
        break;

      default:
        break;
    }



  }

  setTime(evt): void {

    this.form.controls.startTime.patchValue(evt.start);
    this.form.controls.endTime.patchValue(evt.end);

  }

  onBtm(evt): void {



    if (this.list.length < this.pageConfig.totalItems) {


      this.pageConfig.currentPage++;
      this.searchReview(true);


    }
  }

}
