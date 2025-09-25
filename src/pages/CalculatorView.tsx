import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calculator, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import calculatorsData from "@/data/calculators.json";
import { evaluate } from "mathjs";
import "katex/dist/katex.min.css";
import MathDisplay from "@/components/MathDisplay";

interface CalculatorData {
  id: string;
  title: string;
  description: string;
  category: string;
  inputs: Array<{
    id: string;
    label: string;
    symbol: string;
    unit: string;
    type: string;
    required: boolean;
    min?: number;
    max?: number;
    placeholder: string;
  }>;
  outputs: Array<{
    id: string;
    label: string;
    symbol: string;
    unit: string;
    formula: string;
    formula_display?: string;
  }>;
}

const CalculatorView = () => {
  const { id } = useParams<{ id: string }>();
  const [inputValues, setInputValues] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculator = calculatorsData.find((calc) => calc.id === id) as
    | CalculatorData
    | undefined;

  const validateInput = (
    inputConfig: CalculatorData["inputs"][number],
    value: number
  ): string | null => {
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
  };

  const calculateResults = useCallback(() => {
    if (!calculator) return;

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
      calculator.outputs.forEach((output) => {
        try {
          const result = evaluate(output.formula, inputValues);
          const numResult = Number(result);
          newResults[output.id] = Number(numResult.toFixed(4));
        } catch (error) {
          console.error(`Error calculating ${output.id}:`, error);
          newResults[output.id] = 0;
        }
      });
    }

    setResults(newResults);
  }, [calculator, inputValues]);

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  if (!calculator) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Calculator not found.{" "}
            <Link to="/" className="text-primary hover:underline">
              Return to dashboard
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calculators
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {calculator.title}
          </h1>
          <p className="text-muted-foreground">{calculator.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs Card */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Inputs
            </CardTitle>
            <CardDescription>
              Enter your values below to calculate results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculator.inputs.map((input) => (
              <div key={input.id} className="space-y-2">
                <Label htmlFor={input.id} className="text-sm font-medium">
                  {input.label} ({input.symbol})
                  {input.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </Label>
                <Input
                  id={input.id}
                  type="number"
                  placeholder={`${input.placeholder} (${input.unit})`}
                  value={inputValues[input.id] || ""}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setInputValues((prev) => ({
                      ...prev,
                      [input.id]: isNaN(value) ? undefined : value,
                    }));
                  }}
                  className={errors[input.id] ? "border-destructive" : ""}
                />
                {errors[input.id] && (
                  <p className="text-sm text-destructive">{errors[input.id]}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-primary flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              Results
            </CardTitle>
            <CardDescription>
              Calculated outputs based on your inputs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculator.outputs.map((output) => (
              <div key={output.id} className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  {output.label} ({output.symbol})
                </Label>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-2xl font-bold text-primary">
                    {results[output.id] !== undefined
                      ? results[output.id]
                      : "—"}
                    {results[output.id] !== undefined && (
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        {output.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Formula Section */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Formula</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formula Display */}
          <div className="space-y-4">
            {calculator.outputs.map((output) => (
              <div
                key={output.id}
                className="p-6 rounded-lg bg-muted/20 border-l-4 border-primary"
              >
                <div className="text-center">
                  <div className="text-lg font-medium text-muted-foreground mb-2">
                    {output.label}
                  </div>
                  <div className="bg-background/80 p-4 rounded border">
                    <div className="text-center">
                      <MathDisplay
                        math={
                          output.formula_display ||
                          `${output.symbol} = ${output.formula
                            .replace(/Math\.sqrt/g, "\\sqrt")
                            .replace(/Math\.log/g, "\\ln")
                            .replace(/(\w+)/g, (match) => {
                              const input = calculator.inputs.find(
                                (inp) => inp.id === match
                              );
                              return input ? input.symbol : match;
                            })}`
                        }
                        display={true}
                        className="text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Variable Explanations */}
          {calculator.inputs.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Where,
              </h4>
              <div className="grid gap-2">
                {calculator.inputs.map((input) => (
                  <div
                    key={input.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="font-mono font-semibold text-primary min-w-[60px]">
                      {input.symbol} =
                    </span>
                    <span className="text-muted-foreground">
                      {input.label} ({input.unit})
                    </span>
                  </div>
                ))}
                {calculator.outputs.map((output) => (
                  <div
                    key={output.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="font-mono font-semibold text-primary min-w-[60px]">
                      {output.symbol} =
                    </span>
                    <span className="text-muted-foreground">
                      {output.label} ({output.unit})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculatorView;
