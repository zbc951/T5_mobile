import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiPath } from '../constant/api';

export interface IBank {
  id: number;             // number member_bank.id
  name: string;           // string 戶名
  account: string;        // string 帳號
  bankName: string;       // string 銀行名稱
  branchName: string;     // string 分行名稱(網點)
  phone: string;          // string 申請電話
  idCard: string;         // string 證件號
  provinceName: string;   // string 省份名稱
  cityName: string;       // string 城市名稱
  enabled: number;        // number 是否啟用
  updatedAt: string;      // string 修改時間
  createdAt: string;      // string 建立時間
}

export interface IReviewBank {
  id: number;             // number member_bank.id
  name: string;           // string 戶名
  account: string;        // string 帳號
  bankName: string;       // string 銀行名稱
  branchName: string;     // string 分行名稱(網點)
  phone: string;          // string 申請電話
  idCard: string;         // string 證件號
  provinceName: string;   // string 省份名稱
  cityName: string;       // string 城市名稱
  createdAt: string;      // string 建立時間
}

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(
    private http: HttpClient
  ) { }

  banks() {
    return this.http.get<IBank[]>(ApiPath.ApiMemberBankAll);
  }

  add(
    data: {
      bankName: string,
      branchName: string,
      name: string,
      account: string
    }
  ) {

    return this.http.post(ApiPath.ApiMemberBankAdd, data);
  }

  toggleEnabled(data: { id: number, enabled: boolean }) {
    const enabled = data.enabled ? 1 : 0;
    const id = data.id;

    return this.http.post(ApiPath.ApiMemberBankToggleEnabled, { id, enabled });
  }

  lastReview() {
    return this.http.get<IReviewBank>(ApiPath.ApiMemberBankLastReview);
  }

  getBanklist(val) {
    return this.http.get(`${ApiPath.apiMemberBanklist}?name=${val}`);
  }


  getApiIsHaveBank() {
    return this.http.get<any>(ApiPath.ApiMemberDepositBankSettingCheck);
  }

}
