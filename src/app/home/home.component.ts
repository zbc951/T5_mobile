import { MaintainService } from './../app-service/maintain.service';
import { combineLatest } from 'rxjs';
import { LangService } from './../app-service/lang.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../constant/routes';
import { PublicService, GameTypeKey } from './../app-service/public.service';
import { AuthService } from './../app-service/auth.service';
import { GameService } from './../app-service/game.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  // styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  curType = GameTypeKey.Sport;
  GameTypeKey = GameTypeKey;
  // types = [];
  // showItems = [];
  platforms = [];

  constructor(
    private router: Router,
    private publicService: PublicService,
    private auth: AuthService,
    private gameService: GameService,
    private langService: LangService,
    private maintainService: MaintainService

  ) { }

  ngOnInit(): void {

    combineLatest([
      this.langService.onloadSub,
      // this.publicService.getTypeMenu(),
      this.publicService.getPlatforms()
    ])
      .subscribe((res: any[]) => {

        if (res[0] === true && res[1].platforms) {

          const HEADER_NAV = this.langService.translations.HEADER_NAV;

          res[1].platforms.forEach((p) => {
            const tmpkey = String(p.key).toLowerCase();
            // p.newimg = `assets/img/new/platform/${tmpkey}.png`;
          });

          this.platforms = res[1].platforms;

        }
      });

  }

  click(item): void {

    // console.log('click', item);

    if (item.maintain) {
      return;
    }

    const tmpGame = (item.games) ? item.games[0] : null;

    if (tmpGame && [
      GameTypeKey.Sport,
      GameTypeKey.Live,
      GameTypeKey.Lottery
    ].includes(tmpGame.type)) {

      this.gameService.clickGame(item, tmpGame.type);
      return;
    }


    this.gameService.slotPlatform = item;
    this.router.navigateByUrl(AppRoutes.SlotCenter);

  }

}
