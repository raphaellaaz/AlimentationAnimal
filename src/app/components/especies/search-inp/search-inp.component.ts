import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {isEmpty, map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';

import { EspeciesService } from '../../../services/especies-service.service';

import { EspecieModel } from '../../../models/especie.model';

@Component({
  selector: 'app-searchespecie-inp',
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
  standalone: true,
  templateUrl: './search-inp.component.html',
  styleUrl: './search-inp.component.css'
})
export class SearchInpComponent implements OnInit{

  myControl = new FormControl('');
  optionsEspecies: EspecieModel[] = []; //api data from endpoint
  filteredOptions!: Observable<EspecieModel[]>;
  // Lista de seleccionados
  selectedEspecies: EspecieModel | null = null;

  constructor(private especiesService: EspeciesService) {
  }

  ngOnInit(){
    this.especiesService.getAllEspecies().subscribe(  //obtenemos todos los datos de Especies
      data => {
      this.optionsEspecies = data.map(( especies: EspecieModel) =>({
          id_especie: especies.id_especie,
          nombre: especies.nombre,
          tipo: especies.tipo
      }));
      console.log(data)
    });

    this.filteredOptions = this.myControl.valueChanges.pipe( //filtramos segun lo que se escribe
      startWith(''),
      map(value => this._filter(value || '' ))
    );
  }

  private _filter(value: string): EspecieModel[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    //const filterValue = value.toLowerCase();
    return this.optionsEspecies.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any) { //cuando se selecciona se obtniene el valor del seleccionadp 
    const selectedValue = event.option.value;
    console.log(selectedValue)
    
    this.especiesService.setEspecieSeleccionada(selectedValue)

    this.selectedEspecies = selectedValue;

    this.myControl.setValue(''); 
  }

  removeItem() {
    this.selectedEspecies = null;
    // this.selectedEspecies = this.selectedEspecies.filter(option => option.nombre !== item.nombre);
    this.especiesService.setEspecieSeleccionada(null);
  }
}
