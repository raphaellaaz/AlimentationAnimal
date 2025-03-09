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

import { IngredientesServiceService } from '../../../services/ingredientes-service.service';

@Component({
  selector: 'app-searchingrediente-inp',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatChipsModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './search-inp.component.html',
  styleUrl: './search-inp.component.css'
})
export class SearchInpComponent implements OnInit{
  myControl = new FormControl('');
    optionsIngredientes: string[] = []; //api data from endpoint
    filteredOptions!: Observable<string[]>;
    // Lista de seleccionados
    selectedIngredientes: string[] = [];
  
    constructor(private ingredienteService: IngredientesServiceService) {}
  
  
    ngOnInit(){
      this.ingredienteService.getAllIngredientes().subscribe(data => {
        this.optionsIngredientes = data.map(( ingredientes: any) => ingredientes.Nombre_Ingrediente);
        console.log(this.optionsIngredientes);
      });
  
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    }
  
    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.optionsIngredientes.filter(option => option.toLowerCase().includes(filterValue));
    }
  
    onOptionSelected(event: any) {
      const selectedValue = event.option.value;
      
      if (!this.selectedIngredientes.includes(selectedValue)) {
        this.selectedIngredientes.push(selectedValue);
      }
  
      this.myControl.setValue(''); // Limpiar el input después de seleccionar
    }
  
    removeItem(item: string) {
      this.selectedIngredientes = this.selectedIngredientes.filter(option => option !== item);
    }

}
