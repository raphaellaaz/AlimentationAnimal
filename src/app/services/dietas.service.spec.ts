import { TestBed } from '@angular/core/testing';

import { DietasService } from './dietas.service';

describe('DietasService', () => {
  let service: DietasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DietasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
