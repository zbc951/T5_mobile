import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as marked from 'marked';

@Component({
  selector: 'markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss']
})
export class MarkdownComponent implements OnInit, OnChanges {

  @Input() url: string;
  mdFile: any = '';
  currentLang: string = '';

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {
    this.currentLang = translate.currentLang.toLowerCase()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url) {
      this.getFile();
    }
  }

  ngOnInit() {
  }

  public getFile() {

    if (this.currentLang && this.url) {

      this.http.get(`assets/md/${this.currentLang}_${this.url}.md`, {
        responseType: 'text'
      }).subscribe((res) => {
        res = this.replaceText(res);
        this.mdFile = marked(res);
      });
    }

  }

  protected replaceText(text: string) {
    const replaceMaps: { [key: string]: any } = window['mdReplaces'] || {};
    const matches = text.match(/{([a-zA-Z0-9_]+)}/g) || [];
    matches.forEach((search) => {
      text = text.replace(search, replaceMaps[search] || '__unknow__');
    });

    return text;
  }
}
