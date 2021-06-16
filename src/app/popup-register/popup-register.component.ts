import { UtilService } from './../app-service/util.service';
import { EventService } from './../app-service/event.service';
import { AppRoutes } from './../constant/routes';
import { PublicService } from './../app-service/public.service';
import { ToastService } from './../app-service/toast.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from './../app-service/lang.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

// enum registerStat {
//   form,
//   success
// }
@Component({
  selector: 'app-popup-register',
  templateUrl: './popup-register.component.html',
  // styleUrls: ['./popup-register.component.scss']
})
export class PopupRegisterComponent implements OnInit {

  AppRoutes = AppRoutes;

  accountPattern = new RegExp(/^[0-9a-zA-Z]*[a-zA-Z]+[0-9a-zA-Z]*$/);
  passwordPattern = new RegExp(/^[0-9a-zA-Z\@\.\_\$\#\%\^\&\*\+\-]+$/);

  translations;
  isPassword = true;
  inputType = 'password';
  isPhoneConfirm = false;
  success = false;

  placeholder = {
    account: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    phoneConfirm: '',
    smsCode: '',
    invitationCode: '',
  };

  invalidErrors = {
    code: '',
    account: '',
    password: '',
    checkPassword: '',
    phone: '',
    smsCode: '',
  };

  registerForm: FormGroup;
  isInvit = false;

  accountInvalid;
  passwordInvalid;
  chkPasswordInvalid;
  lengthInvalid;

  // status = registerStat.form;

  // debugcopy;
  // debugmsg = [];
  // debugtxt;

  constructor(
    private router: Router,
    private langService: LangService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private publicService: PublicService
  ) {

    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {
          this.setTxt(this.langService.translations);
        }

      });

    this.registerForm = this.fb.group(
      {
        account: new FormControl('',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
            Validators.pattern(/^[0-9a-zA-Z]*[a-zA-Z]+[0-9a-zA-Z]*$/)
          ]
        ),
        password: new FormControl('',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
            Validators.pattern(/^[0-9a-zA-Z\@\.\_\$\#\%\^\&\*\+\-]+$/)
          ]
        ),
        checkPassword: '',
        phone: '',
        smsCode: '',
        code: '',
        isCheck: '',
        invitation: ''
      }
    );

    this.registerForm.controls.phone
      .valueChanges
      .subscribe((phone) => {

        // console.log('phone', phone);
        if (this.translations) {
          // console.log('this.translations', this.translations);
          this.invalidErrors.phone = (phone.length == 10) ? '' : this.langService.translations.REGISTER.INVALID.PHONE_NUM_LIMIT;
        }


      });

    this.registerForm.controls.account
      .valueChanges
      .subscribe((input) => {


        if (input.length == 0) {
          this.invalidErrors.account = '';
          return;
        }

        if (this.accountPattern.test(input)) {

          this.invalidErrors.account = '';

          if (!(input.length > 5 && input.length < 31)) {

            this.invalidErrors.account = this.lengthInvalid;

          } else {

            this.invalidErrors.account = '';

          }


        } else {

          this.invalidErrors.account = this.accountInvalid;
        }
      });

    this.registerForm.controls.password
      .valueChanges
      .subscribe((input) => {

        // console.log('input', input);


        if (!input) {

          this.invalidErrors.password = '';
          return;
        }

        if (this.passwordPattern.test(input)) {

          this.invalidErrors.password = '';

          if (!(input.length > 5 && input.length < 31)) {

            this.invalidErrors.password = this.lengthInvalid;

          } else {

            this.invalidErrors.password = '';

          }

        } else {
          this.invalidErrors.password = this.passwordInvalid;
        }
      });

    this.registerForm.controls.checkPassword
      .valueChanges
      .subscribe((input) => {

        // console.log('input', input);
        const p = this.registerForm.value.password;
        // console.log('p', p, input);

        if (input == p) {

          this.invalidErrors.checkPassword = '';

        } else {
          this.invalidErrors.checkPassword = this.chkPasswordInvalid;
        }
      });

  }

  ngOnInit(): void {
    this.isInvit = false;
    // console.log('hash', window.location, window.location.search);

    const inviteCodeUrl = localStorage.getItem(AppRoutes.REGISTER) || window.location.search;

    // this.debugmsg.push('inviteCodeUrl:' + inviteCodeUrl);

    // console.log('inviteCodeUrl', inviteCodeUrl);
    const code = UtilService.getParameterByName('code', inviteCodeUrl);

    if (code) {
      this.isInvit = true;
      this.registerForm.controls.code.patchValue(code);
      localStorage.removeItem(AppRoutes.REGISTER);
      // this.debugmsg.push('code:' + code);

    }

    const invitation = UtilService.getParameterByName('invitation', inviteCodeUrl);

    if (invitation) {
      // this.debugmsg.push('invitation:' + invitation);
      this.registerForm.controls.invitation.patchValue(invitation);
    }


    console.log('readPolicy', this.publicService.readPolicy);

    this.registerForm.controls.isCheck.patchValue(this.publicService.readPolicy);

    const tmpRegisterData = localStorage.getItem(AppRoutes.TERMS);

    console.log('tmpRegisterData', tmpRegisterData);

    if (tmpRegisterData) {

      const tmp = JSON.parse(tmpRegisterData);

      for (let k in tmp) {

        if (tmp[k] && k !== 'isCheck ') {

          const ctrl = this.registerForm.get(k);

          if (ctrl) {

            ctrl.patchValue(tmp[k]);

          }
        }

      }


    }

  }

  setTxt(translations: any): void {

    this.translations = translations;

    // console.log('88', this.translations);

    this.accountInvalid = this.translations.REGISTER.INVALID.ACCOUNT;
    this.passwordInvalid = this.translations.REGISTER.INVALID.PASSWORD;
    this.chkPasswordInvalid = this.translations.REGISTER.ERR.CONFIRM;
    this.lengthInvalid = this.translations.REGISTER.INVALID.LENGTH;

    this.placeholder = {
      account: this.langService.translations.REGISTER.ACCOUNT,
      password: this.langService.translations.REGISTER.PWD,
      passwordConfirm: this.langService.translations.REGISTER.CONFIRM,
      phone: this.langService.translations.REGISTER.PHONE,
      smsCode: this.langService.translations.REGISTER.PHONE_CONFIRM,
      phoneConfirm: this.langService.translations.REGISTER.PHONE_CONFIRM,
      invitationCode: this.langService.translations.REGISTER.CODE,
    };
  }

  passwordChange(type: boolean): void {
    this.isPassword = type;
    if (this.isPassword) {
      this.inputType = 'password';
    } else {
      this.inputType = 'text';
    }
  }


  getSmsCode(): void {
    this.publicService.bindPhone({ phone: this.registerForm.value.phone })
      .subscribe(
        () => {
          this.isPhoneConfirm = true;
        },
        ({ error }) => {
          console.log(error, typeof error);

          if (typeof error === 'string') {

            this.toastService.error(error);
            return;

          }


          this.toastService.error(error.message);
        });

    // this.isBindPhoneLock = true;
    // this.isPhoneConfirm = true;

    // setTimeout(() => {
    //   this.isBindPhoneLock = false;

    // }, 1000 * 60);

  }

  register(form: FormGroup): void {
    // console.log('valid', form.valid, 'form', form.value);

    // tslint:disable-next-line: forin
    for (const key in this.invalidErrors) {
      this.invalidErrors[key] = '';
    }

    // console.log("isCheck", form.controls.isCheck.value);

    if (form.controls.isCheck.invalid) {
      // console.log('***********');
      // this.toastService.error(this.CHECK_POLICY_txt, 3000);
      this.toastService.error(this.langService.translations.REGISTER.INVALID.CHECK_POLICY);
      return;
    }

    if (form.value.password !== form.value.checkPassword) {
      // console.log('****234234');
      // this.invalidErrors.checkPassword = this.CONFIRM_PWD_txt;
      this.invalidErrors.checkPassword = this.placeholder.passwordConfirm;
      return;
    }

    const copy = Object.assign({}, form.value);
    delete copy.confirm;
    delete copy.isCheck;

    console.log('copy', copy);
    // this.debugcopy = copy;
    // this.debugtxt = this.debugmsg.concat(',');

    this.publicService.register(copy)
      .subscribe(
        (res) => {

          if (res.data.review) {
            // this.toastService.success(this.WAIT_txt, 3000);
            // this.toastService.success(this.langService.translations.REGISTER.WAIT);

            this.toastService.forceAlert(this.langService.translations.REGISTER.WAIT, () => {

              this.router.navigateByUrl(AppRoutes.HOME);

            });


          } else {
            this.publicService.init();
            // this.status = registerStat.success;
            this.success = true;
          }


        },
        (err) => {

          console.log('err', err);

          if (err.error.errors) {

            Object.assign(this.invalidErrors, err.error.errors);
            console.log(this.invalidErrors);

          } else {


            if (err.error.message === 'multiple invitation_code') {

              this.toastService.error(this.langService.translations.SERVER_ERROR);

            } else {

              this.toastService.error(err.error.message, 3000);
            }


          }

        },

        () => {
          // got, it happens after succeed
          // console.log('final');
          // this.registerForm.reset();
        }
      ).add(() => {
        // console.log('final');
        // this.registerForm.reset();
        localStorage.removeItem(AppRoutes.TERMS);
      });

  }


  home(): void {
    this.router.navigateByUrl(AppRoutes.HOME);
  }

  openTerms(): void {

    // console.log('openTerms', this.registerForm.value);

    localStorage.setItem(AppRoutes.TERMS, JSON.stringify(this.registerForm.value));
    this.router.navigate([{ outlets: { popup: AppRoutes.TERMS } }]);
  }

  @HostListener(`window:${EventService.READPOLICY}`, ['$event'])
  updateReadpolicy(evt): void {

    console.log('updateReadpolicy', evt);

    this.registerForm.controls.isCheck.patchValue(this.publicService.readPolicy);
  }


  close(): void {
    localStorage.removeItem(AppRoutes.TERMS);
    this.router.navigate([{ outlets: { popup: null } }]);
  }

  goHome() {
    // mobile 因已使用 popup, 直接寫 routerlink 有問題
    this.router.navigateByUrl(AppRoutes.HOME);
  }


}
