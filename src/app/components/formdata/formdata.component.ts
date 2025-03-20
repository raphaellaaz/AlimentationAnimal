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
import { SearchInpComponent as SearchEspecie} from '../especies/search-inp/search-inp.component';
import { SearchInpComponent as SearchIngrediente } from '../ingredientes/search-inp/search-inp.component';
import { SearchInpComponent as SearchEtapa } from '../etapas/search-inp/search-inp.component';
import {MatButtonModule} from '@angular/material/button';



import { SimplexOptimizer } from '../../formulation/formulation';
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
    RouterLink,
    
  ],
  templateUrl: './formdata.component.html',
  styleUrl: './formdata.component.css'
})
export class FormdataComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}