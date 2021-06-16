import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewTransferComponent } from './review-transfer.component';

describe('ReviewTransferComponent', () => {
  let component: ReviewTransferComponent;
  let fixture: ComponentFixture<ReviewTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
