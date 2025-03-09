import { Especie } from './especie.model';
import { Dieta } from './dieta.model';

export interface EtapaDesarrollo {
    id_etapa: number;
    id_especie: number;
    nombre_etapa: string;
    edad_inicio: number;
    edad_fin: number;
    descripcion?: string;
    dietas?: Dieta[];
    especies: Especie;
}
