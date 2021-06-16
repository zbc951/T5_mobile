import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTermsComponent } from './popup-terms.component';

describe('PopupTermsComponent', () => {
  let component: PopupTermsComponent;
  let fixture: ComponentFixture<PopupTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
