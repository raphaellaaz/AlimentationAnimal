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

  // New method to get nutrient requirements for formulation
  getNutrientRequirementsByEspecieAndEtapa(idEspecie: number, idEtapa: number): Observable<any[]> {
    // SIMULATED DATA: Replace with actual backend call and proper NutrientRequirement type
    console.log(`EtapasService: Fetching simulated nutrient requirements for especie ID: ${idEspecie}, etapa ID: ${idEtapa}`);
    
    let requirements: any[] = [];

    // Example: Requirements vary based on especieId or etapaId
    if (idEspecie === 1) { // Assuming Especie 1 (e.g., Pollo)
      if (idEtapa === 1) { // Etapa 1 (e.g., Inicio)
        requirements = [
          { nutrient: "proteina", minValue: 22, maxValue: 24 },
          { nutrient: "grasa", minValue: 5, maxValue: 7 },
          { nutrient: "fibra", minValue: 3, maxValue: 5 },
          { nutrient: "calcio", minValue: 0.9, maxValue: 1.1 },
          { nutrient: "fosforo", minValue: 0.45, maxValue: 0.55 }
        ];
      } else { // Otra etapa para Especie 1
        requirements = [
          { nutrient: "proteina", minValue: 18, maxValue: 20 },
          { nutrient: "grasa", minValue: 6, maxValue: 8 },
          { nutrient: "fibra", minValue: 4, maxValue: 6 },
          { nutrient: "calcio", minValue: 0.8, maxValue: 1.0 },
          { nutrient: "fosforo", minValue: 0.4, maxValue: 0.5 }
        ];
      }
    } else { // Default o para otras especies
      requirements = [
        { nutrient: "proteina", minValue: 15, maxValue: 25 },
        { nutrient: "grasa", minValue: 4, maxValue: 10 },
        { nutrient: "fibra", minValue: 2, maxValue: 8 },
      ];
    }
    // Ensure all required nutrients by the optimizer are present, even if with broad ranges or just minValue
    const allNutrients = ["proteina", "grasa", "fibra", "calcio", "fosforo"]; // Add any other nutrient names used by optimizer
    allNutrients.forEach(nutName => {
        if (!requirements.find(r => r.nutrient === nutName)) {
            requirements.push({ nutrient: nutName, minValue: 0, maxValue: 100}); // Default broad range
        }
    });


    return new BehaviorSubject(requirements).asObservable();
  }
}
