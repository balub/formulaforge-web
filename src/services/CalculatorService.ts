import {
  Calculator,
  CalculatorFormData,
  InputField,
  OutputField,
} from "@/types/calculator";
import { FormulaEngine } from "./FormulaEngine";

export class CalculatorService {
  /**
   * Generate a unique ID for a calculator
   */
  static generateId(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  /**
   * Generate a unique ID for input/output fields
   */
  static generateFieldId(prefix: "input" | "output"): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a new calculator from form data
   */
  static createCalculator(formData: CalculatorFormData): Calculator {
    const id = this.generateId(formData.title);

    // Generate IDs for inputs and outputs
    const inputs: InputField[] = formData.inputs.map((input) => ({
      ...input,
      id: this.generateFieldId("input"),
    }));

    const outputs: OutputField[] = formData.outputs.map((output) => {
      const outputWithId = {
        ...output,
        id: this.generateFieldId("output"),
      };

      // Auto-generate formula_display if not provided
      if (!output.formula_display && output.formula) {
        const conversion = FormulaEngine.convertToLaTeX(
          output.formula,
          inputs,
          output.symbol || output.id
        );
        if (conversion.isValid) {
          outputWithId.formula_display = conversion.latex;
        }
      }

      return outputWithId;
    });

    return {
      id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      inputs,
      outputs,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Validate a calculator
   */
  static validateCalculator(calculator: Calculator): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!calculator.title.trim()) {
      errors.push("Title is required");
    }

    if (!calculator.description.trim()) {
      errors.push("Description is required");
    }

    if (calculator.inputs.length === 0) {
      errors.push("At least one input is required");
    }

    if (calculator.outputs.length === 0) {
      errors.push("At least one output is required");
    }

    // Validate inputs
    calculator.inputs.forEach((input, index) => {
      if (!input.label.trim()) {
        errors.push(`Input ${index + 1}: Label is required`);
      }
      if (!input.symbol.trim()) {
        errors.push(`Input ${index + 1}: Symbol is required`);
      }
    });

    // Validate outputs
    calculator.outputs.forEach((output, index) => {
      if (!output.label.trim()) {
        errors.push(`Output ${index + 1}: Label is required`);
      }
      if (!output.symbol.trim()) {
        errors.push(`Output ${index + 1}: Symbol is required`);
      }
      if (!output.formula.trim()) {
        errors.push(`Output ${index + 1}: Formula is required`);
      }

      // Validate formula
      const validation = FormulaEngine.validateFormula(
        output.formula,
        calculator.inputs
      );
      if (!validation.isValid) {
        errors.push(`Output ${index + 1}: ${validation.errors.join(", ")}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Export calculator to JSON
   */
  static exportToJSON(calculator: Calculator): string {
    return JSON.stringify(calculator, null, 2);
  }

  /**
   * Import calculator from JSON
   */
  static importFromJSON(json: string): Calculator {
    try {
      const data = JSON.parse(json);

      // Validate required fields
      if (!data.title || !data.description || !data.inputs || !data.outputs) {
        throw new Error("Invalid calculator format");
      }

      return data as Calculator;
    } catch (error) {
      throw new Error(
        `Failed to import calculator: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Create default input field
   */
  static createDefaultInput(): Omit<InputField, "id"> {
    return {
      label: "",
      symbol: "",
      unit: "",
      type: "number",
      required: true,
      placeholder: "Enter value",
    };
  }

  /**
   * Create default output field
   */
  static createDefaultOutput(): Omit<OutputField, "id"> {
    return {
      label: "",
      symbol: "",
      unit: "",
      formula: "",
    };
  }
}
