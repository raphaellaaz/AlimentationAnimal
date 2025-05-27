import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { optimizeFormulation, FormulationProblem, Ingredient, NutrientRequirement } from './formulation';
import { IngredientesService } from '../services/ingredientes-service.service';
import { EtapasService } from '../services/etapas-service.service';
import { EspecieModel } from '../models/especie.model';
import { EtapaModel } from '../models/etapa-desarrollo.model';
import { IngredienteConPrecio } from '../interfaces/ingrediente_interfaces';

// Mock SimplexOptimizer class
class MockSimplexOptimizer {
  constructor(problem: FormulationProblem) {}
  solve() {
    // Simulate a successful solution
    return { solution: { 'IngredienteA': 50, 'IngredienteB': 50 }, cost: 100 };
  }
  validateSolution(solution: Record<string, number>): boolean {
    return true;
  }
}

// Keep the original interfaces and types available for casting if needed
const actualFormulation = jest.requireActual('./formulation');

describe('optimizeFormulation', () => {
  let mockIngredientesService: Partial<IngredientesService>;
  let mockEtapasService: Partial<EtapasService>;

  const mockSelectedEspecie: EspecieModel = { id_especie: 1, nombre: 'Pollo', tipo: 'Ave' };
  const mockSelectedEtapa: EtapaModel = { id_etapa: 1, id_especie: 1, nombre_etapa: 'Inicio', edad_inicio: 0, edad_fin: 10 };
  const mockSelectedIngredientes: IngredienteConPrecio[] = [
    { id_ingrediente: 1, Nombre_Ingrediente: 'Maiz', precio: 0.2, id_categoria_ingrediente: 1, id_unidad_medida: 1 },
    { id_ingrediente: 2, Nombre_Ingrediente: 'Soja', precio: 0.5, id_categoria_ingrediente: 1, id_unidad_medida: 1 },
  ];
  const mockTargetWeight = 100;

  beforeEach(() => {
    // Mock IngredientesService
    mockIngredientesService = {
      getIngredienteDetailsById: jest.fn((id: number) => {
        if (id === 1) {
          return of({ weightPerUnit: 1, nutrients: { "proteina": 8, "grasa": 3 } });
        }
        if (id === 2) {
          return of({ weightPerUnit: 1, nutrients: { "proteina": 40, "grasa": 20 } });
        }
        return throwError(() => new Error('Ingredient not found'));
      })
    };

    // Mock EtapasService
    mockEtapasService = {
      getNutrientRequirementsByEspecieAndEtapa: jest.fn((idEspecie: number, idEtapa: number) => {
        return of([
          { nutrient: "proteina", minValue: 20, maxValue: 30 },
          { nutrient: "grasa", minValue: 5, maxValue: 10 },
        ] as actualFormulation.NutrientRequirement[]); // Cast to the actual type
      })
    };

    // Mock the SimplexOptimizer within the formulation module
    jest.mock('./formulation', () => ({
      ...actualFormulation, // Spread actual module exports
      SimplexOptimizer: MockSimplexOptimizer // Override SimplexOptimizer with our mock
    }));
  });

  afterEach(() => {
    jest.resetModules(); // Reset modules to clear mocks between tests
  });


  it('should return a valid solution for a solvable problem', (done) => {
    optimizeFormulation(
      mockTargetWeight,
      mockSelectedEspecie,
      mockSelectedEtapa,
      mockSelectedIngredientes,
      mockIngredientesService as IngredientesService,
      mockEtapasService as EtapasService
    ).subscribe(result => {
      expect(result.hasOwnProperty('error')).toBe(false);
      if (!result.hasOwnProperty('error')) {
        const successResult = result as { solution: Record<string, number>, cost: number };
        expect(successResult.solution).toBeDefined();
        expect(successResult.cost).toBeGreaterThan(0);
        expect(mockIngredientesService.getIngredienteDetailsById).toHaveBeenCalledTimes(mockSelectedIngredientes.length);
        expect(mockEtapasService.getNutrientRequirementsByEspecieAndEtapa).toHaveBeenCalledWith(mockSelectedEspecie.id_especie, mockSelectedEtapa.id_etapa);
      }
      done();
    });
  });

  it('should handle errors from IngredientesService', (done) => {
    (mockIngredientesService.getIngredienteDetailsById as jest.Mock).mockReturnValue(throwError(() => new Error('Service failure')));
    
    optimizeFormulation(
      mockTargetWeight,
      mockSelectedEspecie,
      mockSelectedEtapa,
      mockSelectedIngredientes,
      mockIngredientesService as IngredientesService,
      mockEtapasService as EtapasService
    ).subscribe(result => {
      expect(result.hasOwnProperty('error')).toBe(true);
      if (result.hasOwnProperty('error')) {
        const errorResult = result as { error: string };
        expect(errorResult.error).toContain('Service failure');
      }
      done();
    });
  });

  it('should handle errors from EtapasService', (done) => {
    (mockEtapasService.getNutrientRequirementsByEspecieAndEtapa as jest.Mock).mockReturnValue(throwError(() => new Error('Nutrient service failure')));
    
    optimizeFormulation(
      mockTargetWeight,
      mockSelectedEspecie,
      mockSelectedEtapa,
      mockSelectedIngredientes,
      mockIngredientesService as IngredientesService,
      mockEtapasService as EtapasService
    ).subscribe(result => {
      expect(result.hasOwnProperty('error')).toBe(true);
      if (result.hasOwnProperty('error')) {
        const errorResult = result as { error: string };
        expect(errorResult.error).toContain('Nutrient service failure');
      }
      done();
    });
  });

   it('should return an error if no ingredients are selected', (done) => {
    optimizeFormulation(
      mockTargetWeight,
      mockSelectedEspecie,
      mockSelectedEtapa,
      [], // No ingredients
      mockIngredientesService as IngredientesService,
      mockEtapasService as EtapasService
    ).subscribe(result => {
      expect(result.hasOwnProperty('error')).toBe(true);
      if (result.hasOwnProperty('error')) {
        const errorResult = result as { error: string };
        expect(errorResult.error).toBe('No ingredients selected.');
      }
      done();
    });
  });

});
