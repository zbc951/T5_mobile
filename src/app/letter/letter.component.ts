import { HeaderService, actions } from './../app-service/header.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { AppRoutes } from './../constant/routes';
import { PublicService, MarqueeType } from './../app-service/public.service';
import { ToastService } from './../app-service/toast.service';
import { LetterService, tabs } from './../app-service/letter.service';
import { Router } from '@angular/router';

interface ILetterMessageList {
  id: number;
  from: string;
  from_txt?: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  reply: object;
  replyAt: string;
  updatedAt: string;
}

interface ICustomLetterMessage extends ILetterMessageList {
  createdAtDate: string;
  createdAtTime: string;
}

/** 篩選類型 */
enum MessageQueryType {
  All,
  unRead,
  isRead
}

enum Role {
  AGENT = 'agent',
  MEMBER = 'member',
  SYSTEM = 'system'
}

interface ICustomMessageQueryType {
  value: MessageQueryType;
  label?: string;
  query: { read?: number, page?: number, perPage: number, active?: boolean, type?: string };
}

const messagePerPage = 10;

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  // styleUrls: ['./letter.component.scss']
})
export class LetterComponent implements OnInit, OnDestroy {

  tabs = tabs;
  tab = tabs.msg;
  Role = Role;
  MarqueeType = MarqueeType;

  msgType = Role.SYSTEM;
  announcType = MarqueeType.Hot;

  pageConfig: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };

  // ==============

  /** 當前選取的信件 id */
  public activeLetterId = 0;
  /** 頁數標籤 */
  public pageTag: number[] = [];
  unread;
  dataTotal = 0;

  messageList = {
    content: [],
    page: 1,
    perPage: 10,
    total: 0,
    maxPage: 0
  };

  announceList = {
    content: [],
    page: 1,
    perPage: 10,
    total: 0,
    maxPage: 0
  };

  selectMessageQueryType: ICustomMessageQueryType;
  messageQueryTypes: ICustomMessageQueryType[] = [
    {
      value: MessageQueryType.All,
      query: { page: this.messageList.page, perPage: messagePerPage }
    }
  ];

  isEditing = false;
  form: FormGroup;
  checkAll = false;

  constructor(
    private router: Router,
    private letterService: LetterService,
    private toast: ToastService,
    private publicService: PublicService,
    private fb: FormBuilder,
    private headerService: HeaderService

  ) {

    this.form = this.fb.group(
      {
        // id: new FormArray([])
        // id: this.fb.array([]),
        check: this.fb.array([]),
      }
    );

    this.letterService.getUnreads()
      .subscribe((res: any) => {

        this.unread = res;

      });

    this.headerService.listenAction()
      .subscribe((action) => {

        // console.log('action', action);

        switch (action) {

          case actions.LetterEdit:
            this.isEditing = true;
            break;

          case actions.LetterDone:
          case actions.LetterNoneEdit:
            this.isEditing = false;
            break;

        }

      });


  }

  ngOnInit(): void {

    if (this.publicService.isFromClickMarquee) {

      this.tab = tabs.announce;
      this.publicService.isFromClickMarquee = false;

      this.loadAnnouncement();

    } else {

      this.loadMessage();

    }

  }

  selectTab(t): void {

    if (this.tab === t) {
      return;
    }

    this.tab = t;
    this.clearFormArray();
    this.resetPageConfig();

    switch (this.tab) {
      case tabs.msg:
        this.announceList = null;

        this.announcType = MarqueeType.Hot;
        this.headerService.setLetterAction(actions.LetterDone);
        this.loadMessage();

        break;

      case tabs.announce:
        this.messageList = null;
        // this.headerService.actionNow = actions.LetterEdit;
        this.headerService.setLetterAction(actions.LetterNoneEdit);
        this.msgType = Role.SYSTEM;
        this.backToList();
        this.loadAnnouncement();
        break;

    }
  }

  selectMsgType(t): void {

    this.msgType = t;

    this.resetPageConfig();

    this.clearFormArray();

    this.loadMessage();

  }

  selectAnnounceType(t): void {

    this.announcType = t;

    this.resetPageConfig();

    this.loadAnnouncement();

  }

  loadMessage(): void {
    // console.log('loadMessage');

    this.activeLetterId = 0;
    this.selectMessageQueryType = this.messageQueryTypes[0];

    // console.log(
    //   'query:',
    //   this.selectMessageQueryType.query
    // );

    this.selectMessageQueryType.query.type = this.msgType;
    this.selectMessageQueryType.query.active = true;
    this.selectMessageQueryType.query.page = this.pageConfig.currentPage;


    this.letterService.getMessageList(this.selectMessageQueryType.query)
      .subscribe((res) => {

        // console.log('letterService.getMessageList', res);

        const { data } = res;
        this.dataTotal = data.total;

        // console.log('225', this.messageList);

        this.messageList = data;

        this.pageConfig.totalItems = data.total;
        this.pageConfig.itemsPerPage = data.perPage;
        this.pageConfig.currentPage = data.page;



        const checkArray: FormArray = this.form.get('check') as FormArray;

        this.messageList.content
          .forEach((item) => {
            checkArray.push(new FormControl(false));
          });

        // console.log(this.messageList);
        // console.log('controls.check', this.form.controls.check);

      });
  }

  loadAnnouncement(): void {

    this.publicService
      .getMarqueePage(
        {
          type: this.announcType,
          page: this.pageConfig.currentPage
        }
      )
      .subscribe((res) => {
        const { data } = res;
        console.log('getMarqueePage res', res);
        this.announceList = data;

        this.pageConfig.totalItems = data.total;
        this.pageConfig.itemsPerPage = data.perPage;
        this.pageConfig.currentPage = data.page;

      });

  }

  pageChanged(event): void {
    this.pageConfig.currentPage = event;

    switch (this.tab) {


      case tabs.msg:
        this.loadMessage();
        break;


      case tabs.announce:
        this.loadAnnouncement();
        break;

    }

  }

  resetPageConfig(): void {
    this.pageConfig = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: 0,
    };
  }

  readMessage(): void {

    // 標示已讀
    // console.log('readMessage');

    // console.log(this.form.value);
    // console.log('readMessage', this.form.controls.check.value);
    const selected = [];
    this.form.controls.check.value
      .forEach((item, index) => {

        if (item === true) {

          selected.push(this.messageList.content[index].id);
        }

      });


    // console.log('selected', selected);

    if (selected.length == 0) {
      this.backToList();
      return;
    }

    this.letterService.readMessage(selected)
      .subscribe(() => {

        this.backToList();
        this.resetPageConfig();
        this.loadMessage();

      });

    this.checkAll = false;


  }


  readlAll(): void {

    this.letterService.readAll()
      .subscribe((res) => {
        // this.selectNavtype(this.navType);
        this.resetPageConfig();
        this.loadMessage();
      });
  }

  removeMessage(): void {
    console.log('removeMessage', this.form.controls.check.value);
    const selected = [];
    this.form.controls.check.value
      .forEach((item, index) => {

        if (item === true) {

          selected.push(this.messageList.content[index].id);
        }

      });


    console.log('selected', selected);

    if (selected.length === 0) {
      this.backToList();
      return;
    }

    this.letterService.remove(selected)
      .subscribe((res) => {

        // localStorage.removeItem(AppRoutes.EMAIL_DETAILS);
        // this.toast.error('刪除成功', 3000);
        this.backToList();
        this.resetPageConfig();
        this.loadMessage();

      });

    this.checkAll = false;
  }

  goDetail(item, evt): void {

    // console.log('goDetail', evt.target);
    const { target } = evt;

    if (target.tagName === 'INPUT' || target.classList.contains('radio')) {
      return;
    }

    this.headerService.letterDetailType = this.tab;
    this.letterService.tmpMsg = item;
    this.router.navigateByUrl(AppRoutes.LETTER_DETAIL);

  }

  toggleAll(): void {

    // console.log('toggleAll:', e.target.checked, e.target.value);
    this.checkAll = !this.checkAll;
    // console.log('toggleAll checkAll:', this.checkAll);


    const checkArray: FormArray = this.form.get('check') as FormArray;

    if (this.checkAll) {

      this.messageList.content
        .forEach((item, idx) => {
          checkArray.controls[idx].patchValue(true);
        });

    } else {

      checkArray.controls.forEach((ctrl) => {
        ctrl.patchValue(false);
      });

    }

  }

  doCheckAll(): void {

    // console.log('doCheckAll', this.form.controls.check.value);

    if (this.form.controls.check.value.length == 0) {

      this.checkAll = false;
      return;

    }

    if (this.form.controls.check.value.includes(false)) {

      this.checkAll = false;
    } else {
      this.checkAll = true;
    }

  }

  backToList(): void {

    this.isEditing = false;

    // console.log('backToList');

    if (this.tab === tabs.msg) {

      this.headerService.emitAction(actions.LetterDone);

      // console.log('controls.check', this.form.controls.check);

    }

  }


  clearFormArray() {
    // console.log('clearFormArray');
    const idArray: FormArray = this.form.controls.check as FormArray;

    while (idArray.length !== 0) {
      idArray.removeAt(0);
    }

    this.doCheckAll();

  }

  ngOnDestroy(): void {
    // this.headerService.emitAction();

  }

}
