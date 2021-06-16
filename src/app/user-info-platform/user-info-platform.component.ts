import { Component, OnInit } from '@angular/core';
import { AppRoutes } from '../constant/routes';
import { LangService } from './../app-service/lang.service';
import { MemberService } from './../app-service/member.service';

enum status_type {
  notset,
  active,
  notActive
}


@Component({
  selector: 'app-user-info-platform',
  templateUrl: './user-info-platform.component.html',
  // styleUrls: ['./user-info-platform.component.scss']
})
export class UserInfoPlatformComponent implements OnInit {

  AppRoutes = AppRoutes;
  status_type = status_type;
  pdata: any = [];

  constructor(
    private memberService: MemberService,
    private langService: LangService
  ) {

  }

  ngOnInit(): void {
    this.getpData();
  }


  getpData(): void {

    this.memberService.getPlatformInfo()
      .subscribe((res: any) => {

        // console.log('res', res);

        if (res.data) {

          const pdata = res.data;
          const pdata_not_active_txt = this.langService.translations.MEMBER_INFO.notActive;

          pdata.forEach((item) => {

            /**
                * active {
                * lastTime,
                * password,
                * playerId,
                * enabled
                * }
                */

            if (item.active) {

              item.uid = item.active.playerId ? item.active.playerId : pdata_not_active_txt;

              item.uid_active = item.active.playerId ? true : false;

              item.pwd = item.active.password ? item.active.password : pdata_not_active_txt;

              item.pwd_active = item.active.password ? true : false;

              item.status_type = item.active.enabled ? status_type.active : status_type.notActive;

              item.lls = item.active.lastTime ? item.active.lastTime : '-';

            } else {
              item.status_type = status_type.notset;
              item.uid = item.pwd = pdata_not_active_txt;
              item.lls = '-';
            }

          });

          this.pdata = pdata;

        }


      });

  }

}
