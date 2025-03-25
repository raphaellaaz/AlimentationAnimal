import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IngredienteModel as Ingrediente } from '../models/ingrediente.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientesService {
  private apiUrl = `${environment.API_URL}ingredientes`; // URL de la API

  constructor(private http: HttpClient) { }


  private ingredienteSeleccionado = new BehaviorSubject<Ingrediente[] | null>(null);
  ingredienteSeleccionado$ = this.ingredienteSeleccionado.asObservable();
    
  setIngredienteSeleccionado(ingrediente: Ingrediente[] | null) {
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
}
