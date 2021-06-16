import { MemberService } from './../app-service/member.service';
import { ToastService, ToastType } from './../app-service/toast.service';
import { Component, OnInit } from '@angular/core';
enum AlertMessageType {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}
interface IAlertMessage {
  message: string;
  delay: number;
  type: AlertMessageType;
}
interface ICustomAlertMessage extends IAlertMessage {
  timer: number;
}
@Component({
  selector: 'app-common-alert',
  templateUrl: './common-alert.component.html',
  // styleUrls: ['./common-alert.component.scss']
})
export class CommonAlertComponent implements OnInit {

  ToastType = ToastType;

  // alertMessages: ICustomAlertMessage[] = [];
  alertMessages = [];
  stage;

  percentMinPrice = 0;
  actPrice = 0;

  constructor(
    private toastService: ToastService,
    private memberService: MemberService
  ) {

    this.toastService.getMsgs()
      .subscribe((res) => {
        this.alertMessages = res.splice(0);
        // console.log('getMsgs', this.alertMessages);

        const msgNow = this.alertMessages[0];

        if (msgNow) {

          if (msgNow.type === ToastType.QuestCondition) {
            this.stage = this.memberService.tmpStageDetail;
            // console.log('stage', this.stage);
          }

          if (msgNow.type === ToastType.Activity_buy) {
            this.actPrice = this.percentMinPrice = Number(msgNow.percentMinPrice);
          }


        }

      });
  }

  ngOnInit(): void {
  }

  removeAlert(item): void {
    if (item.callback) {
      if (item.type === ToastType.Activity_buy) {

        item.callback(this.actPrice);
        this.actPrice = 0;

      } else {

        item.callback();

      }
    }

    this.alertMessages = this.alertMessages.filter(am => am !== item);
  }

  cancel(item): void {
    item.callback = null;
    this.removeAlert(item);
  }
}
