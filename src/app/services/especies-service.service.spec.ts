import { TestBed } from '@angular/core/testing';

import { EspeciesServiceService } from './especies-service.service';

describe('EspeciesServiceService', () => {
  let service: EspeciesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspeciesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
