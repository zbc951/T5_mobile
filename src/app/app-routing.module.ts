import { OldQuestCenterComponent } from './old-quest-center/old-quest-center.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './app-service/auth.guard';
import { HomeComponent } from './home/home.component';
import { AppRoutes } from './constant/routes';

import { LetterComponent } from './letter/letter.component';
import { LetterDetailComponent } from './letter-detail/letter-detail.component';
import { SlotCenterComponent } from './slot-center/slot-center.component';
import { PopupTransferComponent } from './popup-transfer/popup-transfer.component';
import { VipComponent } from './vip/vip.component';
import { QuestCenterComponent } from './quest-center/quest-center.component';
import { QuestDetailComponent } from './quest-detail/quest-detail.component';
import { PopupRegisterComponent } from './popup-register/popup-register.component';
import { PopupLoginComponent } from './popup-login/popup-login.component';
import { ReviewMainComponent } from './review-main/review-main.component';
import { PopupBulletinComponent } from './popup-bulletin/popup-bulletin.component';
import { HelpComponent } from './help/help.component';
import { MemberCenterComponent } from './member-center/member-center.component';
import { VipDetailComponent } from './vip-detail/vip-detail.component';
import { BankCardComponent } from './bank-card/bank-card.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { TransferComponent } from './transfer/transfer.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { UserInfoPlatformComponent } from './user-info-platform/user-info-platform.component';
import { BetLogComponent } from './bet-log/bet-log.component';
import { PopupEditPwdComponent } from './popup-edit-pwd/popup-edit-pwd.component';
import { PopupForgetPasswordComponent } from './popup-forget-password/popup-forget-password.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { PopupTermsComponent } from './popup-terms/popup-terms.component';
import { DownloadAppComponent } from './download-app/download-app.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { CustomerComponent } from './customer/customer.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: AppRoutes.HOME,
    pathMatch: 'full',
  },
  {
    path: AppRoutes.HOME,
    component: HomeComponent,
  },
  {
    path: AppRoutes.HELP,
    component: HelpComponent,
  },
  {
    path: AppRoutes.HELP_ABOUT,
    component: HelpComponent,
  },
  {
    path: AppRoutes.HELP_PORBLEM,
    component: HelpComponent,
  },
  {
    path: AppRoutes.HELP_CENTER,
    component: HelpCenterComponent,
  },
  // {
  //   path: AppRoutes.SPORT,
  //   component: GameComponent,
  // },
  // {
  //   path: AppRoutes.LIVE,
  //   component: GameComponent,
  // },
  // {
  //   path: AppRoutes.SLOT,
  //   component: SportComponent
  // },
  // {
  //   path: AppRoutes.LOTTO,
  //   component: GameComponent,
  // },
  // {
  //   path: AppRoutes.FISH,
  //   component: GameComponent,
  // },
  // {
  //   path: AppRoutes.BOARD,
  //   component: GameComponent,
  // },
  {
    path: AppRoutes.SlotCenter,
    component: SlotCenterComponent,
  },
  {
    path: AppRoutes.LOGIN,
    component: PopupLoginComponent,
    outlet: 'popup',
  },
  {
    path: AppRoutes.REGISTER,
    component: PopupRegisterComponent,
    outlet: 'popup',
  },
  {
    path: AppRoutes.TRANSPOPUP,
    component: PopupTransferComponent,
    outlet: 'popup',
  },
  {
    path: AppRoutes.FORGET,
    component: PopupForgetPasswordComponent,
    outlet: 'popup',
  },
  {
    path: AppRoutes.BULLETIN,
    component: PopupBulletinComponent,
    outlet: 'popup',
  },
  {
    path: AppRoutes.EDITPWD,
    component: PopupEditPwdComponent,
    outlet: 'popup',
  },
  {
    path: AppRoutes.TERMS,
    component: PopupTermsComponent,
    outlet: 'popup',
  },
  // {
  //   path: AppRoutes.EMAIL,
  //   component: EmailComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: `${AppRoutes.EMAIL_DETAILS}/:id`,
  //   component: EmailDetailsComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: AppRoutes.MEMBER_CENTER,
    component: MemberCenterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.DEPOSIT,
    component: DepositComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.WITHDRAWAL,
    component: WithdrawComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.BANK_CARD,
    component: BankCardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.TRANSFER,
    component: TransferComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.USER_INFO,
    component: UserInfoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.MY_WALLET,
    component: MyWalletComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: AppRoutes.TRADE_RECORD,
  //   component: TradeRecordComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: AppRoutes.VIP,
    component: VipComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: AppRoutes.REVIEW_MAIN,
  //   component: MemberComponent,
  //   // canActivate: [AuthGuard]
  // },
  {
    path: AppRoutes.VIP_DETAIL,
    component: VipDetailComponent,
  },
  {
    path: AppRoutes.REVIEW_MAIN,
    component: ReviewMainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.Activity_Wallet,
    component: QuestCenterComponent,
  },
  {
    path: AppRoutes.QUEST,
    component: QuestCenterComponent,
  },
  {
    path: AppRoutes.OLD_QUEST_CENTER,
    component: OldQuestCenterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.QUEST_DETAIL,
    component: QuestDetailComponent,
  },
  // {
  //   path: AppRoutes.QUEST,
  //   component: OfferApplyComponent,
  //   canActivate: [AuthGuard],
  //   canDeactivate: [CanDeactivateGuard]
  // },
  // {
  //   path: AppRoutes.PUBLIC_QUEST,
  //   component: PreferentialComponent
  // },
  // {
  //   path: AppRoutes.PUBLIC_QUEST_DETAILS,
  //   component: PopupPreferentialDetailsComponent,
  //   outlet: 'popup'
  // },
  // {
  //   path: AppRoutes.SERVICE,
  //   component: CommonProblemComponent,
  // },
  // {
  //   path: AppRoutes.ABOUT,
  //   component: AboutComponent,
  // },
  // {
  //   path: AppRoutes.CONTACT,
  //   component: PopupContactComponent,
  //   outlet: 'popup'
  // },
  // {
  //   path: AppRoutes.POLICY,
  //   component: PolicyComponent,
  //   outlet: 'popup'
  // }
  {
    path: AppRoutes.JOIN_US,
    component: JoinUsComponent,
  },
  {
    path: AppRoutes.LETTER,
    component: LetterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: AppRoutes.LETTER_DETAIL,
    component: LetterDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: AppRoutes.BET_LOG,
    component: BetLogComponent,
    canActivate: [AuthGuard]
  },
  {
    path: AppRoutes.USER_INFO_PLATFORM,
    component: UserInfoPlatformComponent,
  },
  // {
  //   path: AppRoutes.DOWNLOAD_APP,
  //   component: DownloadAppComponent,
  // },
  {
    path: AppRoutes.CUSTOMER,
    component: CustomerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    // enableTracing: true
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
