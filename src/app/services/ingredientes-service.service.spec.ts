import { TestBed } from '@angular/core/testing';

import { IngredientesServiceService } from './ingredientes-service.service';

describe('IngredientesServiceService', () => {
  let service: IngredientesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
