import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAlertComponent } from './select-alert.component';

describe('SelectAlertComponent', () => {
  let component: SelectAlertComponent;
  let fixture: ComponentFixture<SelectAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
