import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawBetRecordComponent } from './withdraw-bet-record.component';

describe('WithdrawBetRecordComponent', () => {
  let component: WithdrawBetRecordComponent;
  let fixture: ComponentFixture<WithdrawBetRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawBetRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawBetRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
