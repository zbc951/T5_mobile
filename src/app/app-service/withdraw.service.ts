import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiPath } from '../constant/api';

export interface IWithdrawLast {
  id: number;                     // number 存款單編號 review_member_withdraw.id
  money: number;                  // number 提款額度
  payeeName: string;              // string 收款人戶名
  payeeAccount: string;           // string 收款銀行帳號
  payeeBankName: string;          // string 收款銀行名稱
  payeeBranchName: string;        // string 收款分行名稱
}

@Injectable({
  providedIn: 'root'
})
export class WithdrawService {

  constructor(
    private http: HttpClient

  ) { }

  lastWithdraw() {
    return this.http.get<IWithdrawLast | null>(ApiPath.ApiMemberWithdrawLast);
  }

  withdraw(formdata: { money: number, password: string, memberBankId: number }) {
    return this.http.post(ApiPath.ApiMemberWithdrawCommit, formdata);
  }
}
