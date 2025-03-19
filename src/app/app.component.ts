import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IngredientesServiceService } from './services/ingredientes-service.service';
import { FormdataComponent } from './components/formdata/formdata.component';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { EspeciesService } from './services/especies-service.service';

@Component({
  imports: [RouterOutlet, FormdataComponent, MatCardModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit{
  title = 'frontanimal';

  constructor(private apiIngredientes: IngredientesServiceService, private apiEspecies: EspeciesService) {}

  ngOnInit() {
    //this.apiIngredientes.getAllIngredientes().subscribe(
    //  (data) => {
    //    console.log('Datos recibidos:', data);
    //  },
    //  (error) => {
    //    console.error('Error en la conexión:', error);
    //  }
    //);
    //this.apiEspecies.getAllEspecies().subscribe(
    //  (data) => {
    //    console.log('Datos recibidos:', data);
    //  },
    //  (error) => {
    //    console.error('Error en la conexión:', error);
    //  }
    //);
  }
  
  

}
