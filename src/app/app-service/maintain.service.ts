import { GameService } from './game.service';
import { SocketService } from './socket.service';
import { EventService } from './event.service';

import { PublicService } from './public.service';
import { DayjsService, timeFormat } from './dayjs.service';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from './lang.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MaintainService {

  week = {
    "sunday": "日",
    "monday": "一",
    "tuesday": "二",
    "wednesday": "三",
    "thursday": "四",
    "friday": "五",
    "saturday": "六"
  };

  platforms = [];
  games = [];

  waitToMaintainMap = {};
  waitToCancelMaintainMap = {};

  constructor(
    private publicService: PublicService,
    private langService: LangService,
    private translateService: TranslateService,
    private socketService: SocketService,
    private gameService: GameService
  ) {

    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {
          this.week =
            this.langService.translations.MAINTAIN.week;

          // console.log('this.langService.onloadSub');
        }

      });

    this.publicService.getPlatforms()
      .subscribe((res: any) => {

        // console.log('### res', res);

        const platforms = res.platforms;

        // console.log('platforms', platforms);
        // 當 res:[]
        if (!platforms) {
          return;
        }

        platforms.forEach((p) => {

          // console.log('p', p);


          p.games.forEach((g) => {

            // console.log()

            if (g.maintain) {

              // const keepKeys = ['id', 'maintain', 'platformId', 'type']
              const keepKeys = ['id', 'maintain', 'platformId'];

              const ga = Object.keys(g)
                .filter(key => keepKeys.includes(key))
                .reduce((obj, key) => {
                  obj[key] = g[key];
                  return obj;
                }, {});

              this.games.push(ga);
            }
          });


          if (p.maintain || (p.maintainCrontab && p.maintainMinute)) {


            const keepKeys = ['id', 'key', 'maintain', 'maintainCrontab', 'maintainMinute']

            const pl: any = Object.keys(p)
              .filter(key => keepKeys.includes(key))
              .reduce((obj, key) => {
                obj[key] = p[key];
                return obj;
              }, {});

            // console.log('filtered', filtered);

            pl.isRoutineMaintainIng = false;

            this.platforms.push(pl);

          }

        });

        // console.log('platforms', this.platforms);
        // console.log('games', this.games);

        this.parsePlatform();


      });



    this.socketService.getMaintain()
      .subscribe((res: any) => {

        // console.log('*****res', res);

        if (res.gameId) {

          // game
          // console.log('games', this.games);
          const ga = this.games.find((g) => {

            return g.id == res.gameId;

          });

          // console.log('ga', ga);

          if (ga) {

            ga.maintain = (res.maintain == 0) ? false : true;
            this.dispatchGame(ga);

          } else {

            const tmp = {
              id: res.gameId,
              platformId: res.platformId,
              maintain: (res.maintain == 0) ? false : true
            }

            this.games.push(tmp);
            this.dispatchGame(tmp);

          }

        } else {

          // platform

          const pl = this.platforms.find((p) => {

            return p.id == res.platformId;

          });

          console.log('pl', pl);

          if (pl) {

            pl.maintain = (res.maintain == 0) ? false : true;
            this.dispatch(pl);

          } else {

            const platforms = this.publicService.platforms?.platforms;

            // console.log('platforms', platforms);

            let pla = platforms.find((plat) => {

              return plat.id == res.platformId;

            });

            if (pla) {

              pla = this.flattenObj(pla);

              pla.maintain = res.maintain == 0 ? false : true;

              this.platforms.push(pla);
              this.dispatch(pla);
            }


          }
        }
      });


  }


  flattenObj(platform) {
    const keepKeys = ['id', 'key', 'maintain', 'maintainCrontab', 'maintainMinute']

    const pl: any = Object.keys(platform)
      .filter(key => keepKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = platform[key];
        return obj;
      }, {});

    return pl;
  }


  parsePlatform() {

    // for 統一管理
    // 可能 onload, 或任何更新會用的

    this.platforms.forEach((p) => {

      // !(maintainCrontab&&maintainMinute) 一開始就排除掉了
      // const r = this.isMaintaining(p.maintainCrontab, p.maintainMinute);

      this.checkIsRoutineMaintainIng(p);


    });

  }

  // for 一次性抓取狀態, 例如 header overlay
  // 但有 check 也要去重新 parse 來更新檢查狀態 是否為該日,如果 有跨日的話
  // 靠 check 去確認; 不使用 interval
  /**
   * 會判別 game/platform
   * @param game or platform
   * @returns
   */
  check(data) {
    // console.log('check', data);

    if (this.platforms.length == 0) {
      return;
    }

    if (data.hasOwnProperty('platformId')) {

      // game

      const pl = this.platforms.find((p) => {

        return p.id == data.platformId;

      });

      if (pl) {
        this.checkIsRoutineMaintainIng(pl);
      }


    } else {

      // platform
      // 如果 這裡資料還沒拿到, 而沒有 platforms

      // console.log(this.platforms);

      const pl = this.platforms.find((p) => {
        return p.id == data.id;
      });

      // console.log('pl', pl);

      if (pl) {
        this.checkIsRoutineMaintainIng(pl);

      }

    }

  }

  checkByPlatformId(id) {

    // console.log("checkByPlatformId", id);

    const pl = this.platforms.find((p) => {
      return p.id == id;
    });

    // console.log('pl', pl);

    if (pl) {

      if (pl.maintain) {

        return true;

      }

      return this.checkIsRoutineMaintainIng(pl);
    }
  }

  // Routine maintain 確實只有 platform 有
  checkIsRoutineMaintainIng(platform) {

    // console.log('@@　platform', platform);

    const cron = platform.maintainCrontab.split(' ');
    const now = new Date();

    if (now.getDay() == Number(cron[4])) {
      // 假設是同一天 要做的判斷

      const start = DayjsService.getDayjsObj(now).hour(cron[1]).minute(cron[0]).second(0);

      // console.log('start', start, start.format("YYYY-MM-DD hh:mm"));
      const end = start.add(platform.maintainMinute, 'm')

      // console.log('end', end, end.format("YYYY-MM-DD hh:mm"));

      const nowObj = DayjsService.getDayjsObj(now);

      const boo = nowObj.isBefore(end) && nowObj.isAfter(start) ? true : false;
      // console.log('boo', boo);

      platform.isRoutineMaintainIng = boo;

      let timeDiff;

      if (boo) {

        if (this.waitToCancelMaintainMap[platform.id]) {
          clearTimeout(this.waitToCancelMaintainMap[platform.id]);
          delete this.waitToCancelMaintainMap[platform.id];
        }

        platform = this.getRoutineMsg(platform);
        timeDiff = (end - nowObj);

        const timeoutId = setTimeout(() => {
          // 時間到
          platform.isRoutineMaintainIng = false;
          this.dispatch(platform);

        }, timeDiff);

        this.waitToCancelMaintainMap[platform.id] = timeoutId;

        // console.log('timeDiff', timeDiff / 1000);
      } else {

        // 如果是同一天, 時間還沒到

        if (nowObj.isBefore(start)) {

          // console.log('waitToMaintainMap', this.waitToMaintainMap);

          if (this.waitToMaintainMap[platform.id]) {

            clearTimeout(this.waitToMaintainMap[platform.id]);
            delete this.waitToMaintainMap[platform.id];
          }


          const tdiff = (start - nowObj)
          // console.log('tdiff', tdiff);

          const timeoutId = setTimeout(() => {

            // console.log('!!! timeout maintin');

            platform.isRoutineMaintainIng = true;
            platform = this.getRoutineMsg(platform);

            this.dispatch(platform);

          }, tdiff);

          this.waitToMaintainMap[platform.id] = timeoutId;

          const thenCancelTimeoutID = setTimeout(() => {

            platform.isRoutineMaintainIng = false;
            this.dispatch(platform);

          }, tdiff + platform.maintainMinute * 60 * 1000);


          this.waitToCancelMaintainMap[platform.id] = thenCancelTimeoutID;

          // console.log("platform", platform.id);
          // console.log("timeoutId", timeoutId);

        }


      }

      this.dispatch(platform);

      return boo;
    } else {
      this.dispatch(platform);
      return platform.maintain;
    }

  }

  dispatch(platform) {

    // console.log('dispatch', platform);

    EventService.dispatch(EventService.MAINTAIN_UPDATE, {
      'platform': platform
    });
  }

  dispatchGame(game) {

    // console.log('dispatch', platform);
    this.gameService.setGameMaintain(game);
    EventService.dispatch(EventService.MAINTAIN_UPDATE, {
      'game': game
    });
  }

  updateBySocket(platformOrGame) {

  }

  getRoutineMsg(platform) {
    const cron = platform.maintainCrontab.split(' ');
    let day = '';
    switch (cron[4]) {
      case '0':
        day = this.week.sunday;
        break;
      case '1':
        day = this.week.monday;
        break;
      case '2':
        day = this.week.tuesday;
        break;
      case '3':
        day = this.week.wednesday;
        break;
      case '4':
        day = this.week.thursday;
        break;
      case '5':
        day = this.week.friday;
        break;
      case '6':
        day = this.week.saturday;
        break;
    }

    const data = {
      day,
      min: platform.maintainMinute,
      time: cron[1] + ':' + cron[0],
    };

    platform.routineMsg = data;
    return platform;

  }

}
