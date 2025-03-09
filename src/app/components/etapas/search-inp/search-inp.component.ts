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
import { EtapasServiceService } from '../../../services/etapas-service.service';


@Component({
  selector: 'app-searchetapa-inp',
  imports: [],
  templateUrl: './search-inp.component.html',
  styleUrl: './search-inp.component.css'
})
export class SearchInpComponent implements OnInit {

  constructor( private apiEtapas: EtapasServiceService){}

  ngOnInit(): void {
    
  }

}
