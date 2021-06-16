import { LogService } from './../app-service/log.service';
import { PublicService } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LangService } from './../app-service/lang.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-review-bonus',
  templateUrl: './review-bonus.component.html',
  // styleUrls: ['./review-bonus.component.scss']
})
export class ReviewBonusComponent implements OnInit {

  pageConfig: {
    itemsPerPage: number,
    currentPage: number,
    totalItems: number
  } = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0
    };

  form: FormGroup;
  data;
  list = [];
  gamePlatforms = [];

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    // private reviewService: ReviewService,
    private langService: LangService,
    private publicService: PublicService,
    private logService: LogService
  ) {

    this.form = this.formBuilder.group({
      startTime: '',
      endTime: '',
      platformId: 0
    });

  }

  ngOnInit(): void {

    this.gamePlatforms = this.publicService.platforms.platforms;
    console.log('gamePlatforms', this.gamePlatforms);

    const len = this.gamePlatforms.length;
    const idarr = this.gamePlatforms
      .map((item) => {
        return item.id;
      });

    console.log('idarr', idarr);

    this.form.controls.platformId.patchValue(idarr);

  }

  queryBonus(onBtm = false): void {
    console.log('queryBet');

    if (!onBtm) {

      this.list = [];

      this.pageConfig = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 0
      };
    }

    const formdata = Object.assign({}, this.form.value);
    formdata.page = this.pageConfig.currentPage;
    formdata.perPage = this.pageConfig.itemsPerPage;


    this.logService.bonusLog(formdata)
      .subscribe((res: any) => {

        console.log('bonusLog', res);

        // -- test --
        // for (let i = 0; i < 10; i++) {

        //   const tmpcnt = Object.assign({}, {
        //     date: '2020-08-27 01:00:28',
        //     platformName: 'blblbblb',
        //     bonus: 100
        //   });

        //   tmpcnt.bonus = i + 100;

        //   res.data.content.push(tmpcnt);
        // }

        // res.data.total = res.data.content.length;
        // -- end test --


        this.data = res.data;
        this.list = this.list.concat(this.data.content);
        this.pageConfig.totalItems = this.data.total;
        this.pageConfig.itemsPerPage = this.data.perPage;
        this.pageConfig.currentPage = this.data.page;

      });
  }

  setTime(evt): void {

    this.form.controls.startTime.patchValue(evt.start);
    this.form.controls.endTime.patchValue(evt.end);

  }

  onBtm(evt): void {

    if (this.list.length < this.pageConfig.totalItems) {

      this.pageConfig.currentPage++;
      this.queryBonus(true);

    }
  }

}
