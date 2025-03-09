import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngredientesServiceService {
  private apiUrl = 'http://127.0.0.1:3000/ingredientes'; // URL de la API

  constructor(private http: HttpClient) { }

  // Obtener todos los ingredientes
  getAllIngredientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener un ingredientes por ID
  getIngrediente(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un ingredientes
  createIngrediente(ingrediente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ingrediente);
  }

  // Actualizar un ingredientes
  updateIngrediente(id: number, ingrediente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, ingrediente);
  }

  // Eliminar un ingredientes
  delIngrediente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}