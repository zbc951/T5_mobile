import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewBonusComponent } from './review-bonus.component';

describe('ReviewBonusComponent', () => {
  let component: ReviewBonusComponent;
  let fixture: ComponentFixture<ReviewBonusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
