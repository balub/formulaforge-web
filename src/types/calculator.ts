export interface InputField {
  id: string;
  label: string;
  symbol: string;
  unit: string;
  type: "number" | "text" | "select";
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder: string;
  options?: Array<{ value: string; label: string }>;
}

export interface OutputField {
  id: string;
  label: string;
  symbol: string;
  unit: string;
  formula: string;
  formula_display?: string;
  description?: string;
}

export interface Calculator {
  id: string;
  title: string;
  description: string;
  category?: string;
  inputs: InputField[];
  outputs: OutputField[];
  created_at?: string;
  updated_at?: string;
}

export interface CalculatorFormData {
  title: string;
  description: string;
  inputs: Omit<InputField, "id">[];
  outputs: Omit<OutputField, "id">[];
  category?: string;
}

export interface FormulaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface LaTeXConversionResult {
  latex: string;
  isValid: boolean;
  errors: string[];
}
