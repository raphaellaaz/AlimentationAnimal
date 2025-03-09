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

import { EspeciesServiceService } from '../../../services/especies-service.service';

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
  optionsEspecies: string[] = []; //api data from endpoint
  filteredOptions!: Observable<string[]>;
  // Lista de seleccionados
  selectedEspecies: string[] = [];

  constructor(private especiesService: EspeciesServiceService) {}


  ngOnInit(){
    this.especiesService.getAllEspecies().subscribe(data => {
      this.optionsEspecies = data.map(( especies: any) => especies.nombre);
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsEspecies.filter(option => option.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any) {
    const selectedValue = event.option.value;
    
    if (!this.selectedEspecies.includes(selectedValue)) {
      this.selectedEspecies.push(selectedValue);
    }

    this.myControl.setValue(''); // Limpiar el input después de seleccionar
  }

  removeItem(item: string) {
    this.selectedEspecies = this.selectedEspecies.filter(option => option !== item);
  }
}
