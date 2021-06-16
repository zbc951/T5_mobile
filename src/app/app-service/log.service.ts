import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiPath } from '../constant/api';
import { UtilService } from './util.service';

export enum EnumWalletLogType {
  // 银行卡转帐
  'deposit-bank' = 'deposit-bank',
  // 存款手续费
  'deposit-fee' = 'deposit-fee',
  // 线上支付
  // 'deposit-third' = 'deposit-third',
  'third-party-deposit' = 'third-party-deposit',

  // 线上支付收回
  'third-party-deposit-rollback' = 'third-party-deposit-rollback',
  // 提款
  'withdraw' = 'withdraw',
  // 退款
  'withdraw-reject' = 'withdraw-reject',
  // 提款审核不通过
  'withdraw-disapproved' = 'withdraw-disapproved',
  // 代理派点
  'get-from-agent' = 'get-from-agent',
  // 代理收回
  'be-taken-back-agent' = 'be-taken-back-agent',
  // 错误补点
  'get-from-error' = 'get-from-error',
  // 错误点数回收
  'be-taken-back-error' = 'be-taken-back-error',
  // 金额修改
  'edit-money' = 'edit-money',
  // 转至游戏平台
  'transfer-game' = 'transfer-game',
  // 转回钱包
  'transfer-wallet' = 'transfer-wallet',
  // 取消出款
  'transaction-cancel' = 'transaction-cancel',
  // 派彩
  'prize' = 'prize',
  // 回滚
  'rollback' = 'rollback',
  // 分红
  'diviend' = 'diviend',
  // 开奖
  'settle' = 'settle',
  // 优惠赠点
  'edit-reward' = 'edit-reward',
  // 代客储值
  'agent-edit-deposit' = 'agent-edit-deposit',
  // 代客储值收回
  'agent-edit-deposit-rollback' = 'agent-edit-deposit-rollback',
  // 人工修改额度
  'manual-edit' = 'manual-edit',
  // 購買活動
  'activity-wallet-buy' = 'activity-wallet-buy',
  // 購買活動 不通過
  'activity-wallet-disapprove' = 'activity-wallet-disapprove'
}

export enum reviewType {
  deposit = 'deposit',
  withdraw = 'withdraw',
  transfer = 'transfer',
  activityWallet = 'activityWallet',
}

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(
    private http: HttpClient
  ) { }

  walletLog(formData: {
    startTime?: string,
    endTime?: string,
    type?: string,
    platformId?: number,
  } = null): Observable<any> {

    const params = UtilService.getHttpParams(formData);
    return this.http.get(ApiPath.ApiMemberLogsWallet, { params });
  }

  walletTypeGroup(formData: {
    startTime?: string,
    endTime?: string,
    type?,
    platformId?: number,
  } = null) {
    const params = UtilService.getHttpParams(formData);
    return this.http.get(ApiPath.ApiMemberLogsWalletTypegroup, { params });
  }

  transferLog(formData?: any): Observable<any> {
    const params = UtilService.getHttpParams(formData);
    return this.http.get(ApiPath.ApiMemberLogsTransfer, { params });
  }

  betLog(formData): Observable<any> {
    const params = UtilService.getHttpParams(formData);
    return this.http.get(ApiPath.ApiMemberLogsBet, { params });
  }

  perDaySumBetLog(formData: { startTime?: string, endTime?: string, platformId: [number], page?: number }): Observable<any> {

    const params = UtilService.getHttpParams(formData);
    return this.http.get(ApiPath.ApiMemberLogsBetSum, { params });

  }

  bonusLog(formData: { startTime?: string, endTime?: string, platformId: [number], page?: number }): Observable<any> {

    const params = UtilService.getHttpParams(formData);
    return this.http.get(ApiPath.ApiMemberLogsBonus, { params });

  }

  activityWalletLog(formData: { receiveSwitch?: string }): Observable<any> {

    const params = UtilService.getHttpParams(formData);
    return this.http.get(ApiPath.ApiAactivityAactivityWalletLog, { params });

  }
}
