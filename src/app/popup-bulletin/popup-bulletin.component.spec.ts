import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupBulletinComponent } from './popup-bulletin.component';

describe('PopupBulletinComponent', () => {
  let component: PopupBulletinComponent;
  let fixture: ComponentFixture<PopupBulletinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupBulletinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
