   interface Ingredient {
    name: string;
    costPerUnit: number;
    weightPerUnit: number;
    nutrients: Record<string, number>; // nutriente -> cantidad por unidad
  }
  
  interface NutrientRequirement {
    nutrient: string;
    minValue: number;
    maxValue?: number; // Opcional, para restricciones superiores
  }
  
  interface FormulationProblem {
    ingredients: Ingredient[];
    nutrientRequirements: NutrientRequirement[];
    targetWeight: number;
    minIngredientAmounts?: Record<string, number>; // ingrediente -> cantidad mínima
    maxIngredientAmounts?: Record<string, number>; // ingrediente -> cantidad máxima
  }
  
  interface SimplexTableau {
    objective: number[];
    constraints: number[][];
    rightHandSide: number[];
    basicVariables: number[];
  }
  
  class SimplexOptimizer {
    private problem: FormulationProblem;
    private tableau: SimplexTableau;
    private numVariables: number;
    private numConstraints: number;
    private numSlackVariables: number;
    private numArtificialVariables: number;
  
    constructor(problem: FormulationProblem) {
      this.problem = problem;
      this.numVariables = problem.ingredients.length;
      
      // Calcular número de restricciones
      // - Una restricción para el peso total
      // - Una para cada requisito mínimo de nutriente
      // - Una para cada requisito máximo de nutriente (si está definido)
      // - Una para cada límite mínimo de ingrediente (si está definido)
      // - Una para cada límite máximo de ingrediente (si está definido)
      this.numConstraints = 1; // Restricción de peso inicialmente
      
      // Añadir restricciones de nutrientes
      for (const req of problem.nutrientRequirements) {
        this.numConstraints++; // restricción mínima
        if (req.maxValue !== undefined) this.numConstraints++; // restricción máxima
      }
      
      // Añadir restricciones de cantidades mínimas y máximas de ingredientes
      if (problem.minIngredientAmounts) {
        this.numConstraints += Object.keys(problem.minIngredientAmounts).length;
      }
      if (problem.maxIngredientAmounts) {
        this.numConstraints += Object.keys(problem.maxIngredientAmounts).length;
      }
      
      this.numSlackVariables = this.numConstraints;
      this.numArtificialVariables = 0; // Se determina durante la inicialización
      
      this.tableau = this.initializeTableau();
    }
  
    private initializeTableau(): SimplexTableau {
      // Se creará una matriz ampliada con:
      // - Una fila para la función objetivo
      // - Una fila para cada restricción
      // - Columnas para cada variable original
      // - Columnas para cada variable de holgura/exceso
      // - Columnas para cada variable artificial (si es necesaria)
      // - Una columna para los valores del lado derecho (RHS)
      
      const numTotalVariables = this.numVariables + this.numSlackVariables;
      const objective: number[] = new Array(numTotalVariables).fill(0);
      const constraints: number[][] = [];
      const rightHandSide: number[] = new Array(this.numConstraints).fill(0);
      const basicVariables: number[] = new Array(this.numConstraints).fill(0);
      
      // Configurar la función objetivo (minimizar costo)
      for (let i = 0; i < this.numVariables; i++) {
        objective[i] = this.problem.ingredients[i].costPerUnit;
      }
      
      // Inicializar la matriz de restricciones con ceros
      for (let i = 0; i < this.numConstraints; i++) {
        constraints.push(new Array(numTotalVariables).fill(0));
      }
      
      let constraintIndex = 0;
      
      // Restricción de peso total
      for (let i = 0; i < this.numVariables; i++) {
        constraints[constraintIndex][i] = this.problem.ingredients[i].weightPerUnit;
      }
      // Añadir variable de holgura para la restricción de peso
      constraints[constraintIndex][this.numVariables + constraintIndex] = 1;
      rightHandSide[constraintIndex] = this.problem.targetWeight;
      basicVariables[constraintIndex] = this.numVariables + constraintIndex;
      constraintIndex++;
      
      // Restricciones de nutrientes
      for (const req of this.problem.nutrientRequirements) {
        // Restricción de valor mínimo: sum(a_ij * x_j) >= b_j
        for (let i = 0; i < this.numVariables; i++) {
          const nutrientContent = this.problem.ingredients[i].nutrients[req.nutrient] || 0;
          constraints[constraintIndex][i] = nutrientContent;
        }
        // Para una restricción >= añadimos una variable de holgura negativa (variable de exceso)
        constraints[constraintIndex][this.numVariables + constraintIndex] = -1;
        rightHandSide[constraintIndex] = req.minValue;
        basicVariables[constraintIndex] = this.numVariables + constraintIndex;
        constraintIndex++;
        
        // Restricción de valor máximo (si existe): sum(a_ij * x_j) <= b_j
        if (req.maxValue !== undefined) {
          for (let i = 0; i < this.numVariables; i++) {
            const nutrientContent = this.problem.ingredients[i].nutrients[req.nutrient] || 0;
            constraints[constraintIndex][i] = -nutrientContent; // Invertimos el signo para <= 
          }
          // Para una restricción <= añadimos una variable de holgura positiva
          constraints[constraintIndex][this.numVariables + constraintIndex] = 1;
          rightHandSide[constraintIndex] = -req.maxValue; // Invertimos el signo
          basicVariables[constraintIndex] = this.numVariables + constraintIndex;
          constraintIndex++;
        }
      }
      
      // Restricciones de cantidades mínimas de ingredientes
      if (this.problem.minIngredientAmounts) {
        for (const [ingredientName, minAmount] of Object.entries(this.problem.minIngredientAmounts)) {
          const ingredientIndex = this.problem.ingredients.findIndex(ing => ing.name === ingredientName);
          if (ingredientIndex !== -1) {
            constraints[constraintIndex][ingredientIndex] = 1;
            constraints[constraintIndex][this.numVariables + constraintIndex] = -1; // Variable de exceso
            rightHandSide[constraintIndex] = minAmount;
            basicVariables[constraintIndex] = this.numVariables + constraintIndex;
            constraintIndex++;
          }
        }
      }
      
      // Restricciones de cantidades máximas de ingredientes
      if (this.problem.maxIngredientAmounts) {
        for (const [ingredientName, maxAmount] of Object.entries(this.problem.maxIngredientAmounts)) {
          const ingredientIndex = this.problem.ingredients.findIndex(ing => ing.name === ingredientName);
          if (ingredientIndex !== -1) {
            constraints[constraintIndex][ingredientIndex] = -1; // Invertimos para <=
            constraints[constraintIndex][this.numVariables + constraintIndex] = 1; // Variable de holgura
            rightHandSide[constraintIndex] = -maxAmount; // Invertimos el signo
            basicVariables[constraintIndex] = this.numVariables + constraintIndex;
            constraintIndex++;
          }
        }
      }
      
      return { objective, constraints, rightHandSide, basicVariables };
    }
  
    private findEnteringVariable(): number {
      // Encuentra la variable con el coeficiente más negativo en la función objetivo
      let minValue = 0; // Buscamos valores negativos para maximizar (o < 0 para minimizar)
      let enteringVar = -1;
      
      for (let j = 0; j < this.tableau.objective.length; j++) {
        if (this.tableau.objective[j] < minValue) {
          minValue = this.tableau.objective[j];
          enteringVar = j;
        }
      }
      
      return enteringVar;
    }
  
    private findLeavingVariable(enteringVar: number): number {
      let minRatio = Infinity;
      let leavingVar = -1;
      
      for (let i = 0; i < this.numConstraints; i++) {
        if (this.tableau.constraints[i][enteringVar] > 0) {
          const ratio = this.tableau.rightHandSide[i] / this.tableau.constraints[i][enteringVar];
          if (ratio < minRatio) {
            minRatio = ratio;
            leavingVar = i;
          }
        }
      }
      
      return leavingVar;
    }
  
    private pivot(enteringVar: number, leavingVar: number): void {
      // Normalizar la fila del pivot
      const pivotValue = this.tableau.constraints[leavingVar][enteringVar];
      for (let j = 0; j < this.tableau.constraints[leavingVar].length; j++) {
        this.tableau.constraints[leavingVar][j] /= pivotValue;
      }
      this.tableau.rightHandSide[leavingVar] /= pivotValue;
      
      // Actualizar las demás filas
      for (let i = 0; i < this.numConstraints; i++) {
        if (i !== leavingVar) {
          const factor = this.tableau.constraints[i][enteringVar];
          for (let j = 0; j < this.tableau.constraints[i].length; j++) {
            this.tableau.constraints[i][j] -= factor * this.tableau.constraints[leavingVar][j];
          }
          this.tableau.rightHandSide[i] -= factor * this.tableau.rightHandSide[leavingVar];
        }
      }
      
      // Actualizar la función objetivo
      const factor = this.tableau.objective[enteringVar];
      for (let j = 0; j < this.tableau.objective.length; j++) {
        this.tableau.objective[j] -= factor * this.tableau.constraints[leavingVar][j];
      }
      
      // Actualizar la variable básica
      this.tableau.basicVariables[leavingVar] = enteringVar;
    }
  
    public solve(): { solution: Record<string, number>, cost: number } {
      let iteration = 0;
      const MAX_ITERATIONS = 100; // Prevenir bucles infinitos
      
      while (iteration < MAX_ITERATIONS) {
        const enteringVar = this.findEnteringVariable();
        if (enteringVar === -1) {
          break; // Solución óptima encontrada
        }
        
        const leavingVar = this.findLeavingVariable(enteringVar);
        if (leavingVar === -1) {
          throw new Error("El problema no tiene solución acotada");
        }
        
        this.pivot(enteringVar, leavingVar);
        iteration++;
      }
      
      if (iteration >= MAX_ITERATIONS) {
        throw new Error("No se pudo converger a una solución en el número máximo de iteraciones");
      }
      
      // Extraer la solución
      const solution: Record<string, number> = {};
      let cost = 0;
      
      // Inicializar todos los ingredientes a 0
      for (const ingredient of this.problem.ingredients) {
        solution[ingredient.name] = 0;
      }
      
      // Actualizar los valores de las variables básicas
      for (let i = 0; i < this.numConstraints; i++) {
        const basicVarIndex = this.tableau.basicVariables[i];
        if (basicVarIndex < this.numVariables) {
          solution[this.problem.ingredients[basicVarIndex].name] = this.tableau.rightHandSide[i];
        }
      }
      
      // Calcular el costo total
      for (let i = 0; i < this.problem.ingredients.length; i++) {
        cost += solution[this.problem.ingredients[i].name] * this.problem.ingredients[i].costPerUnit;
      }
      
      return { solution, cost };
    }
    
    // Método para verificar si la solución cumple con todas las restricciones
    public validateSolution(solution: Record<string, number>): boolean {
      // Verificar restricción de peso
      let totalWeight = 0;
      for (const [ingredientName, amount] of Object.entries(solution)) {
        const ingredient = this.problem.ingredients.find(ing => ing.name === ingredientName);
        if (ingredient) {
          totalWeight += amount * ingredient.weightPerUnit;
        }
      }
      
      if (Math.abs(totalWeight - this.problem.targetWeight) > 0.001) {
        console.error(`La restricción de peso no se cumple: ${totalWeight} != ${this.problem.targetWeight}`);
        return false;
      }
      
      // Verificar restricciones de nutrientes
      for (const req of this.problem.nutrientRequirements) {
        let totalNutrient = 0;
        for (const [ingredientName, amount] of Object.entries(solution)) {
          const ingredient = this.problem.ingredients.find(ing => ing.name === ingredientName);
          if (ingredient) {
            totalNutrient += amount * (ingredient.nutrients[req.nutrient] || 0);
          }
        }
        
        if (totalNutrient < req.minValue) {
          console.error(`Requisito mínimo de ${req.nutrient} no satisfecho: ${totalNutrient} < ${req.minValue}`);
          return false;
        }
        
        if (req.maxValue !== undefined && totalNutrient > req.maxValue) {
          console.error(`Requisito máximo de ${req.nutrient} excedido: ${totalNutrient} > ${req.maxValue}`);
          return false;
        }
      }
      
      // Verificar restricciones de cantidades mínimas
      if (this.problem.minIngredientAmounts) {
        for (const [ingredientName, minAmount] of Object.entries(this.problem.minIngredientAmounts)) {
          if ((solution[ingredientName] || 0) < minAmount) {
            console.error(`Cantidad mínima de ${ingredientName} no satisfecha: ${solution[ingredientName]} < ${minAmount}`);
            return false;
          }
        }
      }
      
      // Verificar restricciones de cantidades máximas
      if (this.problem.maxIngredientAmounts) {
        for (const [ingredientName, maxAmount] of Object.entries(this.problem.maxIngredientAmounts)) {
          if ((solution[ingredientName] || 0) > maxAmount) {
            console.error(`Cantidad máxima de ${ingredientName} excedida: ${solution[ingredientName]} > ${maxAmount}`);
            return false;
          }
        }
      }
      
      return true;
    }
  }
  
  // Ejemplo de uso
  export function optimizeFormulation(): void {
    // Definir ingredientes con su costo, peso y valores nutricionales
    const ingredients: Ingredient[] = [
      {
        name: "Harina",
        costPerUnit: 2.5,
        weightPerUnit: 1,
        nutrients: { "proteina": 10, "grasa": 1, "carbohidratos": 70 }
      },
      {
        name: "Azucar",
        costPerUnit: 3.0,
        weightPerUnit: 1,
        nutrients: { "proteina": 0, "grasa": 0, "carbohidratos": 99 }
      },
      {
        name: "Huevo",
        costPerUnit: 5.0,
        weightPerUnit: 0.5,
        nutrients: { "proteina": 13, "grasa": 11, "carbohidratos": 1 }
      },
      {
        name: "Leche",
        costPerUnit: 1.8,
        weightPerUnit: 1,
        nutrients: { "proteina": 3.3, "grasa": 3.6, "carbohidratos": 4.7 }
      }
    ];
    
    // Definir requisitos nutricionales
    const nutrientRequirements: NutrientRequirement[] = [
      { nutrient: "proteina", minValue: 20, maxValue: 50 },
      { nutrient: "grasa", minValue: 10, maxValue: 30 },
      { nutrient: "carbohidratos", minValue: 40 }
    ];
    
    // Crear el problema de formulación
    const problem: FormulationProblem = {
      ingredients: ingredients,
      nutrientRequirements: nutrientRequirements,
      targetWeight: 100, // kg, g, etc.
      minIngredientAmounts: {
        "Huevo": 5
      },
      maxIngredientAmounts: {
        "Azucar": 20
      }
    };
    
    // Resolver usando el optimizador Simplex
    const optimizer = new SimplexOptimizer(problem);
    try {
      const result = optimizer.solve();
      
      console.log("Formulación óptima:");
      for (const [ingredient, amount] of Object.entries(result.solution)) {
        console.log(`${ingredient}: ${amount.toFixed(2)}`);
      }
      
      console.log(`\nCosto total: $${result.cost.toFixed(2)}`);
      
      // Validar la solución
      const isValid = optimizer.validateSolution(result.solution);
      console.log(`\nLa solución ${isValid ? 'cumple' : 'no cumple'} con todas las restricciones.`);
    } catch (error) {
      console.error("Error al resolver el problema:");
    }
  }
  
  // Ejecutar el ejemplo
  // optimizeFormulation();
  
  export type { 
    SimplexOptimizer,// class
    Ingredient, //interface
    NutrientRequirement, //interface
    FormulationProblem //interface
  };