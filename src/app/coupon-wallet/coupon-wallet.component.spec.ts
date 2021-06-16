import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponWalletComponent } from './coupon-wallet.component';

describe('CouponWalletComponent', () => {
  let component: CouponWalletComponent;
  let fixture: ComponentFixture<CouponWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
