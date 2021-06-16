import { PublicService } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { LangService } from './../app-service/lang.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AppRoutes } from '../constant/routes';

@Component({
  selector: 'app-popup-login',
  templateUrl: './popup-login.component.html',
  // styleUrls: ['./popup-login.component.scss']
})
export class PopupLoginComponent implements OnInit {
  form = new FormGroup({
    account: new FormControl(''),
    password: new FormControl(''),
  });

  translations;
  placeholder = {
    account: '',
    password: '',
  };

  isPassword = true;
  inputType = 'password';

  constructor(
    private router: Router,
    private langService: LangService,
    private translate: TranslateService,
    private publicService: PublicService
  ) {

    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {
          this.setTxt(this.translate.translations);
        }

      });


  }

  ngOnInit(): void { }

  setTxt(translations: any): void {
    this.translations = translations;
    this.placeholder = {
      account: this.langService.translations.LOGIN.ID,
      password: this.langService.translations.LOGIN.PWD,
    };
  }

  close(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
  }

  passwordChange(type: boolean): void {
    this.isPassword = type;
    if (this.isPassword) {
      this.inputType = 'password';
    } else {
      this.inputType = 'text';
    }
  }

  login(): void {
    console.log('login');

    const accountCtrl = this.form.get('account');

    if (accountCtrl.value) {
      accountCtrl.patchValue(accountCtrl.value.trim());
    }

    const pwdCtrl = this.form.get('password');

    if (pwdCtrl.value) {
      pwdCtrl.patchValue(pwdCtrl.value.trim());
    }

    // console.log(this.form.value, this.form.valid);

    this.publicService.login(this.form.value);
    this.form.reset();
  }

  register(): void {
    this.router.navigate([{ outlets: { popup: AppRoutes.REGISTER } }]);
  }

  openforget(): void {
    this.router.navigate([{ outlets: { popup: AppRoutes.FORGET } }]);
  }
}
