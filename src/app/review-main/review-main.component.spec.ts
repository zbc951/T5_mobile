import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMainComponent } from './review-main.component';

describe('ReviewMainComponent', () => {
  let component: ReviewMainComponent;
  let fixture: ComponentFixture<ReviewMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
