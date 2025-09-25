import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  Calculator,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import MathDisplay from "@/components/MathDisplay";
import { useCalculatorBuilder } from "@/hooks/useCalculatorBuilder";
import { CalculatorJSONService } from "@/services/CalculatorJSONService";

const CalculatorBuilder = () => {
  const {
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
    exportToJSON,
    importFromJSON,
    resetForm,
  } = useCalculatorBuilder();

  const handleDownload = () => {
    const calculator = createCalculator();
    if (calculator) {
      const json = CalculatorJSONService.exportToJSON(calculator);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.title.toLowerCase().replace(/\s+/g, "-")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const calculator = CalculatorJSONService.importFromJSON(content);
          setFormData({
            title: calculator.title,
            description: calculator.description,
            inputs: calculator.inputs.map(({ id, ...rest }) => rest),
            outputs: calculator.outputs.map(({ id, ...rest }) => rest),
            category: calculator.category,
          });
        } catch (error) {
          console.error("Import failed:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Calculators
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Calculator Builder
            </h1>
            <p className="text-muted-foreground">
              Create custom calculators with beautiful mathematical formulas
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <Button onClick={handleDownload} disabled={!isFormValid}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive font-medium mb-2">
              Please fix the following errors:
            </div>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Ohm's Law Calculator"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this calculator does..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                placeholder="e.g., Electronics, Physics, Math"
                value={formData.category || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Import/Export */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Import/Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Import Calculator</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Upload a JSON file to import an existing calculator
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inputs */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-primary flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              Inputs
            </CardTitle>
            <Button onClick={addInput} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Input
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.inputs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No inputs yet. Add your first input to get started.
            </p>
          ) : (
            formData.inputs.map((input, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Input {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInput(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      placeholder="e.g., Voltage"
                      value={input.label}
                      onChange={(e) =>
                        updateInput(index, "label", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Symbol</Label>
                    <Input
                      placeholder="e.g., V"
                      value={input.symbol}
                      onChange={(e) =>
                        updateInput(index, "symbol", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      placeholder="e.g., Volts (V)"
                      value={input.unit}
                      onChange={(e) =>
                        updateInput(index, "unit", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={input.type}
                      onChange={(e) =>
                        updateInput(index, "type", e.target.value)
                      }
                    >
                      <option value="number">Number</option>
                      <option value="text">Text</option>
                      <option value="select">Select</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={input.required}
                      onCheckedChange={(checked) =>
                        updateInput(index, "required", checked)
                      }
                    />
                    <Label>Required</Label>
                  </div>
                  {input.type === "number" && (
                    <>
                      <div className="space-y-1">
                        <Label className="text-xs">Min</Label>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={input.min || ""}
                          onChange={(e) =>
                            updateInput(
                              index,
                              "min",
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          className="w-20"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Max</Label>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={input.max || ""}
                          onChange={(e) =>
                            updateInput(
                              index,
                              "max",
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          className="w-20"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Outputs */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-primary flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              Outputs
            </CardTitle>
            <Button onClick={addOutput} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Output
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.outputs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No outputs yet. Add your first output to get started.
            </p>
          ) : (
            formData.outputs.map((output, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Output {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOutput(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      placeholder="e.g., Resistance"
                      value={output.label}
                      onChange={(e) =>
                        updateOutput(index, "label", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Symbol</Label>
                    <Input
                      placeholder="e.g., R"
                      value={output.symbol}
                      onChange={(e) =>
                        updateOutput(index, "symbol", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      placeholder="e.g., Ohms (Ω)"
                      value={output.unit}
                      onChange={(e) =>
                        updateOutput(index, "unit", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Formula (JavaScript)</Label>
                    <Input
                      placeholder="e.g., voltage / current"
                      value={output.formula}
                      onChange={(e) =>
                        updateOutput(index, "formula", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* LaTeX Formula */}
                <div className="space-y-2">
                  <Label>LaTeX Formula (Optional)</Label>
                  <Input
                    placeholder="e.g., R = \\frac{V}{I}"
                    value={output.formula_display || ""}
                    onChange={(e) =>
                      updateOutput(index, "formula_display", e.target.value)
                    }
                  />
                  <div className="text-xs text-muted-foreground">
                    Leave empty to auto-generate from JavaScript formula
                  </div>
                </div>

                {/* Input Insertion Buttons */}
                {formData.inputs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-medium text-muted-foreground mr-1 self-center">
                      Insert inputs:
                    </span>
                    {formData.inputs.map((input) => (
                      <Button
                        key={input.symbol || `input_${index}`}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() =>
                          appendTokenToFormula(
                            index,
                            input.symbol || input.label
                          )
                        }
                        title={`Insert ${input.label} (${input.symbol})`}
                      >
                        {input.symbol || input.label}
                      </Button>
                    ))}
                  </div>
                )}

                {/* LaTeX Templates */}
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    LaTeX Templates (click to insert):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {laTeXTemplates.map((template, templateIndex) => (
                      <Button
                        key={templateIndex}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          const currentLatex = output.formula_display || "";
                          const newLatex = currentLatex + template.template;
                          updateOutput(index, "formula_display", newLatex);
                        }}
                        title={template.description}
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Formula Preview */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Formula Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {formData.outputs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No outputs yet to display formulae.
              </p>
            ) : (
              formData.outputs.map((output, index) => {
                const latexFormula =
                  output.formula_display || generateLaTeX(index);
                return (
                  <div
                    key={index}
                    className="p-6 rounded-lg bg-muted/20 border-l-4 border-primary"
                  >
                    <div className="text-center space-y-4">
                      <div className="text-lg font-medium text-muted-foreground mb-2">
                        {output.label || `Output ${index + 1}`}
                      </div>

                      {/* JavaScript Formula */}
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">
                          JavaScript Formula:
                        </div>
                        <div className="text-lg font-mono bg-background/80 p-3 rounded border">
                          <span className="text-primary font-semibold">
                            {output.symbol || `output_${index}`}
                          </span>
                          <span className="mx-2">=</span>
                          <span className="text-foreground">
                            {output.formula || "—"}
                          </span>
                        </div>
                      </div>

                      {/* LaTeX Preview */}
                      {latexFormula && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Mathematical Display:
                          </div>
                          <div className="bg-background/80 p-4 rounded border">
                            <MathDisplay
                              math={latexFormula}
                              display={true}
                              className="text-lg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculatorBuilder;
