import { LangService } from './../app-service/lang.service';
import { AppRoutes } from './../constant/routes';
import { PublicService } from './../app-service/public.service';
import { ToastService } from './../app-service/toast.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-popup-forget-password',
  templateUrl: './popup-forget-password.component.html',
  // styleUrls: ['./popup-forget-password.component.scss']
})
export class PopupForgetPasswordComponent implements OnInit {

  forgetStep2 = false;
  leftTime = 0;
  lefttimeIntervalId;

  form1: FormGroup;
  form2: FormGroup;
  pwdvalidErrors = {
    newPassword: '',
    confirmPassword: '',
  };


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private publicService: PublicService,
    private toast: ToastService,
    private langService: LangService
  ) {


    this.form1 = this.fb.group(
      {
        phone: ''
      }
    );


    this.form2 = this.fb.group(
      {
        phone: '',
        captcha: '',
        password: '',
        confirmPassword: ''
      }
    );

  }

  ngOnInit(): void {


    const leftTime = this.publicService.forgetPwdLefttime;

    if (leftTime) {

      this.leftTime = leftTime;

    }


    if (this.leftTime > 0) {

      this.forgetStep2 = true;
      this.form1.controls.phone.patchValue(this.publicService.forgetPwdPhone);
      // this.resetPwdObj.phone = localStorage.getItem(lskeyPhone);
      this.countResetTime();

    } else {

      this.forgetStep2 = false;
    }


  }

  countResetTime(): void {
    clearInterval(this.lefttimeIntervalId);

    this.lefttimeIntervalId = setInterval(() => {

      if (this.leftTime > 0) {

        this.leftTime--;

      } else {

        clearInterval(this.lefttimeIntervalId);

        this.publicService.forgetPwdLefttime = null;
        this.publicService.forgetPwdPhone = null;

        // localStorage.removeItem(lskey);
        // localStorage.removeItem(lskeyPhone);
      }

    }, 1000);
  }

  resetPwd_step1(): void {

    this.publicService
      .resetPwd_step1(this.form1.value)
      .subscribe((res: any) => {

        if (res.data) {

          this.leftTime = res.data.lifetime;
          // localStorage.setItem(lskey, JSON.stringify(this.leftTime));
          this.publicService.forgetPwdLefttime = this.leftTime;
          this.forgetStep2 = true;
          this.countResetTime();
        }

      },
        (err) => {

          if (err.error.message) {
            this.toast.error(err.error.message);
          }
        }
      );
  }

  resetPwd_step2(): void {

    const value = this.form2.value;

    if (value.password !== value.confirmPassword) {
      // this.toast.error(this.resetPwd_confirm_txt);
      this.toast.error(this.langService.translations.MEMBER_INFO.CONFIRM_PWD_FAIL);
      return;
    }

    this.publicService.resetPwd_step2(
      this.form2.value)
      .subscribe((res: any) => {

        if (res.data.result == true) {

          this.toast.success('success');

          this.forgetStep2 = false;
          this.leftTime = 0;

          this.form2.reset();
          this.close();

        }
      },
        (err) => {


          console.log('err', err);

          this.toast.error(err.error.message);

          if (err.error.errors) {

            Object.assign(this.pwdvalidErrors, err.error.errors);
            console.log(this.pwdvalidErrors);

          } else {
            this.toast.error(err.error.message);
          }

        }
      );
  }


  close(): void {

    if (this.forgetStep2 && this.leftTime > 0) {

      // localStorage.setItem(lskeyPhone, this.resetPwdObj.phone);
      this.publicService.forgetPwdPhone = this.form1.controls.phone.value;
    }


    // this.router.navigate([{ outlets: { popup: null } }]);
    this.router.navigate([{ outlets: { popup: AppRoutes.LOGIN } }]);
  }
}
