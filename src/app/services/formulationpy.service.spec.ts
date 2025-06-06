import { TestBed } from '@angular/core/testing';

import { FormulationpyService } from './formulationpy.service';

describe('FormulationpyService', () => {
  let service: FormulationpyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormulationpyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
