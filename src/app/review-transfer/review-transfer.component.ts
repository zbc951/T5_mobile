import { ToastService } from './../app-service/toast.service';
import { Component, OnInit } from '@angular/core';
import { LogService, EnumWalletLogType } from './../app-service/log.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PublicService } from '../app-service/public.service';
import { LangService } from './../app-service/lang.service';


enum logtypGroups {
  "group-deposit" = "group-deposit",
  "group-withdraw" = "group-withdraw",
  "group-transfer" = "group-transfer",
  "group-water" = "group-water",
  "group-activity-wallet" = "group-activity-wallet",
  "group-others" = "group-others"
}

enum withdrawType {
  transferGame = 'transfer-game',
  transferWallet = "transfer-wallet",
  mounted = 'mounted',
  unmounted = 'unmounted'
}


@Component({
  selector: 'app-review-transfer',
  templateUrl: './review-transfer.component.html',
  styleUrls: ['./review-transfer.component.scss']
})
export class ReviewTransferComponent implements OnInit {

  logtypGroups = logtypGroups;
  withdrawType = withdrawType;
  EnumWalletLogType = EnumWalletLogType;

  RECORD_REVIEW_OPTIONS;
  REVIEW_STATUS;
  REVIEW_TRANSFER_TYPE;
  REVIEW_WATER_TYPE;
  REVIEW_ACTIVITY_TYPE;

  pageConfig: {
    itemsPerPage: number,
    currentPage: number,
    totalItems: number
  } = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };

  typeOptions: {
    label: string,
    value: string,
  }[] = [];

  form: FormGroup;

  data;
  list = [];
  queryType;

  constructor(
    private formBuilder: FormBuilder,
    private publicService: PublicService,
    private logService: LogService,
    private langService: LangService,
    private toast: ToastService
  ) {


    this.form = this.formBuilder.group({
      startTime: '',
      endTime: '',
      // platformId: 'all',
      type: ''
    });

    this.publicService.isMemberModeOnSub
      .subscribe((isMemberModeOn) => {

        this.langService.onloadSub.subscribe((boo) => {

          if (boo) {
            const translations = this.langService.translations;
            this.RECORD_REVIEW_OPTIONS = translations.RECORD_REVIEW_OPTIONS;
            // console.log('EnumWalletLogType', EnumWalletLogType);
            this.REVIEW_STATUS = translations.REVIEW_STATUS;
            this.REVIEW_TRANSFER_TYPE = translations.REVIEW_TRANSFER_TYPE;
            this.REVIEW_WATER_TYPE = translations.REVIEW_WATER_TYPE;
            this.REVIEW_ACTIVITY_TYPE = translations.REVIEW_ACTIVITY_TYPE;

            // tslint:disable-next-line: forin
            // for (const p in EnumWalletLogType) {
            for (const p in logtypGroups) {

              this.typeOptions.push(
                {
                  label: this.RECORD_REVIEW_OPTIONS[p],
                  value: p
                }
              );

            }

            if (isMemberModeOn == false) {

              const tmp = this.typeOptions.find((item) => {
                return item.value == 'group-water';
              });

              tmp.label = this.RECORD_REVIEW_OPTIONS['group-water-off'];

            }

            // console.log('typeOptions', this.typeOptions);

            this.form.controls.type.patchValue(this.typeOptions[0].value);

          }

        });

      });





  }

  ngOnInit(): void {
    if (!this.publicService.isActivityWallet) {


      console.log(this.typeOptions);

      this.typeOptions = this.typeOptions.filter((item: any) => {

        return item.value !== logtypGroups['group-activity-wallet'];

      });


      const translations = this.langService.translations;
      this.typeOptions[2].label = translations.TRANSFER.TITLE;

    }


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

    const formdata = Object.assign({}, this.form.value);
    this.queryType = formdata.type;

    console.log('queryType', this.queryType);

    formdata.page = this.pageConfig.currentPage;
    formdata.perPage = this.pageConfig.itemsPerPage;

    this.logService.walletTypeGroup(formdata)
      .subscribe(
        (res: any) => {

          console.log('walletLog res', res);

          res.data.content.forEach((item) => {

            item.changeMoney = item.changeMoney;

          });

          this.data = res.data;
          this.list = this.list.concat(this.data.content);
          this.pageConfig.totalItems = this.data.total;
          this.pageConfig.itemsPerPage = this.data.perPage;
          this.pageConfig.currentPage = this.data.page;

        },
        (err) => {

          this.toast.error(err.errors);

        });

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
