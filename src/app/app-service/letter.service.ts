import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppRoutes } from '../constant/routes';
import { ApiPath } from '../constant/api';
import { AuthService } from './auth.service';
import { BehaviorSubject, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UtilService } from './util.service';
export interface ILetterUnRead {
  announcements: number;
  messages: number;
}

export interface ILetterAnnouncement {
  id: number;         // number letter_announcement_read.id
  no: number;         // number letter_announcement.id (公告編號)
  tagName: string;    // string 公告類型 letter_tag.name
  title: string;      // string 標題 letter_announcement.title
  content: string;    // string 內容 letter_announcement.content
  isRead: boolean;    // boolean 是否已讀
  pin: boolean;       // boolean 是否標記
  createdAt: string;  // string 發佈時間 YYYY-MM-DD HH:mm:ss (php: Y-m-d H:i:s)
}

export interface ILetterMessageList {
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

export interface IPaginate<T = any> {
  content: T[];
  page: number;
  perPage: number;
  total: number;
  maxPage?: number;
}


export enum tabs {
  // 通知
  msg = 'msg',
  // 公告
  announce = 'announce'
}


@Injectable({
  providedIn: 'root'
})
export class LetterService {

  timerUnreads = null;
  unreadSubject = new BehaviorSubject({});
  unread = 0;
  list = [];
  listSubject = new BehaviorSubject([]);

  //for letter-detail
  tmpMsg;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {

  }

  unreads(num: number) {
    this.unread = num;
    this.unreadSubject.next(this.unread);
  }

  getUnreads() {
    return this.unreadSubject.asObservable();

  }

  getMessageList(data?: { read?: number; page?: number }) {

    const params = UtilService.getHttpParams(data);

    return this.http.get<IPaginate<ILetterMessageList>>(ApiPath.ApiLetterMessageList, { params })
      .pipe(
        tap((res: any) => {
          // console.log('res', res);
          this.list = res.data.content;
          this.listSubject.next(res.data);
        }))
      ;
  }

  getList() {
    return this.listSubject.asObservable();
  }

  readMessage(id) {


    return this.http.post(ApiPath.ApiLetterMessageRead, { id })
      .pipe(
        tap((res: any) => {

          this.unread = res.data;
          this.unreadSubject.next(this.unread);

        })
      );
  }

  remove(id: object) {
    return this.http.post(ApiPath.ApiLetterMessageRemove, { id });
  }

  readAll() {
    return this.http.post(ApiPath.ApiLetterMessageReadAll, {});
  }

  removeAll() {
    return this.http.post(ApiPath.ApiLetterMessageRemoveAll, {});
  }

  getMsgDetail(id) {
    const params = UtilService.getHttpParams({ id: id });
    // console.log('getMsgDetail', id, 'params', params);
    return this.http.get(ApiPath.ApiLetterMessageDetail, { params });

  }

  getAnnounceDetail(id) {
    const params = UtilService.getHttpParams(
      {
        id: id
      });
    return this.http.get(ApiPath.ApiPublicMarqueeDetail, { params });
  }

}
