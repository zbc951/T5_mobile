import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoPlatformComponent } from './user-info-platform.component';

describe('UserInfoPlatformComponent', () => {
  let component: UserInfoPlatformComponent;
  let fixture: ComponentFixture<UserInfoPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInfoPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
