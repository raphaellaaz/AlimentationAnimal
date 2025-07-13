export interface DietaModel {
    id_dieta: number;
    id_etapa: number;
    proteina_min: number,
    proteina_max: number,
    energia_min: number,
    energia_max: number,
    fibra_min: number,
    fibra_max: number
    suplementos?: string;
}
