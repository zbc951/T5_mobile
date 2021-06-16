import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-popup-vip-point',
  templateUrl: './popup-vip-point.component.html',
  // styleUrls: ['./popup-vip-point.component.scss']
})
export class PopupVipPointComponent implements OnInit {
  // fake
  data = [
    {
      name: 'BNG老虎機',
      point: 3500000,
      scale: 3.5,
      display: false
    },
    {
      name: 'BNG老虎機',
      point: 3500000,
      scale: 3.5,
      display: false
    },
    {
      name: 'BNG老虎機',
      point: 3500000,
      scale: 3.5,
      display: false
    },
    {
      name: 'BNG老虎機',
      point: 3500000,
      scale: 3.5,
      display: false
    },
  ];
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
  }

  openScale(index){
    this.data[index].display = !this.data[index].display;
  }
}
