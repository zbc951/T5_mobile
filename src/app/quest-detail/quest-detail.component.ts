import { ToastService } from './../app-service/toast.service';
import { AppRoutes } from './../constant/routes';
import { Router } from '@angular/router';
import { WalletService } from './../app-service/wallet.service';
import { Component, OnInit } from '@angular/core';
import { LangService } from './../app-service/lang.service';
import { AuthService } from './../app-service/auth.service';

@Component({
  selector: 'app-quest-detail',
  templateUrl: './quest-detail.component.html',
  // styleUrls: ['./quest-detail.component.scss']
})
export class QuestDetailComponent implements OnInit {

  item;

  constructor(
    private walletService: WalletService,
    private router: Router,
    private toast: ToastService,
    private langService: LangService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.item = this.walletService.tmpActivity;
    // console.log(this.item);

    if (!this.item) {
      this.router.navigateByUrl(AppRoutes.Activity_Wallet);
    }
  }

}
