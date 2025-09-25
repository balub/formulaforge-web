import { Calculator } from "@/types/calculator";
import { CalculatorService } from "./CalculatorService";

export class CalculatorJSONService {
  /**
   * Export calculator to JSON with proper formatting
   */
  static exportToJSON(calculator: Calculator): string {
    const exportData = {
      ...calculator,
      // Add metadata
      exported_at: new Date().toISOString(),
      // Ensure proper formatting
      inputs: calculator.inputs.map((input) => ({
        ...input,
        // Ensure all required fields are present
        type: input.type || "number",
        required: input.required !== false,
        placeholder: input.placeholder || "Enter value",
      })),
      outputs: calculator.outputs.map((output) => ({
        ...output,
        // Ensure formula_display is present
        formula_display:
          output.formula_display ||
          this.generateFormulaDisplay(
            output.formula,
            calculator.inputs,
            output.symbol
          ),
      })),
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import calculator from JSON with validation
   */
  static importFromJSON(json: string): Calculator {
    try {
      const data = JSON.parse(json);

      // Validate required fields
      const requiredFields = [
        "id",
        "title",
        "description",
        "inputs",
        "outputs",
      ];
      const missingFields = requiredFields.filter((field) => !data[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Validate inputs
      if (!Array.isArray(data.inputs)) {
        throw new Error("Inputs must be an array");
      }

      // Validate outputs
      if (!Array.isArray(data.outputs)) {
        throw new Error("Outputs must be an array");
      }

      // Ensure all inputs have required fields
      data.inputs = data.inputs.map((input: any, index: number) => {
        if (!input.id) input.id = `input_${Date.now()}_${index}`;
        if (!input.type) input.type = "number";
        if (input.required === undefined) input.required = true;
        if (!input.placeholder) input.placeholder = "Enter value";
        return input;
      });

      // Ensure all outputs have required fields
      data.outputs = data.outputs.map((output: any, index: number) => {
        if (!output.id) output.id = `output_${Date.now()}_${index}`;
        if (!output.formula) output.formula = "";
        return output;
      });

      // Validate the complete calculator
      const validation = CalculatorService.validateCalculator(data);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
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
   * Generate formula display from JavaScript formula
   */
  private static generateFormulaDisplay(
    formula: string,
    inputs: any[],
    symbol: string
  ): string {
    if (!formula.trim()) return "";

    // Simple conversion for display
    let display = formula;

    // Replace input IDs with symbols
    inputs.forEach((input) => {
      const regex = new RegExp(`\\b${input.id}\\b`, "g");
      display = display.replace(regex, input.symbol || input.id);
    });

    // Basic LaTeX conversions
    display = display.replace(/\*/g, " \\cdot ");
    display = display.replace(/\//g, " / ");

    return `${symbol} = ${display}`;
  }

  /**
   * Convert calculator to different formats
   */
  static convertToFormat(
    calculator: Calculator,
    format: "json" | "yaml" | "csv"
  ): string {
    switch (format) {
      case "json":
        return this.exportToJSON(calculator);

      case "yaml":
        return this.convertToYAML(calculator);

      case "csv":
        return this.convertToCSV(calculator);

      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Convert to YAML format
   */
  private static convertToYAML(calculator: Calculator): string {
    // Simple YAML conversion (you might want to use a proper YAML library)
    let yaml = `id: ${calculator.id}\n`;
    yaml += `title: "${calculator.title}"\n`;
    yaml += `description: "${calculator.description}"\n`;
    yaml += `category: "${calculator.category || ""}"\n`;
    yaml += `inputs:\n`;

    calculator.inputs.forEach((input) => {
      yaml += `  - id: ${input.id}\n`;
      yaml += `    label: "${input.label}"\n`;
      yaml += `    symbol: "${input.symbol}"\n`;
      yaml += `    unit: "${input.unit}"\n`;
      yaml += `    type: "${input.type}"\n`;
      yaml += `    required: ${input.required}\n`;
    });

    yaml += `outputs:\n`;
    calculator.outputs.forEach((output) => {
      yaml += `  - id: ${output.id}\n`;
      yaml += `    label: "${output.label}"\n`;
      yaml += `    symbol: "${output.symbol}"\n`;
      yaml += `    unit: "${output.unit}"\n`;
      yaml += `    formula: "${output.formula}"\n`;
      if (output.formula_display) {
        yaml += `    formula_display: "${output.formula_display}"\n`;
      }
    });

    return yaml;
  }

  /**
   * Convert to CSV format
   */
  private static convertToCSV(calculator: Calculator): string {
    let csv = "Type,Label,Symbol,Unit,Formula,Formula Display\n";

    // Add inputs
    calculator.inputs.forEach((input) => {
      csv += `Input,"${input.label}","${input.symbol}","${input.unit}","",""\n`;
    });

    // Add outputs
    calculator.outputs.forEach((output) => {
      csv += `Output,"${output.label}","${output.symbol}","${output.unit}","${
        output.formula
      }","${output.formula_display || ""}"\n`;
    });

    return csv;
  }

  /**
   * Generate calculator documentation
   */
  static generateDocumentation(calculator: Calculator): string {
    let doc = `# ${calculator.title}\n\n`;
    doc += `${calculator.description}\n\n`;

    if (calculator.category) {
      doc += `**Category:** ${calculator.category}\n\n`;
    }

    doc += `## Inputs\n\n`;
    calculator.inputs.forEach((input, index) => {
      doc += `${index + 1}. **${input.label}** (${input.symbol})\n`;
      doc += `   - Unit: ${input.unit}\n`;
      doc += `   - Type: ${input.type}\n`;
      doc += `   - Required: ${input.required ? "Yes" : "No"}\n`;
      if (input.min !== undefined) doc += `   - Minimum: ${input.min}\n`;
      if (input.max !== undefined) doc += `   - Maximum: ${input.max}\n`;
      doc += `\n`;
    });

    doc += `## Outputs\n\n`;
    calculator.outputs.forEach((output, index) => {
      doc += `${index + 1}. **${output.label}** (${output.symbol})\n`;
      doc += `   - Unit: ${output.unit}\n`;
      doc += `   - Formula: \`${output.formula}\`\n`;
      if (output.formula_display) {
        doc += `   - Display: $${output.formula_display}$\n`;
      }
      doc += `\n`;
    });

    return doc;
  }
}
