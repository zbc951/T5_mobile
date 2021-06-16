import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestCenterComponent } from './quest-center.component';

describe('QuestCenterComponent', () => {
  let component: QuestCenterComponent;
  let fixture: ComponentFixture<QuestCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
