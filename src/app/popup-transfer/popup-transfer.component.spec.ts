import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTransferComponent } from './popup-transfer.component';

describe('PopupTransferComponent', () => {
  let component: PopupTransferComponent;
  let fixture: ComponentFixture<PopupTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
