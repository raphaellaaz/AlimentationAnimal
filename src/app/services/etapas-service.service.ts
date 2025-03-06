import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtapasServiceService {

    constructor(private http: HttpClient) { }
    private apiUrl = 'http://127.0.0.1:3000/etapas-desarrollo'; // URL de la API
  
    // Obtener todos los etapas
    getUsuarios(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }
  
    // Obtener un etapas por ID
    getUsuario(id: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
  
    // Crear un etapas
    crearUsuario(usuario: any): Observable<any> {
      return this.http.post<any>(this.apiUrl, usuario);
    }
  
    // Actualizar un etapas
    actualizarUsuario(id: number, usuario: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
    }
  
    // Eliminar un etapa
    eliminarUsuario(id: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
  }


