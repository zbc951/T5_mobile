import { EventService } from './../app-service/event.service';
import { MaintainService } from './../app-service/maintain.service';
import { Component, Input, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-maintain-tip',
  templateUrl: './maintain-tip.component.html',
  // styleUrls: ['./maintain-tip.component.scss']
})
export class MaintainTipComponent implements OnInit {

  @Input() item: any;
  status: any = {
    maintain: false,
    isRoutineMaintainIng: false
  };

  constructor(
    private maintainService: MaintainService
  ) { }

  ngOnInit(): void {

    this.status.maintain = this.item.maintain;
    // this.debug('item', this.item, 'status', this.status);
    if (!this.item.maintain) {

      this.maintainService.check(this.item);
    }

  }

  @HostListener(`window:${EventService.MAINTAIN_UPDATE}`, ['$event'])
  update(event): void {



    const { data } = event.detail;
    // console.log('MAINTAIN_UPDATE data', data);
    // return;

    if (data && this.item) {

      if (data.platform) {
        // console.log('event', data.platform);

        if (this.item.hasOwnProperty('platformId')) {

          // game

          // game 如果已經在 maintain, 就沒有必要再管 platformt 的更新

          // console.log("***", data.platform.id, this.item.platformId);

          if (data.platform.id == this.item.platformId) {
            // this.debug('game block', data, this.item);
            // 本身 game 是否有臨時維護
            // 沒有, 才檢查所屬平台 是否有臨時衛護
            if (this.item.maintain) {

            } else {
              this.status.maintain = data.platform.maintain;
            }

            this.status.isRoutineMaintainIng = data.platform.isRoutineMaintainIng;
            if (data.platform.routineMsg) {
              this.status.routineMsg = data.platform.routineMsg;
            }

          }


        } else {

          // platform

          // console.log(data.platform.id, this.item);

          if (data.platform.id == this.item.id) {
            // console.log('data', data);

            this.status.maintain = data.platform.maintain;
            this.status.isRoutineMaintainIng = data.platform.isRoutineMaintainIng;
            if (data.platform.routineMsg) {
              this.status.routineMsg = data.platform.routineMsg;
            }

          }

        }

      }

      // game update 只要 game item 管就好
      if (data.game && this.item.platformId) {

        // console.log('111', this.item);

        if (data.game.id == this.item.id) {

          // console.log('111 game', data.game);

          this.status.maintain = this.item.maintain = data.game.maintain;
        }

      }
    }
  }

  // debug(...arg) {

  //   if (this.item.platformId == 1 && this.item.id == 1) {
  //     console.log('debug', ...arg);
  //   }

  // }

}
