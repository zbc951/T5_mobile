import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { EventService } from '../app-service/event.service';
import { MemberService, checkPopupType } from '../app-service/member.service';

@Component({
  selector: 'app-withdraw-bet-record',
  templateUrl: './withdraw-bet-record.component.html',
  // styleUrls: ['./withdraw-bet-record.component.scss']
  // styleUrls: ['../../scss/withdraw_lock_detail.component.scss']
})
export class WithdrawBetRecordComponent implements OnInit {


  records = [];
  serial_num = '';
  deductionBetAmount;
  makeUpBetAmount;

  itemsPerPage;
  currentPage;
  totalItems;

  @Output() closeEvt = new EventEmitter();

  constructor(
    // private eventService: EventService,
    private memberService: MemberService) { }

  ngOnInit(): void {
    this.serial_num = this.memberService.serial_num;
    this.getData();
  }

  getData(page = 1): void {
    this.memberService.getbetamountlogdetail(this.memberService.members_bet_amount_record_id, page)
      .subscribe(
        (res: any) => {

          console.log('res', res);

          if (res.content) {
            this.itemsPerPage = res.perPage;
            this.currentPage = res.page;
            this.totalItems = res.total;
            this.records = res.content;
            this.deductionBetAmount = res.deductionBetAmount;
            this.makeUpBetAmount = res.makeUpBetAmount;
          }

        });
  }

  changePage(page): void {

    this.getData(page);
  }


  pageChanged(page): void {

    this.changePage(page);

  }

  close(): void {

    this.closeEvt.emit(checkPopupType.bet);

  }
}
