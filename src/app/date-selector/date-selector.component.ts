import { LangService } from './../app-service/lang.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DayjsService, timeFormat, periodType } from '../app-service/dayjs.service';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  // styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent implements OnInit {

  options = [];
  selected = periodType.today;
  period;

  @Output() timeEvt = new EventEmitter();

  constructor(
    private langService: LangService
  ) {
  }

  ngOnInit(): void {
    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {

          const { translations } = this.langService;

          this.options = [
            {
              label: translations.BET_LOG.BUTTON.YESTERDAY,
              val: periodType.yesterday
            },
            {
              label: translations.BET_LOG.BUTTON.TODAY,
              val: periodType.today
            },
            {
              label: translations.BET_LOG.BUTTON.WEEK,
              val: periodType.week
            },
            {
              label: translations.BET_LOG.BUTTON.MONTH,
              val: periodType.month
            }
          ];

          this.select(this.selected);
        }

      });
  }

  select(idx): void {
    this.selected = idx;
    this.getPeriodTime();
  }

  getData(): any {

    return this.period;

  }

  getPeriodTime(): void {

    const period = DayjsService.getPeriodTime(this.options[this.selected].val);
    // console.log('period', period);
    this.period = period;
    this.timeEvt.emit(this.period);

  }

}
