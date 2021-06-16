import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

export enum ToastType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Confirm = 'confirm',
  Policy = 'policy',
  ForceAlert = 'forceAlert',
  QuestDetail = 'questDetail',
  QuestCondition = 'questCondition',
  Activity_buy = 'Activity_buy'
}

export interface ToastItem {
  message: string;
  timeout: number;
  type: ToastType;
}


@Injectable({
  providedIn: 'root'
})


export class ToastService {

  toasts = [];
  msgsSubject = new BehaviorSubject([]);

  constructor() { }


  getMsgs(): any {

    return this.msgsSubject.asObservable();

  }

  private alert(type: ToastType, message: string, timeout = 3000, callback = null, percentMinPrice = null): void {

    // console.log('callback', callback);

    this.toasts.push({ type, message, timeout, callback, percentMinPrice });
    this.msgsSubject.next(this.toasts);
  }

  error(message: string, timeout = 3000): void {
    this.alert(ToastType.Error, message, timeout);
  }

  info(message: string, timeout = 3000): void {
    this.alert(ToastType.Info, message, timeout);
  }

  warning(message: string, timeout = 3000): void {
    this.alert(ToastType.Warning, message, timeout);
  }

  success(message: string, timeout = 3000): void {
    this.alert(ToastType.Success, message, timeout);
  }

  successConfirm(message: string, callback: () => void): void {
    this.alert(ToastType.Success, message, 5000, callback);
  }

  // [execute sth, cancel]
  confirm(message: string, callback): void {
    this.alert(ToastType.Confirm, message, 3000, callback);
  }

  // [execute sth] for policy page
  policy(message: string, callback): void {
    this.alert(ToastType.Policy, message, 3000, callback);
  }

  // [execute sth]
  forceAlert(message: string, callback): void {

    this.alert(ToastType.ForceAlert, message, 3000, callback);

  }

  questDetail(message): void {
    this.alert(ToastType.QuestDetail, message, 3000);
  }

  questCondition(callback): void {
    this.alert(ToastType.QuestCondition, '', 3000, callback);

  }

  buyActivity(message, percentMinPrice, callback): void {
    this.alert(ToastType.Activity_buy, message, 3000, callback, percentMinPrice);
  }

}
