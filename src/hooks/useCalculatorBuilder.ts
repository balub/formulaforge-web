import { useState, useCallback, useMemo } from "react";
import {
  Calculator,
  CalculatorFormData,
  InputField,
  OutputField,
} from "@/types/calculator";
import { CalculatorService } from "@/services/CalculatorService";
import { FormulaEngine } from "@/services/FormulaEngine";

export const useCalculatorBuilder = () => {
  const [formData, setFormData] = useState<CalculatorFormData>({
    title: "",
    description: "",
    inputs: [],
    outputs: [],
    category: "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  // Add input field
  const addInput = useCallback(() => {
    const newInput = CalculatorService.createDefaultInput();
    setFormData((prev) => ({
      ...prev,
      inputs: [...prev.inputs, newInput],
    }));
  }, []);

  // Remove input field
  const removeInput = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      inputs: prev.inputs.filter((_, i) => i !== index),
    }));
  }, []);

  // Update input field
  const updateInput = useCallback(
    (index: number, field: keyof Omit<InputField, "id">, value: any) => {
      setFormData((prev) => ({
        ...prev,
        inputs: prev.inputs.map((input, i) =>
          i === index ? { ...input, [field]: value } : input
        ),
      }));
    },
    []
  );

  // Add output field
  const addOutput = useCallback(() => {
    const newOutput = CalculatorService.createDefaultOutput();
    setFormData((prev) => ({
      ...prev,
      outputs: [...prev.outputs, newOutput],
    }));
  }, []);

  // Remove output field
  const removeOutput = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      outputs: prev.outputs.filter((_, i) => i !== index),
    }));
  }, []);

  // Update output field
  const updateOutput = useCallback(
    (index: number, field: keyof Omit<OutputField, "id">, value: any) => {
      setFormData((prev) => ({
        ...prev,
        outputs: prev.outputs.map((output, i) =>
          i === index ? { ...output, [field]: value } : output
        ),
      }));
    },
    []
  );

  // Append token to formula
  const appendTokenToFormula = useCallback(
    (outputIndex: number, token: string) => {
      const current = formData.outputs[outputIndex]?.formula ?? "";
      const next =
        current && /[a-zA-Z0-9_)]$/.test(current)
          ? `${current} * ${token}`
          : `${current}${token}`;
      updateOutput(outputIndex, "formula", next);
    },
    [formData.outputs, updateOutput]
  );

  // Generate LaTeX for output
  const generateLaTeX = useCallback(
    (outputIndex: number) => {
      const output = formData.outputs[outputIndex];
      if (!output || !output.formula) return "";

      const conversion = FormulaEngine.convertToLaTeX(
        output.formula,
        formData.inputs,
        output.symbol || `output_${outputIndex}`
      );

      return conversion.latex;
    },
    [formData.outputs, formData.inputs]
  );

  // Validate current form
  const validateForm = useCallback(() => {
    const tempCalculator = CalculatorService.createCalculator(formData);
    const validation = CalculatorService.validateCalculator(tempCalculator);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  // Create calculator
  const createCalculator = useCallback((): Calculator | null => {
    if (!validateForm()) {
      return null;
    }

    return CalculatorService.createCalculator(formData);
  }, [formData, validateForm]);

  // Export to JSON
  const exportToJSON = useCallback((): string | null => {
    const calculator = createCalculator();
    return calculator ? CalculatorService.exportToJSON(calculator) : null;
  }, [createCalculator]);

  // Import from JSON
  const importFromJSON = useCallback((json: string) => {
    try {
      const calculator = CalculatorService.importFromJSON(json);
      setFormData({
        title: calculator.title,
        description: calculator.description,
        inputs: calculator.inputs.map(({ id, ...rest }) => rest),
        outputs: calculator.outputs.map(({ id, ...rest }) => rest),
        category: calculator.category,
      });
      setErrors([]);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Import failed"]);
    }
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      inputs: [],
      outputs: [],
      category: "",
    });
    setErrors([]);
  }, []);

  // Memoized values
  const isFormValid = useMemo(() => {
    return (
      formData.title.trim() &&
      formData.description.trim() &&
      formData.inputs.length > 0 &&
      formData.outputs.length > 0
    );
  }, [formData]);

  const laTeXTemplates = useMemo(() => FormulaEngine.getLaTeXTemplates(), []);

  return {
    formData,
    setFormData,
    errors,
    isFormValid,
    laTeXTemplates,
    addInput,
    removeInput,
    updateInput,
    addOutput,
    removeOutput,
    updateOutput,
    appendTokenToFormula,
    generateLaTeX,
    validateForm,
    createCalculator,
    exportToJSON,
    importFromJSON,
    resetForm,
  };
};
