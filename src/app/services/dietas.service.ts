import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dieta } from '../models/dieta.model'; // Importación correcta

@Injectable({
  providedIn: 'root'
})
export class DietasService {

  private apiUrl = 'http://127.0.0.1:3000/dieta'; // URL de la API

  constructor(private http: HttpClient) { }

  // Obtener todas las dietas
  getAllDietas(): Observable<Dieta[]> {
    return this.http.get<Dieta[]>(this.apiUrl);
  }

  // Obtener una dieta por ID
  getDieta(id: number): Observable<Dieta> {
    return this.http.get<Dieta>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva dieta
  crearDieta(dieta: Dieta): Observable<Dieta> {
    return this.http.post<Dieta>(this.apiUrl, dieta);
  }

  // Actualizar una dieta existente
  actualizarDieta(id: number, dieta: Dieta): Observable<Dieta> {
    return this.http.put<Dieta>(`${this.apiUrl}/${id}`, dieta);
  }

  // Eliminar una dieta por ID
  eliminarDieta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
