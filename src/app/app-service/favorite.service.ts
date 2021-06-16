import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiPath } from '../constant/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  data = [];
  dataSubject = new BehaviorSubject([]);

  constructor(
    private http: HttpClient
  ) { }

  all() {
    this.http.get(ApiPath.ApiMemberFavoriteAll)
      .subscribe((res: any) => {
        // console.log('ApiMemberFavoriteAll', res);
        this.data = res.data;
        this.dataSubject.next(this.data);
      });
  }

  add(id: number) {
    this.http.post(ApiPath.ApiMemberFavoriteAdd, { id })
      .subscribe((res) => {
        this.data = [...this.data, id];
        this.dataSubject.next(this.data);
      });
  }

  remove(id: number) {
    this.http.post(ApiPath.ApiMemberFavoriteRemove, { id })
      .subscribe(res => {
        this.data = this.data
          .filter(fid => (fid !== id));
        this.dataSubject.next(this.data);
      });
  }

  clean() {
    this.data = [];
  }

  getData() {
    return this.dataSubject.asObservable();
  }
}
