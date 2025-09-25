import {
  InputField,
  FormulaValidationResult,
  LaTeXConversionResult,
} from "@/types/calculator";
import { evaluate } from "mathjs";

export class FormulaEngine {
  /**
   * Validates a JavaScript formula against available inputs
   */
  static validateFormula(
    formula: string,
    inputs: InputField[]
  ): FormulaValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!formula.trim()) {
      return {
        isValid: false,
        errors: ["Formula cannot be empty"],
        warnings: [],
      };
    }

    // Check for undefined variables
    const inputIds = inputs.map((input) => input.id);
    const variableRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
    const variables = formula.match(variableRegex) || [];

    const undefinedVars = variables.filter(
      (variable) =>
        !inputIds.includes(variable) &&
        ![
          "Math",
          "sqrt",
          "log",
          "sin",
          "cos",
          "tan",
          "pow",
          "abs",
          "floor",
          "ceil",
        ].includes(variable)
    );

    if (undefinedVars.length > 0) {
      errors.push(`Undefined variables: ${undefinedVars.join(", ")}`);
    }

    // Test formula with sample values
    try {
      const sampleValues: Record<string, number> = {};
      inputs.forEach((input) => {
        sampleValues[input.id] = 1; // Use 1 as sample value
      });

      evaluate(formula, sampleValues);
    } catch (error) {
      errors.push(
        `Formula syntax error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Converts JavaScript formula to LaTeX with smart formatting
   */
  static convertToLaTeX(
    formula: string,
    inputs: InputField[],
    outputSymbol: string
  ): LaTeXConversionResult {
    try {
      let latex = formula;

      // Replace input IDs with their symbols
      inputs.forEach((input) => {
        const regex = new RegExp(`\\b${input.id}\\b`, "g");
        latex = latex.replace(regex, input.symbol || input.id);
      });

      // Convert Math functions
      latex = latex.replace(/Math\.sqrt\(/g, "\\sqrt{");
      latex = latex.replace(/Math\.log\(/g, "\\ln(");
      latex = latex.replace(/Math\.sin\(/g, "\\sin(");
      latex = latex.replace(/Math\.cos\(/g, "\\cos(");
      latex = latex.replace(/Math\.tan\(/g, "\\tan(");
      latex = latex.replace(/Math\.abs\(/g, "\\left|");
      latex = latex.replace(/Math\.pow\(/g, "\\text{pow}(");

      // Convert operators
      latex = latex.replace(/\*\*/g, "^"); // Power operator
      latex = latex.replace(/\*/g, " \\cdot ");
      latex = latex.replace(/\^/g, "^");

      // Convert division to fractions (smart detection)
      latex = this.convertDivisionToFraction(latex);

      // Handle parentheses
      latex = latex.replace(/\\sqrt\{([^}]+)\)/g, "\\sqrt{$1}");
      latex = latex.replace(/\\ln\(([^)]+)\)/g, "\\ln($1)");
      latex = latex.replace(/\\left\|([^|]+)\)/g, "\\left|$1\\right|");

      // Handle scientific notation
      latex = latex.replace(
        /(\d+\.?\d*)\s*e\s*([+-]?\d+)/g,
        "$1 \\times 10^{$2}"
      );

      // Add output symbol
      const result = `${outputSymbol} = ${latex}`;

      return {
        latex: result,
        isValid: true,
        errors: [],
      };
    } catch (error) {
      return {
        latex: `${outputSymbol} = ${formula}`,
        isValid: false,
        errors: [
          `LaTeX conversion error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        ],
      };
    }
  }

  /**
   * Smart division to fraction conversion
   */
  private static convertDivisionToFraction(latex: string): string {
    // Simple cases: a / b
    latex = latex.replace(
      /([a-zA-Z0-9_]+)\s*\/\s*([a-zA-Z0-9_]+)/g,
      "\\frac{$1}{$2}"
    );

    // Complex cases: (a + b) / (c + d)
    latex = latex.replace(/\(([^)]+)\)\s*\/\s*\(([^)]+)\)/g, "\\frac{$1}{$2}");

    return latex;
  }

  /**
   * Generate LaTeX template suggestions
   */
  static getLaTeXTemplates(): Array<{
    name: string;
    template: string;
    description: string;
  }> {
    return [
      {
        name: "Fraction",
        template: "\\frac{numerator}{denominator}",
        description: "Create a fraction",
      },
      {
        name: "Square Root",
        template: "\\sqrt{expression}",
        description: "Square root",
      },
      {
        name: "Natural Log",
        template: "\\ln(expression)",
        description: "Natural logarithm",
      },
      {
        name: "Power",
        template: "base^{exponent}",
        description: "Exponentiation",
      },
      {
        name: "Multiplication",
        template: "a \\cdot b",
        description: "Multiplication dot",
      },
      {
        name: "Scientific Notation",
        template: "1.23 \\times 10^{-4}",
        description: "Scientific notation",
      },
      {
        name: "Parentheses",
        template: "\\left( expression \\right)",
        description: "Scaled parentheses",
      },
      {
        name: "Greek Alpha",
        template: "\\alpha",
        description: "Greek letter alpha",
      },
      {
        name: "Greek Beta",
        template: "\\beta",
        description: "Greek letter beta",
      },
      {
        name: "Greek Epsilon",
        template: "\\varepsilon",
        description: "Greek letter epsilon",
      },
      {
        name: "Sum",
        template: "\\sum_{i=1}^{n} expression",
        description: "Summation",
      },
      {
        name: "Integral",
        template: "\\int_{a}^{b} expression \\, dx",
        description: "Integral",
      },
    ];
  }
}
