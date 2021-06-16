import { LangService } from './../app-service/lang.service';
import { MemberService, checkPopupType } from './../app-service/member.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-amount-record',
  templateUrl: './amount-record.component.html',
  // styleUrls: ['./amount-record.component.scss']
})
export class AmountRecordComponent implements OnInit {

  records = [];

  itemsPerPage;
  currentPage = 1;
  totalItems;

  translationsRecordType;

  isDrawbackShow = false;
  isBetRecordShow = false;


  constructor(
    private memberService: MemberService,
    private langService: LangService
  ) {

    this.langService.onloadSub
      .subscribe((boo) => {
        if (boo) {

          this.translationsRecordType = this.langService.translations.MEMBER_WITHDRAW.record_type;

        }

      });

  }

  ngOnInit(): void {
    this.getLogsBetamountlog();
  }

  getLogsBetamountlog(page = 1): void {
    console.log('getLogsBetamountlog');
    this.memberService.getLogsBetamountlog(page)
      .subscribe(
        (res: any) => {

          console.log('getLogsBetamountlog', res);
          if (res.content) {

            this.itemsPerPage = res.perPage;
            this.currentPage = res.page;
            this.totalItems = res.total;

            // res.content.forEach(element => {

            //   element.typeTxt = this.translations.MEMBER_WITHDRAW.record_type[element.type];
            // });

            this.records = res.content;
          }
        },
        err => {
        });
  }

  openDrawBack(item): void {

    this.memberService.checkoutDrawback(item.id, item.serial_num);

    this.isDrawbackShow = !this.isDrawbackShow;
  }

  openBetlist(item): void {

    this.memberService.checkoutDrawback(item.id, item.serial_num);
    this.isBetRecordShow = !this.isBetRecordShow;

  }

  closePopup(evt): void {

    console.log('closePopup', evt);

    switch (evt) {

      case checkPopupType.drawback:
        this.isDrawbackShow = false;
        break;

      case checkPopupType.bet:
        this.isBetRecordShow = false;
        break;

    }

  }

  pageChanged(evt): void {
    this.changePage(evt);
  }

  changePage(page): void {
    this.getLogsBetamountlog(page);
  }

}
