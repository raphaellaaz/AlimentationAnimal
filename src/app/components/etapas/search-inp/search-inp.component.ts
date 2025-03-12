import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

import { EtapasService } from '../../../services/etapas-service.service';
import { EspeciesService } from '../../../services/especies-service.service';


import { EtapaModel } from '../../../models/etapa-desarrollo.model';



@Component({
  selector: 'app-searchetapa-inp',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './search-inp.component.html',
  styleUrl: './search-inp.component.css'
})
export class SearchInpComponent implements OnInit {

  myControl = new FormControl('');
  allEtapas: EtapaModel[] = []; //api data from endpoint
  optionsEtapas: EtapaModel[] = []; //Guardar datos de etapas filter by id especie
  filteredOptions!: Observable<EtapaModel[]>;
  // Lista de seleccionados
  selectedEtapas: EtapaModel[] = [];
  especieId: number = 0;

  constructor( private apiEtapas: EtapasService, private especieService: EspeciesService  ){}

  ngOnInit(): void {
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    

    this.apiEtapas.getAllEtapas().subscribe(data => { 
      this.allEtapas = data.map((etapas: EtapaModel) => ({
        id_etapa: etapas.id_etapa,
        id_especie: etapas.id_especie,
        nombre_etapa: etapas.nombre_etapa,
        edad_inicio: etapas.edad_inicio,
        edad_fin: etapas.edad_fin,
        descripcion: etapas.descripcion,
      }));
      console.log(this.allEtapas);
    });


    
    this.especieService.especieSeleccionada$.subscribe(id => {
      if (id !== null) {
        this.especieId = id;
        console.log('ID de Especie recibido:', this.especieId);

        // Filtrar y mapear las etapas una vez que tenemos el id_especie
        this.optionsEtapas = this.allEtapas.filter((etapas: EtapaModel) => 
          etapas.id_especie === this.especieId
        )
        console.log(this.optionsEtapas);  // Aquí debería salir el resultado filtrado
      }
    });

  }


  private _filter(value: string): EtapaModel[] {
    //const filterValue = value.toLowerCase();
    const filterValue = typeof value === 'string'  ? value.toLowerCase() : '';
    return this.optionsEtapas.filter(option => option.nombre_etapa.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any) {
    const selectedValue = event.option.value;
    
    if (!this.selectedEtapas.includes(selectedValue)) {
      this.selectedEtapas.push(selectedValue);
    }

    this.myControl.setValue(''); // Limpiar el input después de seleccionar
  }

  removeItem(item: EtapaModel) {
    this.selectedEtapas = this.selectedEtapas.filter(option => option.nombre_etapa !== item.nombre_etapa);
  }

}
