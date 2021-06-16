import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotCenterComponent } from './slot-center.component';

describe('SlotCenterComponent', () => {
  let component: SlotCenterComponent;
  let fixture: ComponentFixture<SlotCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
