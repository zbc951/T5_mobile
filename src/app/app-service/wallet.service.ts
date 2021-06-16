import { ToastService } from './toast.service';
import { UtilService } from './util.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiPath } from '../constant/api';
import { IResponseGame } from '../app-service/public.service'
import { BehaviorSubject, Observable, of } from 'rxjs';

export const retryLimit = 3;
export const retrySec = 3;

export enum transferType {
  OUT,
  IN
}

export enum moneyLoadStatus {
  LOADING = 'loading',
  GOT = 'got'
}

export enum buyResponse {
  // 購買完成
  ok = 'ok',
  // 是超過可購買數量
  exceedNum = '400',
  // 餘額不足
  moneyNotEnough = '403',
  // 是沒有這個產品
  noProd = '404',
}

export enum Activity_type {
  fixed = 'fixed',
  percent = 'percent'
}

export enum WalletType {
  COUPON = 'coupon-wallet',
  PLATFORM = 'platform-wallet',
  COUPON_HISTORY = 'coupon-hisotry'
}


@Injectable({
  providedIn: 'root'
})
export class WalletService {

  multiWalletPlatforms = [];
  platformsSubject = new BehaviorSubject([]);
  platformsSubject2 = new BehaviorSubject([]);
  tmpActivity;
  activityWalletLogSubject = new BehaviorSubject([]);


  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) { }

  getMultiWalletPlatforms() {

    return this.http.get<IResponseGame>(ApiPath.ApiWalletGetGames)
      .subscribe(
        (res: any) => {

          // console.log('ApiWalletGetGames res', res);
          const { data } = res;
          if (data.platforms) {

            data.platforms.forEach((platform: any) => {
              platform.balance = 0;
            });

            this.multiWalletPlatforms = data.platforms;
            this.platformsSubject.next(this.multiWalletPlatforms);

            this.multiWalletPlatforms.forEach((p) => {

              this.getMultiBalance(p.key)
                .subscribe((balanceRes: any) => {
                  if (balanceRes.result == 'ok') {

                    p.balance = balanceRes.balance;
                    this.platformsSubject2.next(this.multiWalletPlatforms);

                  }
                });

            });

          }
        }
      );
  }

  getMultiPlatforms() {
    return this.platformsSubject.asObservable();
  }

  getMultiPlatforms2() {
    return this.platformsSubject2.asObservable();
  }

  getMultiBalance(key) {
    return this.http.post<any>(`${ApiPath.ApiWalletGetwallet}/${key}/3`, {});
  }

  updatePlatformsBalance(pkey = null) {

    if (pkey) {

      const pl = this.multiWalletPlatforms.find((p) => {

        return p.key == pkey;

      });

      console.log('updatePlatformsBalance pkey', pkey);

      if (pl) {

        this.getMultiBalance(pkey)
          .subscribe((balanceRes: any) => {

            if (balanceRes.result == 'ok') {

              pl.balance = balanceRes.balance;

              // this.platformsSubject2.next(this.multiWalletPlatforms);

            }
          });
      }

    }
    // else {

    //   this.multiWalletPlatforms.forEach((p) => {

    //     this.getMultiBalance(p.key)
    //       .subscribe((balanceRes: any) => {
    //         if (balanceRes.result == 'ok') {

    //           p.balance = balanceRes.balance;
    //           this.platformsSubject2.next(this.multiWalletPlatforms);
    //         }
    //       });

    //   });
    // }
  }

  multiTranceOut(key, val, platformId) {
    return this.http.post<IResponseGame>(`${ApiPath.ApiWalletGetwallet}/${key}/5`, {
      amount: val,
      platformId: platformId
    });
  }

  multiTranceIn(key, val, platformId) {
    return this.http.post<IResponseGame>(`${ApiPath.ApiWalletGetwallet}/${key}/6`, {
      amount: val,
      platformId: platformId
    });
  }

  getActivityWallet() {

    return this.http.post<any>(ApiPath.ApiAactivityAactivityWalletGet, {});

  }

  buyActivityWallet(productId, price = null): Observable<any> {
    return this.http.post<any>(ApiPath.ApiAactivityAactivityWalletBuy, { productId: productId, price: price });
  }

  getActivityWalletLog(formData: {
    startTime?: string,
    endTime?: string,
    platformId: [any],
    page?: number
  } = null) {

    // console.log('getActivityWalletLog formData', formData);

    if (formData) {

      if (formData.platformId[0] === 'all') {
        formData.platformId = null;
      }

      const params = UtilService.getHttpParams(formData);
      return this.http.get<any>(ApiPath.ApiAactivityAactivityWalletLog, { params });

    } else {

      return this.http.get<any>(ApiPath.ApiAactivityAactivityWalletLog);

    }
  }


  getActivityWalletLogBySubject() {
    // console.log('getActivityWalletLogBySubject');

    return this.http.get<any>(ApiPath.ApiAactivityAactivityWalletLog)
      .subscribe((res: any) => {

        this.activityWalletLogSubject.next(res);

      });

  }

  getActivityWalletLogSub() {
    return this.activityWalletLogSubject.asObservable();
  }




  mountActivityWallet(params: {
    platformId,
    purchaseLogId
  }) {

    return this.http.post<any>(ApiPath.ApiActivityWalletMount, params);

  }

  unmountActivityWallet(params: {
    platformId
  }) {

    return this.http.post<any>(ApiPath.ApiActivityWalletUnmount, params);
  }


  getFromWalletActivityWallet(params: {
    purchaseLogId
  }) {

    return this.http.post<any>(ApiPath.ApiActivityWalletGetFromWallet, params);

  }

  getAactivityWalletWallets(params: {
    platformId
  }) {

    return this.http.post<any>(ApiPath.ApiActivityAactivityWalletWallets, params);

  }

  giveup(params: {
    purchaseLogId
  }): Observable<any> {

    return this.http.post<any>(ApiPath.ActivityWalletGiveUp, params);

  }

  getUserWalletAll(): Observable<any> {

    return this.http.post<any>(ApiPath.ApiActivityAactivityWalletWalletAll, {});

  }


  buy(item, QUEST_CENTER, resCallback = null): void {
    if (item.type === Activity_type.fixed) {

      this.buyActivityWallet(item.id)
        .subscribe(
          (res) => {
            this.resHandler(res, QUEST_CENTER, resCallback);

          },
          (err) => {
            // console.log('err', err);
            this.errorHandler(err);


          });

    } else {

      this.toast.buyActivity(QUEST_CENTER.price_input, item.percentMinPrice, (input) => {

        // console.log('input', input);
        this.buyActivityWallet(item.id, input)
          .subscribe(
            (res) => {

              // console.log('res', res);
              this.resHandler(res, QUEST_CENTER, resCallback);

            },
            (err) => {
              // console.log('err', err);
              this.errorHandler(err);
            });

      });

    }
  }

  resHandler(res, QUEST_CENTER, resCallback = null): void {

    if (res.result) {

      const result = String(res.result);
      switch (res.result) {

        case buyResponse.ok:


          if (res.isAutoPass) {

            this.toast.error(QUEST_CENTER.buy_success);
          } else {

            this.toast.error(QUEST_CENTER.review);
          }

          break;
        case buyResponse.exceedNum:
          this.toast.error(QUEST_CENTER.buy_exceedNum);
          break;
        case buyResponse.moneyNotEnough:
          this.toast.error(QUEST_CENTER.buy_moneyNotEnough);
          break;
        case buyResponse.noProd:
          this.toast.error(QUEST_CENTER.buy_noProd);
          break;
      }

      if (resCallback) {
        resCallback();
      }

    }

  }

  errorHandler(err): void {
    if (err.error && typeof err.error === 'string') {

      this.toast.error(err.error);

    } else {

      this.toast.error(err.message);

    }
  }

  getActivityWalletReportList(params: {
    logId: number,
    page: number
  }): Observable<any> {

    // console.log('getActivityWalletReportList', params);

    return this.http.post<any>(ApiPath.ActivityWalletReportList, params);

  }

  getActivityWalletHistory() {
    return this.http.get<any>(ApiPath.ApiAactivityAactivityWalletHistory);
  }

  getPlatformWallet() {

    return this.http.get<any>(ApiPath.ApiWalletGetPlotformWallet);

  }


}
