import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountRecordComponent } from './amount-record.component';

describe('AmountRecordComponent', () => {
  let component: AmountRecordComponent;
  let fixture: ComponentFixture<AmountRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
