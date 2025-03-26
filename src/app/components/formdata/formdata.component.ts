import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SearchInpComponent as SearchEspecie } from '../especies/search-inp/search-inp.component';
import { SearchInpComponent as SearchIngrediente } from '../ingredientes/search-inp/search-inp.component';
import { SearchInpComponent as SearchEtapa } from '../etapas/search-inp/search-inp.component';
import { MatButtonModule } from '@angular/material/button';


import { SimplexOptimizer } from '../../formulation/formulation';
import { EtapasService } from '../../services/etapas-service.service';
import { EspeciesService } from '../../services/especies-service.service';
import { IngredientesService } from '../../services/ingredientes-service.service';

import { EtapaModel } from '../../models/etapa-desarrollo.model';
import { EspecieModel } from '../../models/especie.model';
import { IngredienteModel } from '../../models/ingrediente.model';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { MatListModule } from '@angular/material/list';

import { RouterLink } from '@angular/router';
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
    SearchEspecie,
    SearchIngrediente,
    SearchEtapa,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatListModule,
    RouterLink,
    
  ],
  templateUrl: './formdata.component.html',
  styleUrl: './formdata.component.css',
})
export class FormdataComponent implements OnInit {

  displayedColumns: string[] = ['label', 'value'];

  formulario = new FormControl('', [Validators.required]);
  peso: number = 0;

  selectedEtapa: EtapaModel; 
  selectedEspecie: EspecieModel;
  selectedIngredientes: IngredienteModel[] = [];
  
  
  
  constructor(
    private etapaService: EtapasService,
    private especieService: EspeciesService,
    private ingredienteService: IngredientesService,
    private cdRef: ChangeDetectorRef
  ) {
    this.selectedEtapa = {
      id_etapa: 0,
      id_especie: 0,
      nombre_etapa: '',
      edad_inicio: 0,
      edad_fin: 0,
    },
    this.selectedEspecie={
      id_especie: 0,
      nombre: '',
      tipo: ''
    }
   };


  onChangeValue(event: Event) {
    this.peso = Number((event.target as HTMLInputElement).value);
    console.log(this.peso);
  }

  ngOnInit(): void {
    
    this.setEspecie();
    this.setEtapa();
    this.setIngrediente();

  }

  
  setEtapa(){
    this.etapaService.etapaSeleccionada$.subscribe((etapa) => { /// Etapa Selccionada
      if (etapa !== null) {
        this.selectedEtapa = etapa;
        console.log('Etapa recibido en right:', this.selectedEtapa);
        this.cdRef.detectChanges();
      }
    });
  }
  setEspecie(){
    this.especieService.especieSeleccionada$.subscribe((especie) => {  /// Especie Selccionada
      if (especie !== null) {
        this.selectedEspecie = especie;
        console.log('Especie recibido en right:', this.selectedEspecie);
        this.cdRef.detectChanges();
      }
    });
  }
  setIngrediente(){
    this.ingredienteService.ingredienteSeleccionado$.subscribe((ingrediente) => {  /// Especie Selccionada
      if (ingrediente !== null) {
        this.selectedIngredientes = ingrediente;
        console.log('Especie recibido:', this.selectedEspecie);
        this.cdRef.detectChanges();
      }
    });
  }





}
