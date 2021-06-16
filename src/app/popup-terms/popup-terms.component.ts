import { PublicService } from './../app-service/public.service';
import { AppRoutes } from './../constant/routes';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-terms',
  templateUrl: './popup-terms.component.html',
  // styleUrls: ['./popup-terms.component.scss']
})
export class PopupTermsComponent implements OnInit {
  constructor(
    private router: Router,
    private publicService: PublicService
  ) { }

  ngOnInit(): void { }

  agree(): void {

    this.publicService.readPolicy = true;
    this.router.navigate([{ outlets: { popup: [AppRoutes.REGISTER] } }]);

  }

  close(): void {
    this.router.navigate([{ outlets: { popup: [AppRoutes.REGISTER] } }]);
  }
}
