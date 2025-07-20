import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { isEmpty, map, max, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common'; // Import CommonModule
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SearchInpComponent as SearchEspecieComponent } from '../especies/search-inp/search-inp.component'; // Renamed for clarity
import { SearchInpComponent as SearchIngredienteComponent } from '../ingredientes/search-inp/search-inp.component'; // Renamed for clarity
import { SearchInpComponent as SearchEtapaComponent } from '../etapas/search-inp/search-inp.component'; // Renamed for clarity
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import MatProgressSpinnerModule

import { EtapasService } from '../../services/etapas-service.service';
import { EspeciesService } from '../../services/especies-service.service';
import { IngredientesService } from '../../services/ingredientes-service.service';

import { EtapaModel } from '../../models/etapa-desarrollo.model';
import { EspecieModel } from '../../models/especie.model';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

import {
  IngredienteConPrecio,
  Restricciones,
} from '../../interfaces/ingrediente_interfaces';

//import { optimizeFormulation } from '../../formulation/formulation';
import { FormulationpyService } from '../../services/formulationpy.service';
import { DietasService } from '../../services/dietas.service';
import { DietaModel } from '../../models/dieta.model';

@Component({
  selector: 'app-formdata',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
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
    CommonModule, // Add CommonModule here for *ngIf, *ngFor etc.
    MatProgressSpinnerModule, // Add MatProgressSpinnerModule
  ],
  templateUrl: './formdata.component.html',
  styleUrl: './formdata.component.css',
})
export class FormdataComponent implements OnInit {
  @ViewChild(SearchEspecieComponent)
  searchEspecieComponent!: SearchEspecieComponent;
  // No ViewChild needed for SearchEtapaComponent if we clear through service
  // No ViewChild needed for SearchIngredienteComponent if we clear through service

  peso: number = 0;
  selectedEtapa!: EtapaModel | null; // Allow null for reset
  selectedEspecie!: EspecieModel | null; // Allow null for reset
  selectedIngredientes: IngredienteConPrecio[] = [];
  selectedDieta!: Restricciones | null;

  formulationResult: { solution: Record<string, number>; cost: number } | null =
    null;
  formulationError: string | null = null;
  isLoading: boolean = false;

  // Initial empty states
  private initialEspecieState: EspecieModel = {
    id_especie: 0,
    nombre: '',
    tipo: '',
  };
  private initialEtapaState: EtapaModel = {
    id_etapa: 0,
    id_especie: 0,
    nombre_etapa: '',
    edad_inicio: 0,
    edad_fin: 0,
  };

  constructor(
    private etapaService: EtapasService,
    private especieService: EspeciesService,
    private ingredienteService: IngredientesService,
    private formulation: FormulationpyService,
    private dietaService: DietasService,
    private cdRef: ChangeDetectorRef
  ) {
    this.selectedEtapa = { ...this.initialEtapaState };
    this.selectedEspecie = { ...this.initialEspecieState };
  }

  ngOnInit(): void {
    this.setEspecie();
    this.setEtapa();
    this.setIngrediente();
    this.setRestricciones();
  }

  setEtapa() {
    this.etapaService.etapaSeleccionada$.subscribe((etapa) => {
      this.selectedEtapa = etapa ? etapa : { ...this.initialEtapaState };
      console.log('Etapa seleccionada:', this.selectedEtapa);
      this.cdRef.detectChanges();
    });
  }

  setRestricciones() {
    //por defecto // modificables
    this.dietaService.etapaSeleccionada$.subscribe({
      next: (dieta) => {
        if (!dieta) {
          this.selectedDieta = null;
          return;
        }

        this.selectedDieta = {
          //posteriormente para advance que pueda especificar valores netos
          PROTEINA: [
            {
              name: 'humedad____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'cenizas____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'pb____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'ee____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'fb____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'fnd____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'fad____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'almidon____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'azucares____',
              values: { min: 0.1, max: 12 },
            },
          ],
          ENERGIA: [
            {
              name: 'em_rtes_kcal_kg',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'en_porc_kcal_kg',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'ema_aves_kcal_kg',
              values: { min: 0.1, max: 12 },
            },
          ],
          MINERALES: [
            {
              name: 'ca____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'p____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'na____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'cl____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'mg____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'k____',
              values: { min: 0.1, max: 12 },
            },
          ],
          AMINOACIDOS: [
            {
              name: 'lys____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'met____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'thr____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'trp____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'ile____',
              values: { min: 0.1, max: 12 },
            },
            {
              name: 'val____',
              values: { min: 0.1, max: 12 },
            },
          ]
        }

        console.log('Restricciones cargadas:', this.selectedDieta);

        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error al recibir la dieta seleccionada:', err);
        this.selectedDieta = null;
      },
    });
  }

  setEspecie() {
    this.especieService.especieSeleccionada$.subscribe((especie) => {
      this.selectedEspecie = especie
        ? especie
        : { ...this.initialEspecieState };
      console.log('Especie recibido:', this.selectedEspecie);
      this.cdRef.detectChanges();
    });
  }
  setIngrediente() {
    this.ingredienteService.ingredienteSeleccionado$.subscribe(
      (ingredientes) => {
        this.selectedIngredientes = ingredientes || [];
        console.log('Ingredientes seleccionados:', this.selectedIngredientes);
        this.cdRef.detectChanges();
      }
    );
  }

  onIngredientesSelectionChange(ingredientes: IngredienteConPrecio[]) {
    this.selectedIngredientes = ingredientes;
  }

  onFormular(): void {
    this.isLoading = true;
    this.formulationResult = null;
    this.formulationError = null;

    if (this.peso <= 0) {
      this.formulationError = 'El peso a formular debe ser mayor que cero.';
      this.isLoading = false;
      return;
    }
    if (!this.selectedEspecie || this.selectedEspecie.id_especie === 0) {
      this.formulationError = 'Por favor, seleccione una especie.';
      this.isLoading = false;
      return;
    }
    if (!this.selectedEtapa || this.selectedEtapa.id_etapa === 0) {
      this.formulationError = 'Por favor, seleccione una etapa de desarrollo.';
      this.isLoading = false;
      return;
    }
    if (this.selectedIngredientes.length === 0) {
      this.formulationError = 'Por favor, seleccione al menos un ingrediente.';
      this.isLoading = false;
      return;
    }

    this.formulation
      .createCalc(this.selectedIngredientes, this.peso, this.selectedDieta)
      .subscribe({
        next: (result) => {
          if (result.hasOwnProperty('error')) {
            this.formulationError = (result as { error: string }).error;
            this.formulationResult = null;
          } else {
            this.formulationResult = result as {
              solution: Record<string, number>;
              cost: number;
            };
            this.formulationError = null;
          }
          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Error en la formulación:', err);
          this.formulationError =
            'Ocurrió un error inesperado durante la formulación. Intente de nuevo.';
          this.formulationResult = null;
          this.isLoading = false;
          this.cdRef.detectChanges();
        },
      });
  }

  onLimpiar(): void {
    this.peso = 0;
    this.selectedIngredientes = [];
    this.formulationResult = null;
    this.formulationError = null;
    this.isLoading = false;

    // Reset selectedEspecie and notify service
    this.selectedEspecie = { ...this.initialEspecieState };
    this.especieService.setEspecieSeleccionada(null); // Notify service to clear
    if (this.searchEspecieComponent) {
      this.searchEspecieComponent.removeItem(); // Call child's clear method
    }

    // Reset selectedEtapa and notify service
    this.selectedEtapa = { ...this.initialEtapaState };
    this.etapaService.setEtapaSeleccionada(null); // Notify service to clear

    // Notify ingrediente service to clear
    this.ingredienteService.setIngredienteSeleccionado(null); // Or [] if that's how the service handles clear

    // Trigger change detection if needed, though ngModel and service changes should handle it
    this.cdRef.detectChanges();
  }

  // Helper method to convert solution object to an array for mat-table // Obtiene los resultados en un array para convertirlos en una tabla para mostrarlos
  public getSolutionAsArray(
    solution: Record<string, number> | undefined | null
  ): { key: string; value: number }[] {
    if (!solution) {
      return [];
    }
    return Object.entries(solution).map(([key, value]) => ({ key, value }));
  }

  // Optional: trackBy function for selectedIngredientes list for better performance
  public trackIngredient(
    index: number,
    item: IngredienteConPrecio
  ): number | string {
    return item.id || item.Nombre_Ingrediente; // Changed id_ingrediente to id
  }
}
