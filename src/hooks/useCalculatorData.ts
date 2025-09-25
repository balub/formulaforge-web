import { useState, useCallback, useEffect } from "react";
import { Calculator } from "@/types/calculator";
import { CalculatorJSONService } from "@/services/CalculatorJSONService";
import { CalculatorRenderer } from "@/services/CalculatorRenderer";

export const useCalculatorData = () => {
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load calculators from localStorage or API
  const loadCalculators = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to load from localStorage first
      const stored = localStorage.getItem("formulaforge-calculators");
      if (stored) {
        const data = JSON.parse(stored);
        setCalculators(Array.isArray(data) ? data : []);
      }

      // In a real app, you might also load from an API here
      // const apiData = await fetchCalculatorsFromAPI();
      // setCalculators(apiData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load calculators"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Save calculators to localStorage
  const saveCalculators = useCallback(async (newCalculators: Calculator[]) => {
    try {
      localStorage.setItem(
        "formulaforge-calculators",
        JSON.stringify(newCalculators)
      );
      setCalculators(newCalculators);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save calculators"
      );
    }
  }, []);

  // Add a new calculator
  const addCalculator = useCallback(
    async (calculator: Calculator) => {
      const newCalculators = [...calculators, calculator];
      await saveCalculators(newCalculators);
    },
    [calculators, saveCalculators]
  );

  // Update an existing calculator
  const updateCalculator = useCallback(
    async (id: string, updates: Partial<Calculator>) => {
      const newCalculators = calculators.map((calc) =>
        calc.id === id
          ? { ...calc, ...updates, updated_at: new Date().toISOString() }
          : calc
      );
      await saveCalculators(newCalculators);
    },
    [calculators, saveCalculators]
  );

  // Delete a calculator
  const deleteCalculator = useCallback(
    async (id: string) => {
      const newCalculators = calculators.filter((calc) => calc.id !== id);
      await saveCalculators(newCalculators);
    },
    [calculators, saveCalculators]
  );

  // Get calculator by ID
  const getCalculator = useCallback(
    (id: string): Calculator | undefined => {
      return calculators.find((calc) => calc.id === id);
    },
    [calculators]
  );

  // Export calculator to JSON
  const exportCalculator = useCallback((calculator: Calculator): string => {
    return CalculatorJSONService.exportToJSON(calculator);
  }, []);

  // Import calculator from JSON
  const importCalculator = useCallback(
    async (json: string): Promise<Calculator> => {
      try {
        const calculator = CalculatorJSONService.importFromJSON(json);
        await addCalculator(calculator);
        return calculator;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Import failed");
      }
    },
    [addCalculator]
  );

  // Export all calculators
  const exportAllCalculators = useCallback((): string => {
    return JSON.stringify(calculators, null, 2);
  }, [calculators]);

  // Import multiple calculators
  const importCalculators = useCallback(
    async (json: string): Promise<void> => {
      try {
        const data = JSON.parse(json);
        const importedCalculators = Array.isArray(data) ? data : [data];

        // Validate each calculator
        for (const calc of importedCalculators) {
          CalculatorJSONService.importFromJSON(JSON.stringify(calc));
        }

        await saveCalculators([...calculators, ...importedCalculators]);
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Import failed");
      }
    },
    [calculators, saveCalculators]
  );

  // Get calculator metadata
  const getCalculatorMetadata = useCallback((calculator: Calculator) => {
    return CalculatorRenderer.generateMetadata(calculator);
  }, []);

  // Get calculator summary
  const getCalculatorSummary = useCallback((calculator: Calculator) => {
    return CalculatorRenderer.generateSummary(calculator);
  }, []);

  // Validate calculator
  const validateCalculator = useCallback((calculator: Calculator) => {
    return CalculatorRenderer.validateForRendering(calculator);
  }, []);

  // Search calculators
  const searchCalculators = useCallback(
    (query: string): Calculator[] => {
      if (!query.trim()) return calculators;

      const lowercaseQuery = query.toLowerCase();
      return calculators.filter(
        (calc) =>
          calc.title.toLowerCase().includes(lowercaseQuery) ||
          calc.description.toLowerCase().includes(lowercaseQuery) ||
          calc.category?.toLowerCase().includes(lowercaseQuery)
      );
    },
    [calculators]
  );

  // Filter calculators by category
  const filterByCategory = useCallback(
    (category: string): Calculator[] => {
      return calculators.filter((calc) => calc.category === category);
    },
    [calculators]
  );

  // Get all categories
  const getCategories = useCallback((): string[] => {
    const categories = calculators
      .map((calc) => calc.category)
      .filter(Boolean) as string[];
    return [...new Set(categories)].sort();
  }, [calculators]);

  // Load calculators on mount
  useEffect(() => {
    loadCalculators();
  }, [loadCalculators]);

  return {
    calculators,
    loading,
    error,
    loadCalculators,
    addCalculator,
    updateCalculator,
    deleteCalculator,
    getCalculator,
    exportCalculator,
    importCalculator,
    exportAllCalculators,
    importCalculators,
    getCalculatorMetadata,
    getCalculatorSummary,
    validateCalculator,
    searchCalculators,
    filterByCategory,
    getCategories,
  };
};
