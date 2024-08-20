import { TestBed } from '@angular/core/testing';

import { FormUtilsDebounceService } from './form-utils-debounce.service';

describe('FormUtilsDebounceService', () => {
  let service: FormUtilsDebounceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormUtilsDebounceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
