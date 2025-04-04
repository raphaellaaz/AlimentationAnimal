import { 
    SimplexOptimizer,
    Ingredient,
    NutrientRequirement,
    FormulationProblem
  } from './simplexOptimizer';
  
  /**
   * Función para optimizar una formulación basada en precios ingresados por el usuario
   * @param ingredientesBase - Array con los ingredientes base (sin precios)
   * @param preciosIngresados - Objeto con los precios ingresados por el usuario
   * @param pesoTotal - Peso total deseado para la formulación
   * @param requisitosNutricionales - Requisitos nutricionales a cumplir
   * @param limitesMinimos - Límites mínimos para ciertos ingredientes (opcional)
   * @param limitesMaximos - Límites máximos para ciertos ingredientes (opcional)
   */
  function optimizarFormulacion(
    ingredientesBase: Array<{nombre: string, nutrientes: Record<string, number>}>,
    preciosIngresados: Record<string, number>,
    pesoTotal: number,
    requisitosNutricionales: NutrientRequirement[],
    limitesMinimos?: Record<string, number>,
    limitesMaximos?: Record<string, number>
  ) {
    // Crear los ingredientes con los precios ingresados por el usuario
    const ingredientes: Ingredient[] = ingredientesBase.map(ing => ({
      name: ing.nombre,
      costPerUnit: preciosIngresados[ing.nombre] || 0, // Usar 0 si no hay precio
      weightPerUnit: 1, // Usamos 1 como peso unitario estándar
      nutrients: ing.nutrientes
    }));
    
    // Crear el problema de formulación
    const problema: FormulationProblem = {
      ingredients: ingredientes,
      nutrientRequirements: requisitosNutricionales,
      targetWeight: pesoTotal,
      minIngredientAmounts: limitesMinimos,
      maxIngredientAmounts: limitesMaximos
    };
    
    // Resolver usando el optimizador Simplex
    const optimizador = new SimplexOptimizer(problema);
    try {
      const resultado = optimizador.solve();
      
      console.log("Formulación óptima:");
      for (const [ingrediente, cantidad] of Object.entries(resultado.solution)) {
        console.log(`${ingrediente}: ${cantidad.toFixed(2)} unidades`);
      }
      
      console.log(`\nCosto total: $${resultado.cost.toFixed(2)}`);
      
      // Validar la solución
      const esValida = optimizador.validateSolution(resultado.solution);
      console.log(`\nLa solución ${esValida ? 'cumple' : 'no cumple'} con todas las restricciones.`);
      
      // Mostrar análisis nutricional
      if (esValida) {
        mostrarAnalisisNutricional(problema, resultado.solution);
      }
      
      return resultado;
    } catch (error) {
      console.error("Error al resolver el problema:", error);
      throw error;
    }
  }
  
  /**
   * Muestra un análisis detallado de nutrientes de la formulación optimizada
   */
  function mostrarAnalisisNutricional(problema: FormulationProblem, solucion: Record<string, number>): void {
    console.log("\n=== ANÁLISIS NUTRICIONAL ===");
    
    // Obtener todos los nutrientes únicos de todos los ingredientes
    const todosLosNutrientes = new Set<string>();
    for (const ingrediente of problema.ingredients) {
      Object.keys(ingrediente.nutrients).forEach(nutriente => todosLosNutrientes.add(nutriente));
    }
    
    // Calcular nutrientes totales
    const nutrientesTotales: Record<string, number> = {};
    for (const nutriente of todosLosNutrientes) {
      nutrientesTotales[nutriente] = 0;
      
      for (const [nombreIngrediente, cantidad] of Object.entries(solucion)) {
        const ingrediente = problema.ingredients.find(ing => ing.name === nombreIngrediente);
        if (ingrediente) {
          nutrientesTotales[nutriente] += cantidad * (ingrediente.nutrients[nutriente] || 0);
        }
      }
    }
    
    // Mostrar resultados en formato de tabla
    console.log("Nutriente\tCantidad\tMín Req\tMáx Req\tEstado");
    console.log("----------------------------------------");
    
    for (const nutriente of todosLosNutrientes) {
      const cantidad = nutrientesTotales[nutriente];
      const requisito = problema.nutrientRequirements.find(req => req.nutrient === nutriente);
      
      let estado = "✓";
      if (requisito) {
        if (cantidad < requisito.minValue) {
          estado = "MUY BAJO";
        } else if (requisito.maxValue !== undefined && cantidad > requisito.maxValue) {
          estado = "MUY ALTO";
        }
        
        console.log(
          `${nutriente}\t${cantidad.toFixed(2)}\t${requisito.minValue}\t${requisito.maxValue || 'N/A'}\t${estado}`
        );
      } else {
        console.log(`${nutriente}\t${cantidad.toFixed(2)}\tN/A\tN/A\t${estado}`);
      }
    }
  }
  
  // Ejemplo de uso:
  // Datos de ejemplo - en tu caso estos vendrían de tu sistema
  const ingredientesDisponibles = [
    {
      nombre: "Maíz",
      nutrientes: { "proteina": 8.5, "grasa": 3.8, "fibra": 2.2, "calcio": 0.02, "fosforo": 0.3 }
    },
    {
      nombre: "Soya",
      nutrientes: { "proteina": 44, "grasa": 1.5, "fibra": 3.5, "calcio": 0.3, "fosforo": 0.65 }
    },
    {
      nombre: "Salvado",
      nutrientes: { "proteina": 15.7, "grasa": 4.3, "fibra": 10.8, "calcio": 0.14, "fosforo": 1.15 }
    }
  ];
  
  // En tu aplicación, estos precios los ingresaría el usuario
  const preciosIngresados = {
    "Maíz": 0.18,
    "Soya": 0.38,
    "Salvado": 0.15
  };
  
  // Definir requisitos nutricionales para el alimento
  const requisitosNutricionales: NutrientRequirement[] = [
    { nutrient: "proteina", minValue: 16, maxValue: 22 },
    { nutrient: "grasa", minValue: 2.5, maxValue: 5 },
    { nutrient: "fibra", minValue: 3, maxValue: 7 }
  ];
  
  // Ejecutar la optimización
  try {
    const resultado = optimizarFormulacion(
      ingredientesDisponibles,
      preciosIngresados,
      100, // Peso total deseado (100 kg, por ejemplo)
      requisitosNutricionales,
      { "Maíz": 20 }, // Mínimo 20% de maíz
      { "Soya": 40 }  // Máximo 40% de soya
    );
  } catch (error) {
    console.error("Error en la optimización:", error);
  }