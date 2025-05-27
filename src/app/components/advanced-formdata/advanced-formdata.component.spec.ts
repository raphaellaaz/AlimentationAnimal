import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdvancedFormdataComponent } from './advanced-formdata.component';
import { IngredientesService } from '../../services/ingredientes-service.service';
import { EspeciesService } from '../../services/especies-service.service';
import { EtapasService } from '../../services/etapas-service.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts'; // Import NgChartsModule
import { of, throwError } from 'rxjs';

// Mock the external optimizeFormulation function
jest.mock('../../formulation/formulation', () => ({
  optimizeFormulation: jest.fn()
}));
import { optimizeFormulation } from '../../formulation/formulation';

describe('AdvancedFormdataComponent', () => {
  let component: AdvancedFormdataComponent;
  let fixture: ComponentFixture<AdvancedFormdataComponent>;
  let mockIngredientesService: Partial<IngredientesService>;
  let mockEspeciesService: Partial<EspeciesService>;
  let mockEtapasService: Partial<EtapasService>;

  beforeEach(async () => {
    mockIngredientesService = {
      ingredienteSeleccionado$: of([]),
      setIngredienteSeleccionado: jest.fn(),
      // Mock getIngredienteDetailsById if it were used directly by component logic other than optimizeFormulation
    };
    mockEspeciesService = {
      especieSeleccionada$: of(null),
      setEspecieSeleccionada: jest.fn(),
    };
    mockEtapasService = {
      etapaSeleccionada$: of(null),
      setEtapaSeleccionada: jest.fn(),
      // Mock getNutrientRequirementsByEspecieAndEtapa if used directly
    };

    await TestBed.configureTestingModule({
      imports: [AdvancedFormdataComponent, BrowserAnimationsModule, NgChartsModule], // Added NgChartsModule
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: IngredientesService, useValue: mockIngredientesService },
        { provide: EspeciesService, useValue: mockEspeciesService },
        { provide: EtapasService, useValue: mockEtapasService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedFormdataComponent);
    component = fixture.componentInstance;
    (optimizeFormulation as jest.Mock).mockClear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Tests for onLimpiar, getSolutionAsArray, and onFormular (excluding chart updates)
  // would be very similar to FormdataComponent.spec.ts.
  // For brevity, focusing on chart-specific methods here.

  describe('Chart Methods', () => {
    beforeEach(() => {
      // Setup a mock successful formulation result
      component.formulationResult = {
        solution: { 'Maiz': 60, 'Soja': 40 },
        cost: 100
      };
      component.peso = 100; // For bar chart scaling
      fixture.detectChanges(); 
    });

    describe('updateCharts', () => {
      it('should populate pie chart data based on formulationResult', () => {
        // Access the private method for testing if necessary, or trigger it via onFormular
        // For this test, we'll call it directly assuming it's been made public for testing or refactored.
        // If it remains private, test through onFormular's success path.
        (component as any).updateCharts(); // Cast to any to access private method

        expect(component.pieChartLabels).toEqual(['Maiz', 'Soja']);
        expect(component.pieChartDatasets.datasets[0].data).toEqual([60, 40]);
      });

      it('should populate bar chart data with simulated values', () => {
        (component as any).updateCharts();

        expect(component.barChartDatasets.datasets[0].data.length).toBe(component.barChartLabels.length);
        expect(component.barChartDatasets.datasets[1].data.length).toBe(component.barChartLabels.length);
        // Check if data arrays contain numbers (actual values depend on Math.random and scaling)
        component.barChartDatasets.datasets[0].data.forEach(val => expect(typeof val).toBe('number'));
        component.barChartDatasets.datasets[1].data.forEach(val => expect(typeof val).toBe('number'));
      });
       it('should not error if formulationResult or solution is null', () => {
        component.formulationResult = null;
        expect(() => (component as any).updateCharts()).not.toThrow();
        
        component.formulationResult = { solution: null as any, cost: 0 }; // Simulate null solution
         expect(() => (component as any).updateCharts()).not.toThrow();
         expect(component.pieChartDatasets.datasets[0].data.length).toBe(0);
      });
    });

    describe('clearChartData', () => {
      it('should reset chart data properties', () => {
        // First, populate them by calling updateCharts
        (component as any).updateCharts();
        expect(component.pieChartDatasets.datasets[0].data.length).toBeGreaterThan(0);

        // Now clear
        (component as any).clearChartData();

        expect(component.pieChartLabels).toEqual([]);
        expect(component.pieChartDatasets.datasets[0].data).toEqual([]);
        expect(component.barChartDatasets.datasets[0].data).toEqual([]);
        expect(component.barChartDatasets.datasets[1].data).toEqual([]);
      });
    });
    
    // Test onFormular integration with chart updates
    describe('onFormular with chart updates', () => {
        it('should call updateCharts on successful formulation', fakeAsync(() => {
            const mockResult = { solution: { 'Trigo': 100 }, cost: 30 };
            (optimizeFormulation as jest.Mock).mockReturnValue(of(mockResult));
            const updateChartsSpy = jest.spyOn(component as any, 'updateCharts');
            
            component.peso = 100;
            component.selectedEspecie = { id_especie: 1, nombre: 'Vaca', tipo: 'Rumiante' };
            component.selectedEtapa = { id_etapa: 1, id_especie: 1, nombre_etapa: 'Crecimiento', edad_inicio: 0, edad_fin: 10 };
            component.selectedIngredientes = [{ id_ingrediente: 1, Nombre_Ingrediente: 'Trigo', precio: 0.3, id_categoria_ingrediente:1, id_unidad_medida:1 }];
            
            component.onFormular();
            tick();
            fixture.detectChanges();

            expect(component.formulationResult).toEqual(mockResult);
            expect(updateChartsSpy).toHaveBeenCalled();
        }));

        it('should call clearChartData if formulation returns an error object', fakeAsync(() => {
            const mockError = { error: 'Formulation failed badly' };
            (optimizeFormulation as jest.Mock).mockReturnValue(of(mockError));
            const clearChartDataSpy = jest.spyOn(component as any, 'clearChartData');

            component.peso = 100;
            component.selectedEspecie = { id_especie: 1, nombre: 'Vaca', tipo: 'Rumiante' };
            component.selectedEtapa = { id_etapa: 1, id_especie: 1, nombre_etapa: 'Crecimiento', edad_inicio: 0, edad_fin: 10 };
            component.selectedIngredientes = [{ id_ingrediente: 1, Nombre_Ingrediente: 'Trigo', precio: 0.3, id_categoria_ingrediente:1, id_unidad_medida:1 }];

            component.onFormular();
            tick();
            fixture.detectChanges();

            expect(component.formulationError).toBe('Formulation failed badly');
            expect(clearChartDataSpy).toHaveBeenCalled();
        }));
    });

    // Test onLimpiar integration with chart updates
    describe('onLimpiar with chart updates', () => {
        it('should call clearChartData', () => {
            const clearChartDataSpy = jest.spyOn(component as any, 'clearChartData');
            component.onLimpiar();
            expect(clearChartDataSpy).toHaveBeenCalled();
        });
    });

  });
});
