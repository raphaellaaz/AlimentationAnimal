
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DietasService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://127.0.0.1:3000/dieta'; // URL de la API

   // Obtener todos los ingredientes
   getAllDietas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener un ingredientes por ID
  getDietas(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un ingredientes
  crearDieta(dieta: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dieta);
  }

  // Actualizar un ingredientes
  actualizarDieta(id: number, dieta: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dieta);
  }

  // Eliminar un ingredientes
  eliminarDieta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

