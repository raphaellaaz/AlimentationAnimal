import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IngredientesServiceService } from './services/ingredientes-service.service';


@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  title = 'frontanimal';


  constructor(private apiIngredientes: IngredientesServiceService) {}

  ngOnInit() {
    this.apiIngredientes.getAllIngredientes().subscribe(
      (data) => {
        console.log('Datos recibidos:', data);
      },
      (error) => {
        console.error('Error en la conexión:', error);
      }
    );
  }
  
  

}
