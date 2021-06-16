import { WalletService } from './../app-service/wallet.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {

  records = [];

  itemsPerPage;
  currentPage;
  totalItems;


  @Input() logId: number;
  @Output() closeEvt = new EventEmitter();

  constructor(
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(page = 1): void {
    this.walletService.getActivityWalletReportList(
      {
        logId: this.logId,
        page: page
      }
    )
      .subscribe(
        (res: any) => {

          console.log('res', res);

          if (res.content) {
            this.itemsPerPage = res.perPage;
            this.currentPage = res.page;
            this.totalItems = res.total;
            this.records = res.content;
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

    this.closeEvt.emit();

  }

}
