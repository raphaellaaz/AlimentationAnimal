import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Component, model, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { IngredienteModel } from '../../../models/ingrediente.model';

import { IngredientesService } from '../../../services/ingredientes-service.service';

@Component({
  selector: 'app-searchingrediente-inp',
  imports: [
    MatCheckboxModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatChipsModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './search-inp.component.html',
  styleUrl: './search-inp.component.css',
})
export class SearchInpComponent implements OnInit {
  myControl = new FormControl('');
  optionsIngredientes: IngredienteModel[] = []; //api data from endpoint
  filteredOptions!: Observable<IngredienteModel[]>;
  // Lista de seleccionados
  selectedIngredientes: IngredienteModel[] = [];

  constructor(private ingredienteService: IngredientesService) {}

  ngOnInit() {
    this.ingredienteService.getAllIngredientes().subscribe((data) => {
      this.optionsIngredientes = data.map(
        (ingredientes: IngredienteModel) => ingredientes
      );
      console.log(this.optionsIngredientes);
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): IngredienteModel[] {
    //const filterValue = value.toLowerCase();

    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';

    return this.optionsIngredientes.filter((option) =>
      option.Nombre_Ingrediente.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any) {
    const selectedValue = event.option.value;
    console.log(selectedValue);

    if (!this.selectedIngredientes.includes(selectedValue)) {
      this.selectedIngredientes.push(selectedValue);
    }
    this.myControl.setValue(''); // Limpiar el input después de seleccionar
    console.log(this.selectedIngredientes);
    this.ingredienteService.setIngredienteSeleccionado(this.selectedIngredientes);
  }

  removeItem(item: IngredienteModel) {
    this.selectedIngredientes = this.selectedIngredientes.filter(
      (option) => option.Nombre_Ingrediente !== item.Nombre_Ingrediente
    );
  }
}
