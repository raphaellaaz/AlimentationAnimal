import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { IngredienteConPrecio, Restricciones} from '../interfaces/ingrediente_interfaces';
import { MetodosCalculate } from '../interfaces/metodos.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class FormulationpyService {
  private apiUrl = `${environment.API_URL}calculate/do`; // URL de la API
 
   constructor(private http: HttpClient) { }
 
   // Hacer calculos
   //createIngrediente(tipocalculo: MetodosCalculate,ingredientesconprecio: IngredienteConPrecio[], restricciones, minmax): Observable<Ingrediente> {
    createCalc(
      ingredientesconprecio: IngredienteConPrecio[],
      peso_total: number,
      restricciones: Restricciones | null,
      metodo?: MetodosCalculate,
      
    ): Observable<any> {
      const payload = {
        ingredientesconprecio,
        peso_total,
        restricciones,
        metodo,
      };
      console.log(restricciones);
      return this.http.post<any>(this.apiUrl, payload);
    }
    
   
}


