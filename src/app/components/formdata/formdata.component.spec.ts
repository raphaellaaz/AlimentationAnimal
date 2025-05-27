import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormdataComponent } from './formdata.component';
import { IngredientesService } from '../../services/ingredientes-service.service';
import { EspeciesService } from '../../services/especies-service.service';
import { EtapasService } from '../../services/etapas-service.service';
import { provideHttpClientTesting } from '@angular/common/http/testing'; // For HTTP service mocks
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // For Material components
import { of, throwError } from 'rxjs';

// Mock the external optimizeFormulation function
jest.mock('../../formulation/formulation', () => ({
  optimizeFormulation: jest.fn()
}));
import { optimizeFormulation } from '../../formulation/formulation'; // Import the mocked function

describe('FormdataComponent', () => {
  let component: FormdataComponent;
  let fixture: ComponentFixture<FormdataComponent>;
  let mockIngredientesService: Partial<IngredientesService>;
  let mockEspeciesService: Partial<EspeciesService>;
  let mockEtapasService: Partial<EtapasService>;

  beforeEach(async () => {
    mockIngredientesService = {
      ingredienteSeleccionado$: of([]), // Default empty selection
      setIngredienteSeleccionado: jest.fn()
    };
    mockEspeciesService = {
      especieSeleccionada$: of(null),
      setEspecieSeleccionada: jest.fn()
    };
    mockEtapasService = {
      etapaSeleccionada$: of(null),
      setEtapaSeleccionada: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [FormdataComponent, BrowserAnimationsModule], // FormdataComponent is standalone
      providers: [
        provideHttpClient(), // Provide HttpClient
        provideHttpClientTesting(), // Specifically for testing HTTP if services were making real calls
        { provide: IngredientesService, useValue: mockIngredientesService },
        { provide: EspeciesService, useValue: mockEspeciesService },
        { provide: EtapasService, useValue: mockEtapasService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormdataComponent);
    component = fixture.componentInstance;
    (optimizeFormulation as jest.Mock).mockClear(); // Clear mock before each test
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onLimpiar', () => {
    it('should reset form fields and results', () => {
      component.peso = 100;
      component.selectedIngredientes = [{ id_ingrediente: 1, Nombre_Ingrediente: 'Maiz', precio: 0.2, id_categoria_ingrediente: 1, id_unidad_medida: 1 }];
      component.formulationResult = { solution: { 'Maiz': 100 }, cost: 20 };
      component.formulationError = 'Some error';
      component.isLoading = true;

      // Mock child component if it exists and is used
      component.searchEspecieComponent = { removeItem: jest.fn() } as any;


      component.onLimpiar();

      expect(component.peso).toBe(0);
      expect(component.selectedIngredientes).toEqual([]);
      expect(component.formulationResult).toBeNull();
      expect(component.formulationError).toBeNull();
      expect(component.isLoading).toBe(false);
      expect(mockEspeciesService.setEspecieSeleccionada).toHaveBeenCalledWith(null);
      expect(mockEtapasService.setEtapaSeleccionada).toHaveBeenCalledWith(null);
      expect(mockIngredientesService.setIngredienteSeleccionado).toHaveBeenCalledWith(null);
       if (component.searchEspecieComponent) {
        expect(component.searchEspecieComponent.removeItem).toHaveBeenCalled();
      }
    });
  });

  describe('getSolutionAsArray', () => {
    it('should return an empty array if solution is null or undefined', () => {
      expect(component.getSolutionAsArray(null)).toEqual([]);
      expect(component.getSolutionAsArray(undefined)).toEqual([]);
    });

    it('should convert a solution object to an array of key-value pairs', () => {
      const solution = { 'Maiz': 60, 'Soja': 40 };
      const expectedArray = [
        { key: 'Maiz', value: 60 },
        { key: 'Soja', value: 40 }
      ];
      expect(component.getSolutionAsArray(solution)).toEqual(expectedArray);
    });
  });

  describe('onFormular', () => {
    beforeEach(() => {
      // Setup valid default inputs
      component.peso = 100;
      component.selectedEspecie = { id_especie: 1, nombre: 'Pollo', tipo: 'Ave' };
      component.selectedEtapa = { id_etapa: 1, id_especie: 1, nombre_etapa: 'Inicio', edad_inicio: 0, edad_fin: 10 };
      component.selectedIngredientes = [{ id_ingrediente: 1, Nombre_Ingrediente: 'Maiz', precio: 0.2, id_categoria_ingrediente:1, id_unidad_medida:1 }];
      fixture.detectChanges();
    });

    it('should set isLoading to true and clear previous results/errors', () => {
      (optimizeFormulation as jest.Mock).mockReturnValue(of({ solution: {}, cost: 0 }));
      component.onFormular();
      expect(component.isLoading).toBe(true);
      expect(component.formulationResult).toBeNull();
      expect(component.formulationError).toBeNull();
    });

    it('should call optimizeFormulation with correct parameters when inputs are valid', fakeAsync(() => {
      const mockResult = { solution: { 'Maiz': 100 }, cost: 20 };
      (optimizeFormulation as jest.Mock).mockReturnValue(of(mockResult));
      
      component.onFormular();
      tick(); // Process the observable

      expect(optimizeFormulation).toHaveBeenCalledWith(
        component.peso,
        component.selectedEspecie,
        component.selectedEtapa,
        component.selectedIngredientes,
        TestBed.inject(IngredientesService), // Get the injected service instance
        TestBed.inject(EtapasService)        // Get the injected service instance
      );
    }));

    it('should set formulationResult on successful formulation', fakeAsync(() => {
      const mockResult = { solution: { 'Maiz': 100 }, cost: 20 };
      (optimizeFormulation as jest.Mock).mockReturnValue(of(mockResult));
      
      component.onFormular();
      tick();

      expect(component.formulationResult).toEqual(mockResult);
      expect(component.formulationError).toBeNull();
      expect(component.isLoading).toBe(false);
    }));

    it('should set formulationError when optimizeFormulation returns an error object', fakeAsync(() => {
      const mockError = { error: 'Optimization failed' };
      (optimizeFormulation as jest.Mock).mockReturnValue(of(mockError));
      
      component.onFormular();
      tick();

      expect(component.formulationError).toBe('Optimization failed');
      expect(component.formulationResult).toBeNull();
      expect(component.isLoading).toBe(false);
    }));
    
    it('should set formulationError on optimizeFormulation observable error', fakeAsync(() => {
      (optimizeFormulation as jest.Mock).mockReturnValue(throwError(() => new Error('Service unavailable')));
      
      component.onFormular();
      tick();

      expect(component.formulationError).toBe('Ocurrió un error inesperado durante la formulación. Intente de nuevo.');
      expect(component.formulationResult).toBeNull();
      expect(component.isLoading).toBe(false);
    }));

    // Input validation tests
    it('should set formulationError if peso is 0 or less', () => {
      component.peso = 0;
      component.onFormular();
      expect(component.formulationError).toBe('El peso a formular debe ser mayor que cero.');
      expect(optimizeFormulation).not.toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
    });
    
    it('should set formulationError if no especie is selected', () => {
      component.selectedEspecie = null; // or initial state with id 0
      component.onFormular();
      expect(component.formulationError).toBe('Por favor, seleccione una especie.');
      expect(optimizeFormulation).not.toHaveBeenCalled();
    });

    it('should set formulationError if no etapa is selected', () => {
      component.selectedEtapa = null; // or initial state with id 0
      component.onFormular();
      expect(component.formulationError).toBe('Por favor, seleccione una etapa de desarrollo.');
      expect(optimizeFormulation).not.toHaveBeenCalled();
    });

    it('should set formulationError if no ingredientes are selected', () => {
      component.selectedIngredientes = [];
      component.onFormular();
      expect(component.formulationError).toBe('Por favor, seleccione al menos un ingrediente.');
      expect(optimizeFormulation).not.toHaveBeenCalled();
    });

  });
});