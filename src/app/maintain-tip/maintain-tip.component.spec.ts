import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainTipComponent } from './maintain-tip.component';

describe('MaintainTipComponent', () => {
  let component: MaintainTipComponent;
  let fixture: ComponentFixture<MaintainTipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainTipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
