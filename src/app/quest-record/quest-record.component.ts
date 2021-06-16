import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LangService } from './../app-service/lang.service';
import { MemberService } from './../app-service/member.service';
import { ToastService } from './../app-service/toast.service';

@Component({
  selector: 'app-quest-record',
  templateUrl: './quest-record.component.html',
  // styleUrls: ['./quest-record.component.scss']
})
export class QuestRecordComponent implements OnInit {

  questRecord = [];
  form;
  daterangepicker = new FormControl('');

  pageConfig: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };

  selectReview = new FormControl();

  statusTxt;
  translations;
  isNoRecord = true;

  list;
  EnumWalletLogType;

  constructor(
    private langService: LangService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private memberService: MemberService
  ) {

    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {

          this.translations = this.langService.translations;

          const REVIEW_STATUS = this.translations.REVIEW_STATUS;

          this.statusTxt = {
            // '': '全部',
            pending: REVIEW_STATUS.PENDING,
            review: REVIEW_STATUS.REVIEW,
            approved: REVIEW_STATUS.APPROVED,
            disapproved: REVIEW_STATUS.DISAPPROVED,
            cancel: REVIEW_STATUS.CANCEL
          };

        }

      });

    this.form = this.formBuilder.group({
      status: '',
      start_at: '',
      end_at: '',
    });

  }

  ngOnInit(): void {
  }

  getQuestRecord(): void {

    const formdata = Object.assign({}, this.form.value);
    // const period = this.daterangepicker.value;

    // formdata.start_at = DayjsService.getDayjsObj(period[0], timeFormat);
    // formdata.end_at = DayjsService.getDayjsObj(period[1], timeFormat);

    this.memberService.getQuestRecord(formdata)
      .subscribe(
        (res) => {

          if (res.length) {

            let questRecord = res;

            if (questRecord.length > 0) {
              this.isNoRecord = false;
            } else {
              this.isNoRecord = true;
            }

            questRecord.forEach((item, index) => {
              for (const key in item) {
                if (item.hasOwnProperty(key)) {
                  const element = item[key];
                  if ((key != 'startTime' && key != 'endTime') && element == null || element == '') {
                    item[key] = '-';
                  }

                  if (key == 'status') {
                    item[key] = this.statusTxt[item['status']];
                  }
                }
              }

            });

            this.questRecord = questRecord;

          } else {
            this.questRecord = [];
            this.isNoRecord = true;
          }


        },
        (err) => {
          this.toast.error(err);
        }
      );





  }

  setTime(evt): void {
    this.form.controls.start_at.patchValue(evt.start);
    this.form.controls.end_at.patchValue(evt.end);
  }

}
