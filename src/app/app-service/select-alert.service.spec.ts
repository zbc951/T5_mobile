import { TestBed } from '@angular/core/testing';

import { SelectAlertService } from './select-alert.service';

describe('SelectAlertService', () => {
  let service: SelectAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
