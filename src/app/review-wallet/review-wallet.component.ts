import { Component, OnInit } from '@angular/core';
import { WalletService } from './../app-service/wallet.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { PublicService } from '../app-service/public.service';
@Component({
  selector: 'app-review-wallet',
  templateUrl: './review-wallet.component.html',
  // styleUrls: ['./review-wallet.component.scss']
})
export class ReviewWalletComponent implements OnInit {

  pageConfig: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };

  form: FormGroup;
  listData: any = [];
  gamePlatforms = [];

  constructor(
    private walletService: WalletService,
    private formBuilder: FormBuilder,
    private publicService: PublicService
  ) {

    this.form = this.formBuilder.group({
      startTime: '',
      endTime: '',
      platformId: 'all'
    });

  }

  ngOnInit(): void {
    this.gamePlatforms = this.publicService.platforms.platforms;
  }

  setTime(evt: any): void {

    this.form.controls.startTime.patchValue(evt.start);
    this.form.controls.endTime.patchValue(evt.end);

  }

  searchReview(onBtm = false): void {

    if (!onBtm) {

      this.listData = [];

      this.pageConfig = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 0
      };
    }

    const formdata = Object.assign({}, this.form.value);

    formdata.page = this.pageConfig.currentPage;
    formdata.platformId = [formdata.platformId];

    // console.log('formdata', formdata);

    this.walletService.getActivityWalletLog(
      formdata
    )
      .subscribe((res) => {

        // console.log('getActivityWalletLog res', res);
        this.listData = this.listData.concat(res.data.content);

        this.pageConfig.totalItems = res.data.total;
        this.pageConfig.itemsPerPage = res.data.perPage;
        this.pageConfig.currentPage = res.data.page;

      });

  }

  onBtm(evt): void {

    // console.log('onBtm');

    if (this.listData.length < this.pageConfig.totalItems) {

      this.pageConfig.currentPage++;
      this.searchReview(true);

    }
  }

}
