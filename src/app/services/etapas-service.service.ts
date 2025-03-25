import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EtapaModel as EtapaDesarrollo } from '../models/etapa-desarrollo.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class EtapasService {
  private apiUrl = `${environment.API_URL}etapas-desarrollo`; // URL de la API

  constructor(private http: HttpClient) { }

  private etapaSeleccionada = new BehaviorSubject<EtapaDesarrollo | null>(null);
  etapaSeleccionada$ = this.etapaSeleccionada.asObservable();
  
  setEtapaSeleccionada(etapa: EtapaDesarrollo) {
    this.etapaSeleccionada.next(etapa);
  }


  // Obtener todas las etapas
  getAllEtapas(): Observable<EtapaDesarrollo[]> {
    return this.http.get<EtapaDesarrollo[]>(this.apiUrl);

  }

  // Obtener una etapa por ID
  getEtapa(id: number): Observable<EtapaDesarrollo> {
    return this.http.get<EtapaDesarrollo>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva etapa
  crearEtapa(etapa: EtapaDesarrollo): Observable<EtapaDesarrollo> {
    return this.http.post<EtapaDesarrollo>(this.apiUrl, etapa);
  }

  // Actualizar una etapa
  actualizarEtapa(id: number, etapa: EtapaDesarrollo): Observable<EtapaDesarrollo> {
    return this.http.put<EtapaDesarrollo>(`${this.apiUrl}/${id}`, etapa);
  }

  // Eliminar una etapa
  eliminarEtapa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
