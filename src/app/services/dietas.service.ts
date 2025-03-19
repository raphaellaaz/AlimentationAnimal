import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DietaModel } from '../models/dieta.model'; // Importación correcta
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class DietasService {

  private apiUrl = `${environment.API_URL}/dieta`; // URL de la API

  constructor(private http: HttpClient) { }

  // Obtener todas las dietas
  getAllDietas(): Observable<DietaModel[]> {
    return this.http.get<DietaModel[]>(this.apiUrl);
  }

  // Obtener una dieta por ID
  getDieta(id: number): Observable<DietaModel> {
    return this.http.get<DietaModel>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva dieta
  crearDieta(dieta: DietaModel): Observable<DietaModel> {
    return this.http.post<DietaModel>(this.apiUrl, dieta);
  }

  // Actualizar una dieta existente
  actualizarDieta(id: number, dieta: DietaModel): Observable<DietaModel> {
    return this.http.put<DietaModel>(`${this.apiUrl}/${id}`, dieta);
  }

  // Eliminar una dieta por ID
  eliminarDieta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
