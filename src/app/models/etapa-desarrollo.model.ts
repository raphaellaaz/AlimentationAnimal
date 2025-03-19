import { EspecieModel } from './especie.model';
import { DietaModel } from './dieta.model';

export interface EtapaModel {
    id_etapa: number;
    id_especie: number;
    nombre_etapa: string;
    edad_inicio: number;
    edad_fin: number;
    descripcion?: string;
    dietas?: DietaModel[];
    especies?: EspecieModel;
}
