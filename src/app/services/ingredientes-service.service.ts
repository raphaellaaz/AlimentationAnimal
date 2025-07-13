import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IngredienteModel as Ingrediente } from '../models/ingrediente.model';
import { environment } from '../../environments/environment';
import { IngredienteConPrecio } from '../interfaces/ingrediente_interfaces';

@Injectable({
  providedIn: 'root'
})
export class IngredientesService {
  private apiUrl = `${environment.API_URL}ingredientes`; // URL de la API

  constructor(private http: HttpClient) { }


  private ingredienteSeleccionado = new BehaviorSubject<IngredienteConPrecio[] | null>(null);
  ingredienteSeleccionado$ = this.ingredienteSeleccionado.asObservable();
    
  setIngredienteSeleccionado(ingrediente: IngredienteConPrecio[] | null) {
    this.ingredienteSeleccionado.next(ingrediente);
  }

  // Obtener todos los ingredientes
  getAllIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.apiUrl);
  }

  // Obtener un ingrediente por ID
  getIngrediente(id: number): Observable<Ingrediente> {
    return this.http.get<Ingrediente>(`${this.apiUrl}/${id}`);
  }

  // Crear un ingrediente
  createIngrediente(ingrediente: Ingrediente): Observable<Ingrediente> {
    return this.http.post<Ingrediente>(this.apiUrl, ingrediente);
  }

  // Actualizar un ingrediente
  updateIngrediente(id: number, ingrediente: Ingrediente): Observable<Ingrediente> {
    return this.http.put<Ingrediente>(`${this.apiUrl}/${id}`, ingrediente);
  }

  // Eliminar un ingrediente
  delIngrediente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  //// New method to get detailed ingredient data for formulation
  //getIngredienteDetailsById(id: number): Observable<{ weightPerUnit: number, nutrients: Record<string, number> }> {
  //  // SIMULATED DATA: Replace with actual backend call
  //  console.log(`IngredientesService: Fetching simulated details for ingredient ID: ${id}`);
  //  const simulatedNutrients: Record<string, number> = {
  //    "proteina": +(Math.random() * 25 + 5).toFixed(2), // Simulate 5-30% protein
  //    "grasa": +(Math.random() * 15 + 2).toFixed(2),    // Simulate 2-17% fat
  //    "fibra": +(Math.random() * 10 + 1).toFixed(2),     // Simulate 1-11% fiber
  //    "calcio": +(Math.random() * 2 + 0.1).toFixed(2),   // Simulate 0.1-2.1% calcium
  //    "fosforo": +(Math.random() * 1.5 + 0.1).toFixed(2) // Simulate 0.1-1.6% phosphorus
  //  };
  //  // For common ingredients, we can have slightly more realistic simulation
  //  if (id === 1) { // Example: Harina de Maiz
  //    simulatedNutrients["proteina"] = 8.5;
  //    simulatedNutrients["grasa"] = 3.9;
  //    simulatedNutrients["fibra"] = 7.3;
  //  } else if (id === 2) { // Example: Harina de Soja
  //    simulatedNutrients["proteina"] = 40;
  //    simulatedNutrients["grasa"] = 20;
  //    simulatedNutrients["fibra"] = 5;
  //  }
//
  //  const simulatedData = {
  //    weightPerUnit: 1, // Assuming costPerUnit is for 1 unit of weight (e.g., 1 kg)
  //    nutrients: simulatedNutrients
  //  };
  //  return new BehaviorSubject(simulatedData).asObservable(); // Using BehaviorSubject to ensure it emits value
  //}
}
