import { Subject, pipe, BehaviorSubject, Observable } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

export enum lang {
  zhHans = 'zh-Hans',
  zhHant = 'zh-Hant',
  en = 'en',
  jp = 'jp'
}

@Injectable({
  providedIn: 'root',
})
export class LangService {
  translations;
  onloadSub = new BehaviorSubject(false);

  constructor(private translate: TranslateService) {

    this.translate.onLangChange.subscribe((evt: LangChangeEvent) => {
      const { translations } = evt;
      this.setTxt(translations);
    });
  }

  setTxt(translations): void {

    this.translations = translations;
    this.onloadSub.next(true);
    // console.log('lang.service ready');
  }

}
