import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pagination-box',
  templateUrl: './pagination-box.component.html',
  // styleUrls: ['./pagination-box.component.scss']
})
export class PaginationBoxComponent implements OnInit {
  @Input() showItems: Array<object>;
  @Input() curPage: number;
  constructor() { }

  ngOnInit(): void {
  }

}
