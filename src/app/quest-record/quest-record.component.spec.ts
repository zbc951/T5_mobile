import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestRecordComponent } from './quest-record.component';

describe('QuestRecordComponent', () => {
  let component: QuestRecordComponent;
  let fixture: ComponentFixture<QuestRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
