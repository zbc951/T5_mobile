import { Injectable } from '@angular/core';
import { LangService } from './../app-service/lang.service';

export enum SelectType {
  Platform = 'platform',
  Wallet = 'wallet',
  Lang = 'lang'
}
@Injectable({
  providedIn: 'root'
})
export class SelectAlertService {

  SelectType = SelectType;
  selects: any = {};
  title;
  isOpen = false;
  cur = {
    index: -1,
    item: {
      id: 0,
      name: '',
      key: ''
    }
  };

  constructor(
    private langService: LangService,
  ) { }

  public alert(data, timeout = 3000, callback = null, type = null): void {

    this.selects = { data, timeout, callback };
    this.isOpen = true;

    // console.log('selects', this.selects);
    // console.log('selectAlertService.cur', this.cur);

    switch (type) {
      case SelectType.Platform:
        this.title = this.langService.translations.BET_LOG.PLATFORM;
        break;
      case SelectType.Wallet:
        this.title = this.langService.translations.BET_LOG.ACCOUNT;
        break;
    }
  }


  /**
   *
   * @param type 預留 type,  將來可以因應 type 改變樣式
   */
  open(data, callback, cur, type): void {

    // console.log('open');

    if (cur.index !== -1) {

      this.cur = cur;

    } else {

      this.cur = {
        index: -1,
        item: {
          id: 0,
          name: '',
          key: ''
        }
      };

    }
    this.alert(data, 3000, callback, type);
  }
}
