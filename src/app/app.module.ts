import { UserInfoSetPhoneComponent } from './user-info-set-phone/user-info-set-phone.component';
import { WithdrawBetRecordComponent } from './withdraw-bet-record/withdraw-bet-record.component';
import { DrawbackComponent } from './drawback/drawback.component';

import { LangService } from './app-service/lang.service';
import { CommonAlertComponent } from './common-alert/common-alert.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { MemberBoardComponent } from './member-board/member-board.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AdComponent } from './ad/ad.component';
import { LetterComponent } from './letter/letter.component';
import { PaginationBoxComponent } from './pagination-box/pagination-box.component';
import { LetterDetailComponent } from './letter-detail/letter-detail.component';
import { SlotCenterComponent } from './slot-center/slot-center.component';
import { PopupTransferComponent } from './popup-transfer/popup-transfer.component';
import { VipComponent } from './vip/vip.component';
import { QuestCenterComponent } from './quest-center/quest-center.component';
import { QuestDetailComponent } from './quest-detail/quest-detail.component';
import { PopupRegisterComponent } from './popup-register/popup-register.component';
import { PopupLoginComponent } from './popup-login/popup-login.component';
import { ReviewMainComponent } from './review-main/review-main.component';
import { ReviewComponent } from './review/review.component';
import { ReviewBonusComponent } from './review-bonus/review-bonus.component';
import { PopupBulletinComponent } from './popup-bulletin/popup-bulletin.component';
import { HelpComponent } from './help/help.component';
import { MemberCenterComponent } from './member-center/member-center.component';
import { VipDetailComponent } from './vip-detail/vip-detail.component';
import { BankCardComponent } from './bank-card/bank-card.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { CouponWalletComponent } from './coupon-wallet/coupon-wallet.component';
import { PlatformWalletComponent } from './platform-wallet/platform-wallet.component';
import { TransferComponent } from './transfer/transfer.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  NoopAnimationsModule,
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import { DecimalPipe } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { UserInfoPlatformComponent } from './user-info-platform/user-info-platform.component';
import { BetLogComponent } from './bet-log/bet-log.component';
import { SelectAlertComponent } from './select-alert/select-alert.component';

import { BulletinPipe } from './bulletin.pipe';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { PopupEditPwdComponent } from './popup-edit-pwd/popup-edit-pwd.component';
import { ListDirective } from './list.directive';
import { PopupForgetPasswordComponent } from './popup-forget-password/popup-forget-password.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { PopupTermsComponent } from './popup-terms/popup-terms.component';
import { DownloadAppComponent } from './download-app/download-app.component';
import { ResponseHandleHttpInterceptor } from './app-service/response-handle-http-interceptor';
import { GametagsPipe } from './gametags.pipe';
import { SearchGamePipe } from './search-game.pipe';
import { FloatDisplayPipe } from './float-display.pipe';
import { ReviewTransferComponent } from './review-transfer/review-transfer.component';
import { OldQuestCenterComponent } from './old-quest-center/old-quest-center.component';
import { CombineQuestApplyComponent } from './combine-quest-apply/combine-quest-apply.component';
import { QuestRecordComponent } from './quest-record/quest-record.component';
import { AmountRecordComponent } from './amount-record/amount-record.component';

import { QuestPipe } from './quest.pipe';
import { ThrottleBtnDirective } from './throttle-btn.directive';
import { SafeHtmlPipe } from './safe-html.pipe';
import { LoadingComponent } from './loading/loading.component';

import { ActivityLogComponent } from './activity-log/activity-log.component';
import { NumberOnlyDirective } from './number-only.directive';
import { MaintainTipComponent } from './maintain-tip/maintain-tip.component';
import { QrCodeModule } from 'ng-qrcode';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownComponent } from './markdown/markdown.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { CustomerComponent } from './customer/customer.component';
// tslint:disable-next-line: typedef
export function createTranslateLoader(http: HttpClient) {
  // go with angular.json architect.build.options.assets
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
  // return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export enum Lang {
  cn = 'zh-Hans',
  tw = 'zh-Hant',
  en = 'en',
  jp = 'jp',
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MemberBoardComponent,
    AnnouncementComponent,
    AdComponent,
    LetterComponent,
    PaginationBoxComponent,
    LetterDetailComponent,
    MemberBoardComponent,
    SlotCenterComponent,
    PopupTransferComponent,
    VipComponent,
    QuestCenterComponent,
    QuestDetailComponent,
    PopupRegisterComponent,
    PopupLoginComponent,
    ReviewMainComponent,
    ReviewComponent,
    ReviewBonusComponent,
    PopupBulletinComponent,
    HelpComponent,
    MemberCenterComponent,
    VipDetailComponent,
    BankCardComponent,
    MyWalletComponent,
    CouponWalletComponent,
    PlatformWalletComponent,
    TransferComponent,
    UserInfoComponent,
    DepositComponent,
    CommonAlertComponent,
    WithdrawComponent,
    UserInfoPlatformComponent,
    BetLogComponent,
    SelectAlertComponent,
    DateSelectorComponent,
    BulletinPipe,
    UserInfoPlatformComponent,
    PopupEditPwdComponent,
    ListDirective,
    PopupForgetPasswordComponent,
    JoinUsComponent,
    PopupTermsComponent,
    DownloadAppComponent,
    GametagsPipe,
    SearchGamePipe,
    FloatDisplayPipe,
    ReviewTransferComponent,
    OldQuestCenterComponent,
    CombineQuestApplyComponent,
    QuestRecordComponent,
    QuestPipe,
    AmountRecordComponent,
    DrawbackComponent,
    WithdrawBetRecordComponent,
    ThrottleBtnDirective,
    SafeHtmlPipe,
    LoadingComponent,
    ActivityLogComponent,
    NumberOnlyDirective,
    UserInfoSetPhoneComponent,
    MaintainTipComponent,
    MarkdownComponent,
    HelpCenterComponent,
    CustomerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgxPaginationModule,
    ClipboardModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    QrCodeModule,
    NgbCarouselModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseHandleHttpInterceptor,
      multi: true
    },
    DecimalPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private translate: TranslateService,
    private langService: LangService
  ) {
    this.translate.setDefaultLang(Lang.tw);
    this.translate.use(Lang.tw);
  }
}
