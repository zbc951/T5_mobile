import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';

export const timeFormat = 'YYYY-MM-DD';

export enum periodType {
  yesterday,
  today,
  week,
  month,
  twoWeek,
  twoMonth
}

@Injectable({
  providedIn: 'root'
})
export class DayjsService {

  constructor() { }

  static now(useFormat: boolean = true, format = timeFormat): any {

    if (useFormat) {
      return dayjs().format(format);
    } else {
      return dayjs();
    }
  }

  static getDayjsObj(time, format = null): any {

    if (format) {

      return dayjs(time).format(format);
    }

    return dayjs(time);


  }

  static getPeriodTime(periodTimeId): { start, end } {

    let start;
    let end;

    end = DayjsService.now(false);

    // console.log('end', end);

    switch (periodTimeId) {

      case periodType.yesterday:
        end = end.subtract(1, 'days');
        start = end.clone();

        break;

      case periodType.today:
        start = end.clone();
        break;

      case periodType.week:
        start = end.startOf('w');
        end = end.endOf('w');
        break;

      case periodType.month:
        start = dayjs().startOf('M');
        end = dayjs().endOf('month');
        break;

      case periodType.twoWeek:
        start = end.clone().subtract(2, 'weeks');
        break;

      case periodType.twoMonth:
        start = end.clone().subtract(2, 'months');

        // console.log('start', start);
        break;
    }

    const startTxt = start.format(timeFormat);
    const endTxt = end.format(timeFormat);

    return {
      start: startTxt,
      end: endTxt
    }
  }

}
