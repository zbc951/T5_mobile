import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AppRoutes } from '../constant/routes';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './../app-service/auth.service';
import { MemberService } from './../app-service/member.service';
interface rank {
  autoWater: number;
  autoWaterAt;
  bankLimit: number;
  // clubId;
  createdAt;
  depositDayTimes: number;
  depositPerMax: string;
  depositPerMin: string;
  // enabled;
  // franchiseeId;
  fullpay;
  id: number;
  name: string;
  // order;
  // updatedAt;
  upgradeByDeposit: string;
  upgradeByTotalBetAmount: any;
  upgradeByWithdraw: string;
  withdrawDayTimes: number;
  withdrawFee;
  withdrawFeePeriod: string;
  withdrawFeeType: string;
  withdrawFreeTimes: number;
  withdrawPerMax: string;
  withdrawPerMin: string;
}

@Component({
  selector: 'app-vip',
  templateUrl: './vip.component.html',
  // styleUrls: ['./vip.component.scss']
})
export class VipComponent implements OnInit, AfterViewInit, OnDestroy {

  touchStart = 0;
  touchEnd = 0;
  partners;
  curPage = 0;
  // partnersList;
  partnersWidth;
  partnersImgnum;
  partnersX = 0;
  AppRoutes = AppRoutes;
  @ViewChild('partnersList') partnersList: ElementRef;
  @ViewChild('list') list: ElementRef;
  @ViewChild('lvbox') lvbox: ElementRef;

  rankList = [];
  mine: any | rank;
  mine2: any | {
    total_bet?,
    total_deposit?,
    total_withdraw?
  };

  mineIdx = 0;
  next: any;
  amountPercent = 0;

  $rank;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private memberService: MemberService,
    private auth: AuthService
  ) {

  }

  ngOnInit(): void {
    const user = this.auth.user;
    // console.log('user', user);

    this.$rank = this.memberService
      .listenClubRank()
      .subscribe((res: any) => {

        // console.log('getClubRankList', res);
        this.rankList = res;
        // console.log('rankList', this.rankList);

        const idx = this.rankList.findIndex((item) => {

          return user.clubRankId === item.id;

        });

        this.mineIdx = idx;
        this.mine = this.rankList[idx];


        this.next = (idx !== this.rankList.length - 1) ? this.rankList[idx + 1] : this.next;

        // console.log('mine', this.mine);

        this.memberService.getMemberClubRank()
          .subscribe((res: any) => {

            // console.log('getMemberClubRank', res);
            this.mine2 = res;
            this.amountPercent = (this.mine2.total_bet / this.mine.upgradeByTotalBetAmount) * 100;

            // console.log('amountPercent', this.amountPercent);

            this.levelChange(this.mineIdx);

          });

      });

  }

  ngAfterViewInit(): void {


  }

  touchS(event) {
    this.touchEnd = 0;
    this.touchStart = 0;

    this.touchStart = event.changedTouches[0].screenX;
  }

  touchE(event) {
    this.partnersImgnum = this.rankList.length;
    this.partnersWidth = this.partnersImgnum * this.list.nativeElement.offsetWidth;
    this.touchEnd = event.changedTouches[0].screenX;
    if ((this.touchStart - this.touchEnd) > 0) {
      this.partnerR();
    }
    if ((this.touchStart - this.touchEnd) < 0) {
      this.partnerL();
    }
    if ((this.touchStart - this.touchEnd) == 0) {
      return;
    }
  }

  partnerR(levelChange = false): void {
    if ((this.partnersX >= -this.partnersWidth + (2 * this.list.nativeElement.offsetWidth) || levelChange)) {
      this.curPage++;
      this.partnersX = this.partnersX - this.list.nativeElement.offsetWidth;
      this.partnersList.nativeElement.style.transform = `translate3d( ${this.partnersX}px, 0px, 0px)`;

      this.moveLobx(this.curPage);
    }
  }

  partnerL(): void {
    if (this.partnersX != 0) {
      this.curPage--;
      this.partnersX = this.partnersX + this.list.nativeElement.offsetWidth;
      this.partnersList.nativeElement.style.transform = `translate3d( ${this.partnersX}px, 0px, 0px)`;

      this.moveLobx(this.curPage);
    }
  }

  levelChange(num) {

    this.moveLobx(this.mineIdx);

    let distance = num - this.curPage;
    // console.log('ss', distance, num, this.curPage);
    if (distance > 0) {
      for (let i = 0; i < distance; i++) {
        console.log('rr')
        this.partnerR(true);
      }
    }

    if (distance < 0) {
      for (let i = 0; i < -distance; i++) {
        console.log('ll')
        this.partnerL();
      }
    }

    if (distance === 0) {
      return;
    }

  }

  moveLobx(index) {
    const lb = this.lvbox.nativeElement;
    const li = lb.childNodes[index];


    const center = lb.offsetWidth / 2;

    // if (li.offsetLeft > center) {

    const offset = li.offsetLeft - center;
    // console.log('offset', offset);

    lb.scrollLeft = offset + 20;

    // }
  }

  ngOnDestroy() {
    if (this.$rank) {
      this.$rank.unsubscribe();
    }
  }

}
