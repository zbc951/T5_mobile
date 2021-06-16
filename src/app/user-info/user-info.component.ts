import { DayjsService } from './../app-service/dayjs.service';
import { Component, OnInit } from '@angular/core';
import { AppRoutes } from '../constant/routes';
import { Router } from '@angular/router';
import { AuthService } from '../app-service/auth.service';
import { MemberService } from '../app-service/member.service';
import { BankService } from './../app-service/bank.service';
import { PublicService } from '../app-service/public.service';
// import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToastService } from './../app-service/toast.service';
import { LangService, lang } from './../app-service/lang.service';
import { FormBuilder, FormGroup, FormControl, FormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  // styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  AppRoutes = AppRoutes;
  info = null;
  infoForm: FormGroup;

  inviteUrl;
  invalidErrors = {
    phone: '',
    birth: '',
    email: '',
    line: '',
    wechat: '',
    smsCode: '',
    name: '',
    address: ''
  };

  isSetPwd = false;

  private data$;
  lv = 0;
  lvTxt = '';
  isBaseFilled = false;
  isHavingBankcards = false;
  isHavingEmail = false;

  isSaved = false;

  isChangePHone = false;

  isMemberModeOn = false;

  // QR code
  dataURL;

  // 不能有數字
  namePattern = new RegExp(/^[^\d]+$/);

  nameInvalidtxt = 'no number';

  subscriptionForNameCtrl;
  maxDate;

  constructor(
    private auth: AuthService,
    private publicSerivice: PublicService,
    private memberService: MemberService,
    private bankService: BankService,
    private formBuilder: FormBuilder,
    private router: Router,
    // private translate: TranslateService,
    private langService: LangService,
    private toastService: ToastService
  ) {

    this.publicSerivice.isMemberModeOnSub
      .subscribe((boo) => {

        this.isMemberModeOn = boo;

      });

    this.maxDate = DayjsService.now();
    // console.log('maxDate', this.maxDate);
    this.infoForm = this.formBuilder
      .group({
        account: new FormControl({ value: '', disabled: true }, Validators.required),
        name: new FormControl({ value: '', disabled: true }, Validators.required),
        phone: new FormControl({ value: '', disabled: false }, Validators.required),
        smsCode: '',
        email: '',
        address: '',
        birth: '',
        line: null,
        // qq: null,
        wechat: null,
        invitation_code: new FormControl({ value: null }, Validators.required)
      });
    
    // 不需要在這裡判斷是否跳出未成年警示
    // this.infoForm.controls.birth.valueChanges
    //   .subscribe((d) => {

    //     if (!this.isAdult(d)) {
    //       this.toastService.error(this.langService.translations.MEMBER_INFO.adult);
    //     }

    //   });

  }

  isAdult(d) {

    var ageDifMs = Date.now() - new Date(d).getTime();
    var ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    if(age < 18) {
      this.toastService.error(this.langService.translations.MEMBER_INFO.adult);
    }
    
    return age > 18;
  }


  ngOnInit(): void {
    this.getInfo();
    this.data$ = forkJoin([
      this.memberService.getInfo(),
      this.bankService.banks()]
    )
      .subscribe((res: any[]) => {

        this.nameInvalidtxt = this.langService.translations.REGISTER.INVALID.name;

        const security = this.langService.translations.MEMBER_INFO.security;

        const lvTxtArr = [
          security.low,
          security.middle_low,
          security.middle,
          security.high
        ];

        const basedata = res[0].data;
        if (basedata) {

          const { name, birth, line, wechat, email } = basedata;

          if (name && birth && (line || wechat)) {
            this.isBaseFilled = true;
            this.lv++;
          }

          if (email) {
            this.isHavingEmail = true;
            this.lv++;
          }

        }

        const bankdata = res[1].data;
        if (bankdata && bankdata.length > 0) {
          this.isHavingBankcards = true;
          this.lv++;
        }
        this.lvTxt = lvTxtArr[this.lv];

      });


  }


  getInfo(): void {
    this.memberService.getInfo()
      .subscribe((res: any) => {

        console.log('info res', res);

        this.auth.info = this.info = res.data;

        if (!this.info.isAutoPass && this.info.isReview) {
          this.toastService.error(this.langService.translations.MEMBER_WITHDRAW.APPLYING);
        }

        if (this.info.name && this.info.email && this.info.birth && (this.info.line || this.info.wechat)) {

          this.isSaved = true;

        }


        const origin = window.location.origin;
        // console.log('origin', origin);
        // this.inviteUrl = `${origin}/home(popup:register)?code=${this.info.invitation_code}`;
        this.inviteUrl = `${origin}/#/register/?code=${this.info.invitation_code}`;
        // this.inviteUrl = location.protocol + '//' + location.host + '/spread/tpl/registered.html?code=' + this.info.invitation_code;

        for (const key in this.info) {
          if (this.info.hasOwnProperty(key)) {
            const element = this.info[key];

            if (element) {

              const ctrl = this.infoForm.get(key);
              if (ctrl) {
                ctrl.patchValue(element);
              }
            }
          }
        }

        this.infoForm.addControl('smsCode', new FormControl(null, Validators.required));

        if (this.info.name) {

          // this.isNameLock = true;
          this.infoForm.get('name').disable();
          if (this.subscriptionForNameCtrl) {
            this.subscriptionForNameCtrl.unsubscribe();
          }

        } else {
          // console.log(this.infoForm.get('name'));

          this.infoForm.get('name').enable();
          this.subscriptionForNameCtrl = this.infoForm.controls.name
            .valueChanges
            .subscribe((val) => {

              // console.log('test', val);

              if (this.namePattern.test(val)) {

                this.invalidErrors.name = '';
              } else {

                this.invalidErrors.name = this.nameInvalidtxt;
              }

            });

        }

        if (this.info.phone) {

          // this.isPhoneLock = true;
          this.infoForm.get('phone').disable();

        } else {

          this.infoForm.get('phone').enable();
        }

      });
  }


  updateInfo(): void {
    // 沒填入的話轉成空字串(如果是null的話，後端拿到的會變成"null")

    console.log('info', this.info);
    console.log('infoForm', this.infoForm.value);

    if (this.info.isReview) {
      // this.toastService.error(this.appliedTxt);
      this.toastService.error(this.langService.translations.MEMBER_WITHDRAW.APPLYING);
      return;
    }

    for (let i in this.info) {
      if (!this.info[i]) {
        this.info[i] = '';
      }
    }

    // console.log('*info', this.info);

    let cantSubmit = false;
    this.invalidErrors = {
      phone: '',
      birth: '',
      email: '',
      line: '',
      wechat: '',
      smsCode: '',
      name: '',
      address: ''
    };

    const requiredTxt = this.langService.translations.REQUIRED;

    if (!this.info.name && !this.info.phone) {

      if (!this.infoForm.value.name) {
        this.invalidErrors.name = requiredTxt;
        cantSubmit = true;
      }

      // if (!this.infoForm.value.phone) {
      //   this.invalidErrors.phone = requiredTxt;
      //   cantSubmit = true;
      // }

      // if (!this.infoForm.value.smsCode) {
      //   this.invalidErrors.smsCode = requiredTxt;
      //   cantSubmit = true;
      // }
    }

    // console.log('**', this.infoForm.value.name, this.namePattern.test(this.infoForm.value.name));
    if (!this.infoForm.controls.name.disabled) {


      if (!this.infoForm.value.name) {
        this.invalidErrors.name = requiredTxt;
        cantSubmit = true;
        // console.log('!', this.infoForm.value.name);
        // return;
      } else {

        // console.log('!!', this.namePattern.test(this.infoForm.value.name) == false);

        if (this.namePattern.test(this.infoForm.value.name) == false) {

          this.invalidErrors.name = this.nameInvalidtxt;
          cantSubmit = true;

          // console.log('!!', this.infoForm.value.name);

        }
      }

    }


    if (!this.infoForm.value.birth) {
      this.invalidErrors.birth = requiredTxt;
      cantSubmit = true;
    }


    if (!this.isAdult(this.infoForm.value.birth)) {

      this.invalidErrors.birth = this.langService.translations.MEMBER_INFO.adult;
      cantSubmit = true;
    }

    if ((!this.infoForm.value.line && !this.infoForm.value.wechat)) {
      console.log('e!');
      this.invalidErrors.wechat = this.langService.translations.MEMBER_INFO.ONE_REQUIRED;
      cantSubmit = true;

    }

    console.log('cantSubmit', cantSubmit);

    if (cantSubmit) {
      console.log('invalidErrors', this.invalidErrors);
      return;
    }

    this.memberService.updateInfo(this.infoForm.getRawValue())
      .subscribe((res: any) => {

        // this.toastService.error(this.updatedTxt, 3000);
        this.toastService.error(this.langService.translations.MEMBER_INFO.updated, 3000);
        // this.getInfo();
        this.ngOnInit();

      },
        (err) => {

          console.log('err', err);
          if (err.error.errors) {

            Object.assign(this.invalidErrors, err.error.errors);
            console.log('invalidErrors', this.invalidErrors);

          } else {
            this.toastService.error(err.error.message, 3000);
          }
        });


  }


  editpwd(): void {
    this.router.navigate([{ outlets: { popup: [AppRoutes.EDITPWD] } }]);
  }

  qrCodeDownload() {
    // console.log('test', document.getElementsByTagName("canvas"));
    this.dataURL = document.getElementsByTagName("canvas")[0].toDataURL();
  }

  ngOnDestroy() {

    if (this.subscriptionForNameCtrl) {
      this.subscriptionForNameCtrl.unsubscribe();
    }

  }
}
