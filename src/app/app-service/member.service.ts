import { UtilService } from './util.service';
import { Injectable } from '@angular/core';
import { ApiPath } from '../constant/api';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, EMPTY, Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';

export interface IMemberInfo {
  id: number;
  account: string;
  name: string;
  nickname?: string;
  birth: string;
  email?: string;
  gender?: string;
  phone?: string;
  qq?: string;
  wechat?: string;
  weibo?: string;
  smsCode?: string;
}

export interface IMoneyLimit {
  depositMinPer: number;      // number 單次存款額度下限
  depositMaxPer: number;      // number 單次存款額度上限
  depositDayTimes: number;    // number 每日存款次數上限
  withdrawMinPer: number;     // number 單次提款額度下限
  withdrawMaxPer: number;     // number 單次提款額度上限
  withdrawDayTimes: number;   // number 每日提款次數上限
}

export enum amountType {
  able = 'able', // 可提資金
  activity = 'activity', // 活動錢包
  total = 'total' // 總資金
}

export enum checkPopupType {
  drawback = 'drawback',
  bet = 'bet'
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private limit: IMoneyLimit;
  limitSubject = new BehaviorSubject({});
  prioritySub = new Subject<boolean>();
  amountComputeSub = new BehaviorSubject({});

  /** check out drawback list */
  members_bet_amount_record_id;
  serial_num;

  tmpStageDetail;

  clubRankSub = new BehaviorSubject([]);

  constructor(
    private http: HttpClient
  ) { }

  checkoutDrawback(id, sNum) {

    this.members_bet_amount_record_id = id;
    this.serial_num = sNum;
  }

  getInfo() {
    return this.http.get<IMemberInfo>(ApiPath.ApiMemberInfo);
  }

  updateInfo(data: {
    name?: string;
    nickname?: string;
    phone?: string;
    smsCode?: string;
    birth?: string;
    email?: string;
    qq?: string;
    wechat?: string;
    weibo?: string;
  }) {
    return this.http.post(ApiPath.ApiMemberUpdateInfo, data);
  }

  changePassword(data: { newPassword: string; oldPassword: string }) {
    return this.http.post(ApiPath.ApiMemberUpdatePassword, data);
  }

  wallet() {
    return this.http.get(ApiPath.ApiMemberWallet);
  }

  moneyLimit() {
    return this.http.get(ApiPath.ApiMemberMoneyLimit)
      .subscribe((res: { data: IMoneyLimit }) => {

        for (let p in res.data) {
          if (p != 'withdrawFeeType') {
            res.data[p] = Number(res.data[p]);
          }
        }

        this.limit = res.data;
        this.limitSubject.next(this.limit);

      });


  }

  getLimit() {
    return this.limitSubject.asObservable();
  }

  bindPhone(data: { phone: string }) {
    return this.http.post(ApiPath.ApiMemberBindPhone, data);

  }

  getQuestList() {
    return this.http.get<any>(ApiPath.ApiMemberQuestList);
  }

  getQuestListApplied(pageConfig) {
    const params = UtilService.getHttpParams(pageConfig);
    return this.http.get<any>(ApiPath.ApiMemberQuestListApplied, { params });
  }

  applyQuest(id, detailId) {
    return this.http.post<any>(ApiPath.ApiMemberQuestCommit,
      {
        questId: id,
        detailId: detailId
      }
    );

  }

  getQuestRecord(obj = {}) {
    return this.http.post<any>(ApiPath.ApiMemberQuestClaimed, obj);
  }

  getPlatformInfo() {
    return this.http.get<any>(ApiPath.ApiMemberPlatformInfo);
  }

  getQuestOrderList() {
    return this.http.get<any>(ApiPath.ApiMemberQuestSortList);
  }

  editQuestOrder(obj) {
    return this.http.post<any>(ApiPath.ApiMemberQuestSortEdit,
      { sort: obj }
    )
  }

  confirmPriority(boo) {

    this.prioritySub.next(boo);

  }

  getLogsBetamountlog(page = 1) {

    return this.http.get<any>(`${ApiPath.ApiMemberLogsBetamountlog}?page=${page}`);
  }

  getDeductionbetamountlog(id, page = 1) {
    return this.http.get<any>(`${ApiPath.ApiMemberLogsDeductionbetamountlog}?members_bet_amount_record_id=${id}&page=${page}`);
  }

  getWaterBackfillDetail(id, page = 1) {
    return this.http.get<any>(`${ApiPath.ApiMemberLogsWaterBackfillDetail}?members_bet_amount_record_id=${id}&page=${page}`);
  }

  getbetamountlogdetail(id, page = 1) {
    return this.http.get<any>(`${ApiPath.ApiMemberLogsbetamountlogdetail}?members_bet_amount_record_id=${id}&page=${page}`);
  }

  resetLock() {
    return this.http.get<any>(ApiPath.ApiMemberWithdrawResetlock);
  }

  getForthList(page) {
    return this.http.get<any>(`${ApiPath.apiMemberForth}?page=${page}`);
  }


  getClubRankList() {

    return this.http.get<any>(ApiPath.ApiMemberClubRankList)
      .pipe(
        tap((res) => {

          this.clubRankSub.next(res);

        }));
  }

  getMemberClubRank() {
    return this.http.get<any>(ApiPath.ApiMemberMemberClubRank);
  }

  getMemberBetAmountByPlatform() {
    return this.http.get<any>(ApiPath.ApiMemberMemberBetAmountByPlatform);
  }


  getAmount(args) {

    // amountType
    // console.log('getAmount', params);

    const tmp = {
      type: args
    };

    const params = UtilService.getHttpParams(tmp);
    // return EMPTY;

    return this.http.get(ApiPath.ApiMemberAmountCompute, { params })
      .pipe(
        tap((res) => {

          this.amountComputeSub.next(res);

        }));
  }

  getAmountSub(): Observable<any> {

    return this.amountComputeSub.asObservable().pipe(share());

  }

  listenClubRank() {
    return this.clubRankSub.asObservable().pipe(share());
  }

}
