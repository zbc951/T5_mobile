import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawbackComponent } from './drawback.component';

describe('DrawbackComponent', () => {
  let component: DrawbackComponent;
  let fixture: ComponentFixture<DrawbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
