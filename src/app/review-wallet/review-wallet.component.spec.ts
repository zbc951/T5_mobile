import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewWalletComponent } from './review-wallet.component';

describe('ReviewWalletComponent', () => {
  let component: ReviewWalletComponent;
  let fixture: ComponentFixture<ReviewWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
