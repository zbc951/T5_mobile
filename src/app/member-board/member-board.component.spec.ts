import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberBoardComponent } from './member-board.component';

describe('MemberBoardComponent', () => {
  let component: MemberBoardComponent;
  let fixture: ComponentFixture<MemberBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
