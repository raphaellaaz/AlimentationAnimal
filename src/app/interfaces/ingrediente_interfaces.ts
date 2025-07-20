import { IngredienteModel } from "../models/ingrediente.model";

export interface IngredienteConPrecio extends IngredienteModel {
  precio: number;
  //peso: number;

    // Nutrientes
    NUTRIENTES: Record<string, number>; //añadido a la funcion de formulation
  
    // Energía
    ENERGIA: Record<string, number>;  //no añadido a la funcion de formulation
  
    // Digestibilidad
    DIGESTIBILIDAD: Record<string, number>; //no añadido a la funcion de formulation

    MISC: Record<string, number>
    // Otros campos opcionales
  }
  

interface Restricion{
  name: string,
  values: Record<string,number>;
}


export interface Restricciones{
  PROTEINA: Restricion[]
  ENERGIA: Restricion[]
  MINERALES: Restricion[]
  AMINOACIDOS: Restricion[]
  
}


  // Nutrientes principales
  //nutrientes: {
  //  proteina: number;
  //  grasa: number;
  //  carbohidratos: number;
  //  fibra: number;
  //  calcio: number;
  //  fosforo: number;
  //  magnesio: number;
  //  potasio: number;
  //  sodio: number;
  //  cloro: number;
  //  azufre: number;
  //  vitE: number;
  //  biotina: number;
  //  colina: number;
  //  acidosGrasos: {
  //    C14_0: number;
  //    C16_0: number;
  //    C16_1: number;
  //    C18_0: number;
  //    C18_1: number;
  //    C18_2: number;
  //    C18_3: number;
  //    C20: number;
  //  };
  //  aminoAcidos: {
  //    lys: number;
  //    met: number;
  //    thr: number;
  //    trp: number;
  //    ile: number;
  //    val: number;
  //    arg: number;
  //    glyeq: number;
  //  };
  //};
//
  //// Energía
  //energia: {
  //  EM_RTES_Kcal_kg: number;
  //  UFL_UF_kg: number;
  //  UFC_UF_kg: number;
  //  ENL_RTES_Kcal_kg: number;
  //  ENM_RTES_Kcal_kg: number;
  //  ENC_RTES_Kcal_kg: number;
  //};
//
  //// Digestibilidad
  //digestibilidad: {
  //  PBDIG_RUM: number;
  //  PBDIG_PORC: number;
  //  PBDIG_AVES: number;
  //  PBDIG_CON: number;
  //  PBDIG_CAB: number;
  //  PDIA: number;
  //  PDIE: number;
  //  PDIN: number;
  //};

  // Otros campos opcionales
