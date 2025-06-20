import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { isEmpty, map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common'; // Import CommonModule
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SearchInpComponent as SearchEspecieComponent } from '../especies/search-inp/search-inp.component';
import { SearchInpComponent as SearchIngredienteComponent } from '../ingredientes/search-inp/search-inp.component';
import { SearchInpComponent as SearchEtapaComponent } from '../etapas/search-inp/search-inp.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartOptions, ChartData } from 'chart.js';

import { EtapasService } from '../../services/etapas-service.service';
import { EspeciesService } from '../../services/especies-service.service';
import { IngredientesService } from '../../services/ingredientes-service.service';

import { EtapaModel } from '../../models/etapa-desarrollo.model';
import { EspecieModel } from '../../models/especie.model';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

import { IngredienteConPrecio } from '../../interfaces/ingrediente_interfaces';

import { optimizeFormulation } from '../../formulation/formulation';


@Component({
  selector: 'app-advanced-formdata', // Updated selector
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    NgChartsModule, // Added NgChartsModule
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    SearchEspecieComponent,
    SearchIngredienteComponent,
    SearchEtapaComponent,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatListModule,
    RouterLink,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './advanced-formdata.component.html',
  styleUrl: './advanced-formdata.component.css', // Updated styleUrl
})
export class AdvancedFormdataComponent implements OnInit, OnDestroy { // Updated class name

  @ViewChild(SearchEspecieComponent) searchEspecieComponent!: SearchEspecieComponent;
  
  peso: number = 0;
  selectedEtapa!: EtapaModel | null; 
  selectedEspecie!: EspecieModel | null; 
  selectedIngredientes: IngredienteConPrecio[] = [];

  formulationResult: { solution: Record<string, number>, cost: number } | null = null;
  formulationError: string | null = null;
  isLoading: boolean = false;

  // Chart properties
  // For Pie Chart (Ingredient Proportion)
  public pieChartLabels: string[] = [];
  public pieChartDatasets: ChartData<'pie', number[], string | string[]> = {
    labels: this.pieChartLabels,
    datasets: [{ data: [] }]
  };
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Proporción de Ingredientes' }
    }
  };
  public pieChartLegend = true;
  public pieChartType: 'pie' = 'pie';

  // For Bar Chart (Nutrient Analysis - Simulated)
  public barChartLabels: string[] = ['Proteína', 'Grasa', 'Fibra', 'Calcio', 'Fósforo'];
  public barChartDatasets: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [], label: 'Aportado en la Mezcla (g)' },
      { data: [], label: 'Mínimo Requerido (g)' }
      // { data: [], label: 'Máximo Requerido (g)' } // Optional
    ]
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Análisis Nutricional (Simulado)' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };
  public barChartLegend = true;
  public barChartType: 'bar' = 'bar';

  private initialEspecieState: EspecieModel = { id_especie: 0, nombre: '', tipo: '' };
  private initialEtapaState: EtapaModel = { id_etapa: 0, id_especie: 0, nombre_etapa: '', edad_inicio: 0, edad_fin: 0 };

  private subscriptions = new Subscription();

  constructor(
    private etapaService: EtapasService,
    private especieService: EspeciesService,
    private ingredienteService: IngredientesService,
    private cdRef: ChangeDetectorRef
  ) {
    this.selectedEtapa = { ...this.initialEtapaState };
    this.selectedEspecie = { ...this.initialEspecieState };
  }

  ngOnInit(): void {
    this.setEspecie();
    this.setEtapa();
    this.setIngrediente();
  }

  setEtapa() {
    this.etapaService.etapaSeleccionada$.subscribe((etapa) => {
      this.selectedEtapa = etapa ? etapa : { ...this.initialEtapaState };
      this.cdRef.detectChanges();
    });
  }
  setEspecie() {
    this.especieService.especieSeleccionada$.subscribe((especie) => {
      this.selectedEspecie = especie ? especie : { ...this.initialEspecieState };
      this.cdRef.detectChanges();
    });
  }
  setIngrediente() {
    this.ingredienteService.ingredienteSeleccionado$.subscribe((ingredientes) => {
      this.selectedIngredientes = ingredientes || [];
      this.cdRef.detectChanges();
    });
  }

  onFormular(): void {
    this.isLoading = true;
    this.formulationResult = null;
    this.formulationError = null;

    if (this.peso <= 0) {
      this.formulationError = "El peso a formular debe ser mayor que cero.";
      this.isLoading = false;
      return;
    }
    if (!this.selectedEspecie || this.selectedEspecie.id_especie === 0) {
      this.formulationError = "Por favor, seleccione una especie.";
      this.isLoading = false;
      return;
    }
    if (!this.selectedEtapa || this.selectedEtapa.id_etapa === 0) {
      this.formulationError = "Por favor, seleccione una etapa de desarrollo.";
      this.isLoading = false;
      return;
    }
    if (this.selectedIngredientes.length === 0) {
      this.formulationError = "Por favor, seleccione al menos un ingrediente.";
      this.isLoading = false;
      return;
    }

    optimizeFormulation(
      this.peso,
      this.selectedEspecie,
      this.selectedEtapa,
      this.selectedIngredientes,
      this.ingredienteService, 
      this.etapaService       
    ).subscribe({
      next: (result) => {
        if (result.hasOwnProperty('error')) {
          this.formulationError = (result as { error: string }).error;
          this.formulationResult = null;
          this.clearChartData(); // Clear charts on error
        } else {
          this.formulationResult = result as { solution: Record<string, number>, cost: number };
          this.formulationError = null;
          this.updateCharts(); // Update charts with new data
        }
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error("Error en la formulación:", err);
        this.formulationError = "Ocurrió un error inesperado durante la formulación. Intente de nuevo.";
        this.formulationResult = null;
        this.clearChartData(); // Clear charts on error
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  private updateCharts(): void {
    if (!this.formulationResult || !this.formulationResult.solution) {
      this.clearChartData();
      return;
    }

    // Pie Chart Data
    this.pieChartLabels = Object.keys(this.formulationResult.solution);
    const pieData = Object.values(this.formulationResult.solution);
    this.pieChartDatasets = {
        labels: this.pieChartLabels,
        datasets: [{ data: pieData }]
    };


    // Bar Chart Data (Simulated Nutrient Analysis)
    // These are very rough placeholder calculations for simulation purposes
    const simulatedProvidedNutrients = {
      'Proteína': 0,
      'Grasa': 0,
      'Fibra': 0,
      'Calcio': 0,
      'Fósforo': 0
    };

    // Simulate nutrient contribution from each ingredient in the solution
    for (const [ingredientName, amount] of Object.entries(this.formulationResult.solution)) {
      // These percentages are completely arbitrary for simulation
      simulatedProvidedNutrients['Proteína'] += amount * (Math.random() * 0.15 + 0.05); // 5-20% protein sim
      simulatedProvidedNutrients['Grasa'] += amount * (Math.random() * 0.10 + 0.02);  // 2-12% fat sim
      simulatedProvidedNutrients['Fibra'] += amount * (Math.random() * 0.08 + 0.02);  // 2-10% fiber sim
      simulatedProvidedNutrients['Calcio'] += amount * (Math.random() * 0.01 + 0.001); // 0.1-1.1% calcium sim
      simulatedProvidedNutrients['Fósforo'] += amount * (Math.random() * 0.008 + 0.001); // 0.1-0.9% phosphorus sim
    }
    
    const providedData = this.barChartLabels.map(label => 
        +(simulatedProvidedNutrients[label as keyof typeof simulatedProvidedNutrients] * 1000).toFixed(2) // in grams
    );

    // Simulate minimum required nutrients (e.g., grams per target weight)
    // These are placeholders and should ideally come from dynamic requirements
    const scaledTargetWeightKg = this.peso; // Assuming this.peso is in kg
    const requiredMinData = [
      200 * (scaledTargetWeightKg / 100), // Protein g per 100kg, scaled
      50  * (scaledTargetWeightKg / 100), // Fat g per 100kg, scaled
      30  * (scaledTargetWeightKg / 100), // Fiber g per 100kg, scaled
      8   * (scaledTargetWeightKg / 100), // Calcium g per 100kg, scaled
      4   * (scaledTargetWeightKg / 100)  // Phosphorus g per 100kg, scaled
    ].map(val => +val.toFixed(2));


    this.barChartDatasets = {
        labels: this.barChartLabels,
        datasets: [
          { data: providedData, label: 'Aportado en la Mezcla (g)' },
          { data: requiredMinData, label: 'Mínimo Requerido (g)' }
        ]
    };
    
    // Trigger change detection for charts as data objects might be updated
    this.cdRef.detectChanges();
  }

  private clearChartData(): void {
    this.pieChartLabels = [];
    this.pieChartDatasets = { labels: [], datasets: [{ data: [] }] };
    
    this.barChartDatasets = { 
        labels: this.barChartLabels, // Keep labels, clear data
        datasets: [
          { data: [], label: 'Aportado en la Mezcla (g)' },
          { data: [], label: 'Mínimo Requerido (g)' }
        ]
    };
     this.cdRef.detectChanges();
  }


  onLimpiar(): void {
    this.peso = 0;
    this.selectedIngredientes = [];
    this.formulationResult = null;
    this.formulationError = null;
    this.isLoading = false;
    this.clearChartData(); // Clear charts

    this.selectedEspecie = { ...this.initialEspecieState };
    this.especieService.setEspecieSeleccionada(null); 
    if (this.searchEspecieComponent) {
      this.searchEspecieComponent.removeItem(); 
    }
    
    this.selectedEtapa = { ...this.initialEtapaState };
    this.etapaService.setEtapaSeleccionada(null); 

    this.ingredienteService.setIngredienteSeleccionado(null); 

    this.cdRef.detectChanges();
  }

  public getSolutionAsArray(solution: Record<string, number> | undefined | null): { key: string; value: number }[] {
    if (!solution) {
      return [];
    }
    return Object.entries(solution).map(([key, value]) => ({ key, value }));
  }

  public trackIngredient(index: number, item: IngredienteConPrecio): number | string {
    return item.id || item.Nombre_Ingrediente;
  }

  onIngredientesSelectionChange(ingredientes: IngredienteConPrecio[]) {
    this.selectedIngredientes = ingredientes;
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
