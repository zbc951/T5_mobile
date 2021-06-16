import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupVipPointComponent } from './popup-vip-point.component';

describe('PopupVipPointComponent', () => {
  let component: PopupVipPointComponent;
  let fixture: ComponentFixture<PopupVipPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupVipPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupVipPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
