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
  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  // Actualizar un ingredientes
  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
  }

  // Eliminar un ingredientes
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }




}
