import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../app-service/header.service';
import config from 'src/config';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  csServices = config.csServices;

  public headerTitle: string = 'CUSTOMER.TITLE'

  public serviceType: any[] = [
    {
      imgUrl: 'assets/img/customer/line.svg',
      title: 'CUSTOMER.LINE_TITLE',
      type: 'line',
      data: this.csServices.line,
    },
    {
      imgUrl: 'assets/img/customer/zalo.svg',
      title: 'CUSTOMER.ZALO_TITLE',
      type: 'zalo',
      data: this.csServices.zalo,
    },
    {
      imgUrl: 'assets/img/customer/wechat.svg',
      title: 'CUSTOMER.WECHAT_TITLE',
      type: 'wechat',
      data: this.csServices.wechat,
    },
  ]

  constructor(private headerService: HeaderService) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.headerService.setTitle(this.headerTitle)
    }, 100)
  }
}
