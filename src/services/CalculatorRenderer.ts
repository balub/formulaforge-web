import { Calculator, InputField, OutputField } from "@/types/calculator";
import { FormulaEngine } from "./FormulaEngine";

export class CalculatorRenderer {
  /**
   * Render input field as HTML form element
   */
  static renderInputField(
    input: InputField,
    value: number | undefined,
    onChange: (value: number) => void,
    error?: string
  ): React.ReactElement {
    const baseProps = {
      id: input.id,
      placeholder: `${input.placeholder} (${input.unit})`,
      value: value || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        onChange(isNaN(val) ? 0 : val);
      },
      className: error ? "border-destructive" : "",
    };

    switch (input.type) {
      case "number":
        return (
          <input
            {...baseProps}
            type="number"
            min={input.min}
            max={input.max}
            step={input.step || 0.01}
          />
        );
      case "text":
        return (
          <input
            {...baseProps}
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(parseFloat(e.target.value) || 0);
            }}
          />
        );
      case "select":
        return (
          <select
            {...baseProps}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              onChange(parseFloat(e.target.value) || 0);
            }}
          >
            {input.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return <input {...baseProps} type="number" />;
    }
  }

  /**
   * Render output field with calculation result
   */
  static renderOutputField(
    output: OutputField,
    result: number | undefined,
    unit: string
  ): React.ReactElement {
    return (
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="text-2xl font-bold text-primary">
          {result !== undefined ? result : "—"}
          {result !== undefined && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {unit}
            </span>
          )}
        </div>
      </div>
    );
  }

  /**
   * Render mathematical formula with LaTeX
   */
  static renderFormula(
    output: OutputField,
    inputs: InputField[]
  ): React.ReactElement {
    const latexFormula =
      output.formula_display ||
      FormulaEngine.convertToLaTeX(output.formula, inputs, output.symbol).latex;

    return (
      <div className="bg-background/80 p-4 rounded border">
        <div className="text-center">
          <div className="text-lg font-medium text-muted-foreground mb-2">
            {output.label}
          </div>
          <div className="bg-background/80 p-4 rounded border">
            {/* This would use MathDisplay component */}
            <div className="text-lg font-mono">{latexFormula}</div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Generate calculator metadata for display
   */
  static generateMetadata(calculator: Calculator) {
    return {
      id: calculator.id,
      title: calculator.title,
      description: calculator.description,
      category: calculator.category,
      tags: calculator.tags,
      inputCount: calculator.inputs.length,
      outputCount: calculator.outputs.length,
      complexity: this.calculateComplexity(calculator),
      lastUpdated: calculator.updated_at,
    };
  }

  /**
   * Calculate complexity score based on formula complexity
   */
  private static calculateComplexity(calculator: Calculator): number {
    let complexity = 0;

    calculator.outputs.forEach((output) => {
      // Count operators
      complexity += (output.formula.match(/[+\-*/^]/g) || []).length;

      // Count functions
      complexity += (output.formula.match(/Math\.\w+/g) || []).length;

      // Count parentheses
      complexity += (output.formula.match(/[()]/g) || []).length;
    });

    return Math.min(complexity, 10); // Cap at 10
  }

  /**
   * Generate calculator summary for cards
   */
  static generateSummary(calculator: Calculator): string {
    const inputNames = calculator.inputs.map((i) => i.label).join(", ");
    const outputNames = calculator.outputs.map((o) => o.label).join(", ");

    return `Calculate ${outputNames} from ${inputNames}`;
  }

  /**
   * Validate calculator for rendering
   */
  static validateForRendering(calculator: Calculator): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!calculator.inputs.length) {
      errors.push("No inputs defined");
    }

    if (!calculator.outputs.length) {
      errors.push("No outputs defined");
    }

    // Check if all outputs have valid formulas
    calculator.outputs.forEach((output, index) => {
      if (!output.formula.trim()) {
        errors.push(`Output ${index + 1} has no formula`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
