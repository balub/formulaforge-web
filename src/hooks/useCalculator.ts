import { useState, useCallback, useEffect } from "react";
import { Calculator, InputField } from "@/types/calculator";
import { evaluate } from "mathjs";

export const useCalculator = (calculator: Calculator) => {
  const [inputValues, setInputValues] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate input
  const validateInput = useCallback(
    (inputConfig: InputField, value: number): string | null => {
      if (
        inputConfig.required &&
        (isNaN(value) || value === null || value === undefined)
      ) {
        return "This field is required";
      }

      if (!isNaN(value)) {
        if (inputConfig.min !== undefined && value < inputConfig.min) {
          return `Value must be at least ${inputConfig.min}`;
        }
        if (inputConfig.max !== undefined && value > inputConfig.max) {
          return `Value must be at most ${inputConfig.max}`;
        }
      }

      return null;
    },
    []
  );

  // Calculate results
  const calculateResults = useCallback(() => {
    const newResults: Record<string, number> = {};
    const newErrors: Record<string, string> = {};

    // Validate inputs
    calculator.inputs.forEach((input) => {
      const value = inputValues[input.id];
      const error = validateInput(input, value);
      if (error) {
        newErrors[input.id] = error;
      }
    });

    setErrors(newErrors);

    // Calculate if no errors
    if (Object.keys(newErrors).length === 0) {
      // Use a running scope so later outputs can reference earlier ones
      const scope: Record<string, number> = { ...inputValues } as Record<
        string,
        number
      >;

      calculator.outputs.forEach((output) => {
        try {
          // mathjs uses functions like log, sqrt, etc. Remove any JS Math. prefixes
          const formulaForMathJs = output.formula.replace(/Math\./g, "");

          const result = evaluate(formulaForMathJs, scope);
          const numResult = Number(result);

          // Round to 4 decimal places, but preserve scientific notation for very small numbers
          let rounded = 0;
          if (Number.isFinite(numResult)) {
            if (Math.abs(numResult) < 0.0001) {
              // For very small numbers, round the mantissa to 4 decimal places
              const exponent = Math.floor(Math.log10(Math.abs(numResult)));
              const mantissa = numResult / Math.pow(10, exponent);
              const roundedMantissa = Math.round(mantissa * 10000) / 10000;
              rounded = roundedMantissa * Math.pow(10, exponent);
            } else {
              // For normal numbers, round to 4 decimal places
              rounded = Math.round(numResult * 10000) / 10000;
            }
          }

          newResults[output.id] = rounded;
          // expose this output by id for downstream formulas (e.g., inductance uses capacitance, impedance)
          scope[output.id] = rounded;
        } catch (error) {
          console.error(`Error calculating ${output.id}:`, error);
          newResults[output.id] = 0;
        }
      });
    }

    setResults(newResults);
  }, [calculator, inputValues, validateInput]);

  // Update input value
  const updateInputValue = useCallback((inputId: string, value: number) => {
    setInputValues((prev) => ({
      ...prev,
      [inputId]: isNaN(value) ? undefined : value,
    }));
  }, []);

  // Reset calculator
  const resetCalculator = useCallback(() => {
    setInputValues({});
    setResults({});
    setErrors({});
  }, []);

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  return {
    inputValues,
    results,
    errors,
    updateInputValue,
    resetCalculator,
    calculateResults,
  };
};
