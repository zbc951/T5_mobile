import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupForgetPasswordComponent } from './popup-forget-password.component';

describe('PopupForgetPasswordComponent', () => {
  let component: PopupForgetPasswordComponent;
  let fixture: ComponentFixture<PopupForgetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupForgetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupForgetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
