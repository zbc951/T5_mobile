import { Component, OnInit } from '@angular/core';
import { SelectAlertService, SelectType } from './../app-service/select-alert.service';

@Component({
  selector: 'app-select-alert',
  templateUrl: './select-alert.component.html',
  // styleUrls: ['./select-alert.component.scss']
})
export class SelectAlertComponent implements OnInit {
  constructor(
    public selectAlertService: SelectAlertService
  ) {
  }

  ngOnInit(): void {
  }

  choose(i) {
    let cur = {
      index: i,
      item: this.selectAlertService.selects.data[i]
    };
    this.selectAlertService.cur = cur;
    // console.log(this.selects[0]);
    // this.cancel();
    this.removeAlert();
  }

  ngOnDestroy() {
  }

  removeAlert(): void {
    if (this.selectAlertService.selects.callback) {
      this.selectAlertService.selects.callback();
    }

    this.selectAlertService.isOpen = false;
  }

  cancel(): void {
    this.selectAlertService.selects.callback = null;
    this.removeAlert();
  }
}
