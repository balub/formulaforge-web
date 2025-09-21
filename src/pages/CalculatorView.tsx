import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calculator, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import calculatorsData from '@/data/calculators.json';
import { evaluate } from 'mathjs';

interface CalculatorData {
  id: string;
  title: string;
  description: string;
  category: string;
  inputs: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
    min?: number;
    max?: number;
    placeholder: string;
  }>;
  outputs: Array<{
    id: string;
    label: string;
    unit: string;
    formula: string;
  }>;
}

const CalculatorView = () => {
  const { id } = useParams<{ id: string }>();
  const [inputValues, setInputValues] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculator = calculatorsData.find(calc => calc.id === id) as CalculatorData | undefined;

  const validateInput = (inputConfig: any, value: number): string | null => {
    if (inputConfig.required && (isNaN(value) || value === null || value === undefined)) {
      return 'This field is required';
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

  const calculateResults = () => {
    if (!calculator) return;

    const newResults: Record<string, number> = {};
    const newErrors: Record<string, string> = {};

    // Validate inputs
    calculator.inputs.forEach(input => {
      const value = inputValues[input.id];
      const error = validateInput(input, value);
      if (error) {
        newErrors[input.id] = error;
      }
    });

    setErrors(newErrors);

    // Calculate if no errors
    if (Object.keys(newErrors).length === 0) {
      calculator.outputs.forEach(output => {
        try {
          const result = evaluate(output.formula, inputValues);
          newResults[output.id] = Number(result.toFixed(4));
        } catch (error) {
          console.error(`Error calculating ${output.id}:`, error);
          newResults[output.id] = 0;
        }
      });
    }

    setResults(newResults);
  };

  useEffect(() => {
    calculateResults();
  }, [inputValues, calculator]);

  if (!calculator) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Calculator not found. <Link to="/" className="text-primary hover:underline">Return to dashboard</Link>
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
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{calculator.title}</h1>
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
                  {input.label}
                  {input.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Input
                  id={input.id}
                  type="number"
                  placeholder={input.placeholder}
                  value={inputValues[input.id] || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setInputValues(prev => ({
                      ...prev,
                      [input.id]: isNaN(value) ? undefined : value
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
                  {output.label}
                </Label>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-2xl font-bold text-primary">
                    {results[output.id] !== undefined ? results[output.id] : '—'}
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

      {/* Formula Info */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Formulas Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {calculator.outputs.map((output) => (
              <div key={output.id} className="flex items-center justify-between py-2 px-4 rounded bg-muted/30">
                <span className="font-medium">{output.label}:</span>
                <code className="text-sm bg-primary/10 px-2 py-1 rounded text-primary">
                  {output.formula}
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculatorView;