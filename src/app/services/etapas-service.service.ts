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
    getAllEtapas(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }
  
    // Obtener un etapas por ID
    getEtapa(id: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
  
    // Crear un etapas
    crearEtapa(usuario: any): Observable<any> {
      return this.http.post<any>(this.apiUrl, usuario);
    }
  
    // Actualizar un etapas
    actualizarEtapa(id: number, usuario: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
    }
  
    // Eliminar un etapa
    eliminarEtapa(id: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
  }


