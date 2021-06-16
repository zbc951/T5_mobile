import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineQuestApplyComponent } from './combine-quest-apply.component';

describe('CombineQuestApplyComponent', () => {
  let component: CombineQuestApplyComponent;
  let fixture: ComponentFixture<CombineQuestApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombineQuestApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineQuestApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
