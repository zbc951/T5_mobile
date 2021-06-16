import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiPath } from '../constant/api';
import { CUI } from '@cui/core';


export enum DepositReviewStatus {
  Pending = 'pending',
  Review = 'review',
}

export interface IDepositLastBankReview {
  id: number;             // number 存款單編號 review_member_deposit_bank.id
  money: number;          // number 存款金額
  payeeName: string;      // string 收款人戶名
  payeeAccount: string;   // string 收款銀行帳號
  payeeBankName: string;  // string 收款銀行名稱
  payeeBranchName: string; // string 收款分行名稱
  remarkTransactionId: string; // string 存款帳號
  remarkTransactionAt: string; // string 存款時間
  status: DepositReviewStatus;    // string 審核狀態
}

export interface IDepositPayment {
  value: string;  // 平台商戶 id (Payment.value) 用來提交申請
  id: string; // 第三方支付 id (Payment.paymentId) 用來查詢支付方式
  name: string;   // 支付名稱
  type: string;   // 可用商方類型 (用來查詢支付方式)
  typeName: string;
  paymentType: string;
  amounts?: number[];
  maxAmount: number;
  minAmount: number;
  randAmount: boolean;
}

export interface IDepositPaymentParams {
  key: string;
  name: string;
  required: boolean;
  options: {
    value: string;
    name: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  constructor(
    private http: HttpClient
  ) { }

  payments() {
    return this.http.get<any>(ApiPath.ApiMemberDepositThirdPayments);
  }

  lastBankDeposit() {
    return this.http.get<IDepositLastBankReview>(ApiPath.ApiMemberDepositBankLast);
  }

  lastOrAddDeposit() {
    return this.http.post<IDepositLastBankReview>(ApiPath.ApiMemberDepositBankLastOrAdd, null);
  }

  add() {
    return this.http.post(ApiPath.ApiMemberDepositBankAdd, null);
  }

  commit(
    data: { id: number, money, transactionAt, transactionId }
  ) {

    return this.http.post(ApiPath.ApiMemberDepositBankCommit, data);

  }

  thirdDeposit(
    data: { paymentId: string, amount: number, bankCode?: string },
  ) {

    // 模擬form submit
    CUI.submit({
      url: ApiPath.ApiMemberDepositThirdAdd,
      method: 'post',
      params: data,
      target: '_brank',
    });

  }


}
