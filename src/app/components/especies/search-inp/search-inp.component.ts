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
  selectedEspecies: EspecieModel[] = [];

  constructor(private especiesService: EspeciesService) {
  }


  ngOnInit(){

    this.especiesService.getAllEspecies().subscribe(
      data => {
      this.optionsEspecies = data.map(( especies: EspecieModel) =>({
          id_especie: especies.id_especie,
          nombre: especies.nombre,
          tipo: especies.tipo
      }));
      console.log(data)
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '' ))
      
    );
  }

  private _filter(value: string): EspecieModel[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    //const filterValue = value.toLowerCase();
    return this.optionsEspecies.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any) {
    const selectedValue = event.option.value;
    
    this.especiesService.setEspecieSeleccionada(selectedValue.id_especie)

    if (!this.selectedEspecies.includes(selectedValue)) {
      this.selectedEspecies.push(selectedValue);
    }

    this.myControl.setValue(''); // Limpiar el input después de seleccionar
  }

  removeItem(item: EspecieModel) {
    this.selectedEspecies = this.selectedEspecies.filter(option => option.nombre !== item.nombre);
  }
}
