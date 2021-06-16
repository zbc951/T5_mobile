import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEditPwdComponent } from './popup-edit-pwd.component';

describe('PopupEditPwdComponent', () => {
  let component: PopupEditPwdComponent;
  let fixture: ComponentFixture<PopupEditPwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupEditPwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupEditPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
