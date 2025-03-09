import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especie } from '../models/especie.model';

@Injectable({
  providedIn: 'root'
})
export class EspeciesService {

  private apiUrl = 'http://127.0.0.1:3000/especies'; // URL de la API

  constructor(private http: HttpClient) { }

  // Obtener todas las especies
  getAllEspecies(): Observable<Especie[]> {
    return this.http.get<Especie[]>(this.apiUrl);
  }

  // Obtener una especie por ID
  getEspecie(id: number): Observable<Especie> {
    return this.http.get<Especie>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva especie
  crearEspecie(especie: Especie): Observable<Especie> {
    return this.http.post<Especie>(this.apiUrl, especie);
  }

  // Actualizar una especie
  actualizarEspecie(id: number, especie: Especie): Observable<Especie> {
    return this.http.put<Especie>(`${this.apiUrl}/${id}`, especie);
  }

  // Eliminar una especie
  eliminarEspecie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
