import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetLogComponent } from './bet-log.component';

describe('BetLogComponent', () => {
  let component: BetLogComponent;
  let fixture: ComponentFixture<BetLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
