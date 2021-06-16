import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoSetPhoneComponent } from './user-info-set-phone.component';

describe('UserInfoSetPhoneComponent', () => {
  let component: UserInfoSetPhoneComponent;
  let fixture: ComponentFixture<UserInfoSetPhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInfoSetPhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoSetPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
