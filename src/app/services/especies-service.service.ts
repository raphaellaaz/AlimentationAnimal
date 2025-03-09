import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspeciesServiceService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://127.0.0.1:3000/especies'; // URL de la API

   // Obtener todos los ingredientes
   getAllEspecies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener un ingredientes por ID
  getEspecie(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un ingredientes
  crearEspecie(especie: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, especie);
  }

  // Actualizar un ingredientes
  actualizarEspecie(id: number, especie: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, especie);
  }

  // Eliminar un ingredientes
  eliminarEspecie(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
