import { Component, OnInit } from '@angular/core';
import { IngredientesService } from './services/ingredientes-service.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormdataComponent } from './components/formdata/formdata.component';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { EspeciesService } from './services/especies-service.service';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@Component({
  imports: [RouterOutlet, FormdataComponent, MatCardModule, RouterLinkActive, RouterLink, SidenavComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit{
  title = 'frontanimal';

  constructor(private apiIngredientes: IngredientesService, private apiEspecies: EspeciesService) {}

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
