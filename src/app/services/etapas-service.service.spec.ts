import { TestBed } from '@angular/core/testing';

import { EtapasServiceService } from './etapas-service.service';

describe('EtapasServiceService', () => {
  let service: EtapasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtapasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
