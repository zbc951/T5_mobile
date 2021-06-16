import { EventService } from './../app-service/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../app-service/header.service';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})
export class HelpCenterComponent implements OnInit {

  public tabs = [
    {
      key: 'help',
      name: 'NAV.NEWBIE',
      files: [
        { key: 'register', name: 'NEWBIE.OPEN.TITLE' },
        { key: 'deposit', name: 'NEWBIE.DEPOSIT.TITLE' },
        { key: 'withdraw', name: 'NEWBIE.WITHDRAW.TITLE' },
        { key: 'transfer', name: 'NEWBIE.TRANSFER.TITLE' },
        { key: 'rule', name: 'NEWBIE.PREFERENTIAL.TITLE' },
      ]
    },
    {
      key: 'common',
      name: 'NAV.QNA',
      files: [
        { key: 'common', name: 'COMMON.TITLE' },
        { key: 'remote', name: 'COMMON.REMOTE.TITLE' },
        // { key: 'contact', name: 'COMMON.CONTACT.TITLE' },
      ]
    },
    {
      key: 'about',
      name: 'NAV.ABOUT',
      files: [
        { key: 'terms', name: 'ABOUT.TERMS.TITLE' },
        { key: 'privacy', name: 'ABOUT.PRIVACY.TITLE' },
        { key: 'duty', name: 'ABOUT.DUTY.TITLE' },
        { key: 'secure', name: 'ABOUT.SECURE.TITLE' },
        { key: 'responsibility', name: 'ABOUT.responsibility.TITLE' },
        { key: 'license', name: 'ABOUT.license.TITLE' },
        { key: 'deposit-withdraw-help', name: 'ABOUT.depositWithdraw.TITLE' },
        { key: 'rule', name: 'ABOUT.rule.TITLE' },
      ]
    },
    {
      key: 'download',
      name: 'NAV.download',
      files: [
        { key: 'allbet', name: 'APP.allbet' },
        { key: 'sa', name: 'APP.sa' },
        { key: 'wm', name: 'APP.wm' }
      ]
    },
  ];
  public activeTab;
  public activeFile;
  public url: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] || 'help';
      const file = params['file'];

      this.activeTab = this.tabs.find(e => e.key == tab);
      if (!file) {
        this.activeFile = ''
        this.changeTab()
      } else {
        this.activeFile = this.activeTab.files.find(e => e.key == file)
        this.changeFile(this.activeFile)
      }
    })

    setTimeout(() => {
      if (!this.activeFile) {
        this.changeTab()
      } else if (this.activeFile) {
        this.changeFile(this.activeFile)
      }
    }, 100)
  }

  public changeTab() {
    this.router.navigate(['/help-center'], { queryParams: { tab: this.activeTab.key } }).then(() => {
      this.headerService.curType = 6;
      this.headerService.setTitle(this.activeTab.name)
    });
  }

  public changeFile(file) {
    this.activeFile = file;

    this.router.navigate(['/help-center'], { queryParams: { tab: this.activeTab.key, file: this.activeFile.key } }).then(() => {

      this.url = `${this.activeTab.key}/${this.activeFile.key}`;
      this.headerService.curType = 8;
      this.headerService.setTitle(this.activeFile.name);

      if (this.activeFile.name == 'COMMON.CONTACT.TITLE') {
        EventService.dispatch(EventService.isContactPage);
      }

    });
  }
}
