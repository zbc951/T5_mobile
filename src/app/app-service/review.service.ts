import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiPath } from '../constant/api';
import { IPaginate } from './letter.service';
import { UtilService } from './util.service';
import { Subject } from 'rxjs';

export enum EnumStatus {
  pending = 'pending',
  review = 'review',
  approved = 'approved',
  disapproved = 'disapproved',
  cancel = 'cancel',
  all = 'all',
}

export enum EnumTranslateStatus {
  pending = '等待送审',
  review = '审核中',
  approved = '审核通过',
  disapproved = '审核不通过',
  cancel = '取消送审',
}


export interface IReviewDeposit {
  id: number;
  status: EnumStatus;
  money: number;
  committedAt: string;
  reason: string;
}


export interface IReviewWithdraw {
  id: number;
  status: EnumStatus;
  money: number;
  committedAt: string;
  transactionAt: string;
  reason: string;
}

export enum EnumBankAction {
  add = 'add',
  edit = 'edit',
  remove = 'remove',
}

export enum EnumTranslateBankAction {
  add = '新增',
  edit = '修改',
  remove = '删除',
}

export interface IReviewBankEdit {
  id: number;
  name: string;
  account: string;
  bankName: string;
  status: EnumStatus;
  action: EnumBankAction;
  reason: string;
  committedAt: string;
}

export interface IReviewInformation {
  id: number;
  name: string;
  nickname: string;
  phone: string;
  email: string;
  status: EnumStatus;
  reason: string;
  committedAt: string;
}


@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  reviewApproved = new Subject();

  constructor(
    private http: HttpClient
  ) { }

  deposit(formData) {
    const params = UtilService.getHttpParams(formData);
    return this.http.get<IPaginate<IReviewDeposit>>(ApiPath.ApiMemberReviewDeposit, { params });
  }

  withdraw(formData) {
    const params = UtilService.getHttpParams(formData);
    return this.http.get<IPaginate<IReviewWithdraw>>(ApiPath.ApiMemberReviewWithdraw, { params });
  }

  activityWallet(formData) {
    const params = UtilService.getHttpParams(formData);
    return this.http.get<IPaginate<IReviewWithdraw>>(ApiPath.ApiMemberReviewActivityWallet, { params });
  }

  bankEdit(formData) {
    const params = UtilService.getHttpParams(formData);
    return this.http.get<IPaginate<IReviewBankEdit>>(ApiPath.ApiMemberReviewBank, { params });
  }

  // information(formData) {
  //   return this.http.get<IPaginate<IReviewInformation>>(ApiPath.ApiMemberReviewInformation, formData);
  // }

  approved(res) {
    this.reviewApproved.next(res);
  }

  getReviewApproved() {
    return this.reviewApproved.asObservable();
  }

}
