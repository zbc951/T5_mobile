import { WalletService } from './../app-service/wallet.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.component.html',
  // styleUrls: ['./download-app.component.scss']
})
export class DownloadAppComponent implements OnInit, OnDestroy {
  public list: any = [];
  $data;

  constructor(private walletService: WalletService) {

  }

  ngOnInit(): void {
    this.$data = this.walletService
      .getMultiPlatforms2()
      .subscribe((res) => {

        console.log('getMultiPlatforms res', res);

        this.list = res.filter((p) => {

          return p.key == "Allbet" || p.key == "WM"

        });

      });
  }

  click(item) {

    switch (item.key) {
      case "Allbet":
        window.open("https://www.abgapp88.net/", '_blank');
        break;
      case "WM":
        window.open("https://m.wm555.net/mobile/index.html?enterprise=2", '_blank');
        break;

    }

  }

  ngOnDestroy(): void {

    this.$data.unsubscribe();

  }
}
