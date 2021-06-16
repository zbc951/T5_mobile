import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldQuestCenterComponent } from './old-quest-center.component';

describe('OldQuestCenterComponent', () => {
  let component: OldQuestCenterComponent;
  let fixture: ComponentFixture<OldQuestCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldQuestCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldQuestCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
