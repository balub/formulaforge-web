import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Plus, Trash2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface InputField {
  id: string;
  label: string;
  symbol: string;
  unit: string;
  type: string;
  required: boolean;
  min?: number;
  max?: number;
  placeholder: string;
}

interface OutputField {
  id: string;
  label: string;
  symbol: string;
  unit: string;
  formula: string;
}

interface CalculatorData {
  id: string;
  title: string;
  description: string;
  inputs: InputField[];
  outputs: OutputField[];
}

const CalculatorBuilder = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inputs, setInputs] = useState<InputField[]>([]);
  const [outputs, setOutputs] = useState<OutputField[]>([]);

  const addInput = () => {
    const newInput: InputField = {
      id: `input_${Date.now()}`,
      label: "",
      symbol: "",
      unit: "",
      type: "number",
      required: true,
      placeholder: "Enter value",
    };
    setInputs((prev) => [...prev, newInput]);
  };

  const removeInput = (index: number) => {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateInput = (
    index: number,
    field: keyof InputField,
    value: string | number | boolean | undefined
  ) => {
    const copy = [...inputs];
    copy[index] = { ...copy[index], [field]: value };
    setInputs(copy);
  };

  const addOutput = () => {
    const newOutput: OutputField = {
      id: `output_${Date.now()}`,
      label: "",
      symbol: "",
      unit: "",
      formula: "",
    };
    setOutputs((prev) => [...prev, newOutput]);
  };

  const removeOutput = (index: number) => {
    setOutputs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOutput = (
    index: number,
    field: keyof OutputField,
    value: string
  ) => {
    const copy = [...outputs];
    copy[index] = { ...copy[index], [field]: value };
    setOutputs(copy);
  };

  const appendTokenToFormula = (outputIndex: number, token: string) => {
    const current = outputs[outputIndex]?.formula ?? "";
    const next =
      current && /[a-zA-Z0-9_)]$/.test(current)
        ? `${current} * ${token}`
        : `${current}${token}`;
    updateOutput(outputIndex, "formula", next);
  };

  // Note: Formulas are built using input IDs by design for unambiguous evaluation.

  const calculatorJson = useMemo<CalculatorData | null>(() => {
    if (
      !title.trim() ||
      !description.trim() ||
      inputs.length === 0 ||
      outputs.length === 0
    ) {
      return null;
    }
    return {
      id: title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      title: title.trim(),
      description: description.trim(),
      inputs,
      outputs,
    };
  }, [title, description, inputs, outputs]);

  const handleDownload = () => {
    if (!calculatorJson) return;
    const blob = new Blob([JSON.stringify(calculatorJson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${calculatorJson.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Calculator Builder
            </h1>
            <p className="text-muted-foreground">
              Design a calculator and export its JSON
            </p>
          </div>
        </div>
        <Button
          onClick={handleDownload}
          disabled={!calculatorJson}
          className="bg-gradient-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Export JSON
        </Button>
      </div>

      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., BMI Calculator"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this calculator does"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Input Fields</CardTitle>
            <Button onClick={addInput} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Input
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {inputs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No inputs defined. Click "Add Input" to get started.
            </p>
          ) : (
            inputs.map((input, index) => (
              <div key={input.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Input #{index + 1}</Badge>
                  <Button
                    onClick={() => removeInput(index)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    <Label>Placeholder</Label>
                    <Input
                      placeholder="e.g., Enter voltage"
                      value={input.placeholder}
                      onChange={(e) =>
                        updateInput(index, "placeholder", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={input.required}
                      onCheckedChange={(checked) =>
                        updateInput(index, "required", checked)
                      }
                    />
                    <Label>Required</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Min Value</Label>
                    <Input
                      type="number"
                      placeholder="Optional"
                      value={input.min ?? ""}
                      onChange={(e) =>
                        updateInput(
                          index,
                          "min",
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Value</Label>
                    <Input
                      type="number"
                      placeholder="Optional"
                      value={input.max ?? ""}
                      onChange={(e) =>
                        updateInput(
                          index,
                          "max",
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Output Fields</CardTitle>
            <Button onClick={addOutput} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Output
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {outputs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No outputs defined. Click "Add Output" to get started.
            </p>
          ) : (
            outputs.map((output, index) => (
              <div key={output.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Output #{index + 1}</Badge>
                  <Button
                    onClick={() => removeOutput(index)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    <Label>Formula</Label>
                    <Input
                      placeholder="e.g., voltage / current"
                      value={output.formula}
                      onChange={(e) =>
                        updateOutput(index, "formula", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {inputs.length > 0 && (
                    <span className="text-xs font-medium text-muted-foreground mr-1 self-center">
                      Insert inputs:
                    </span>
                  )}
                  {inputs.map((inp) => (
                    <Button
                      key={inp.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => appendTokenToFormula(index, inp.id)}
                      title={`Insert ${inp.label} (${inp.symbol || inp.id})`}
                    >
                      {inp.symbol || inp.id}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground pt-2">
                  Use input IDs in formulas. Supports +, -, *, /, parentheses,
                  and functions supported by mathjs.
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Formula</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {outputs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No outputs yet to display formulae.
              </p>
            ) : (
              outputs.map((output) => (
                <div
                  key={output.id}
                  className="p-6 rounded-lg bg-muted/20 border-l-4 border-primary"
                >
                  <div className="text-center">
                    <div className="text-lg font-medium text-muted-foreground mb-2">
                      {output.label || "Output"}
                    </div>
                    <div className="text-2xl font-mono bg-background/80 p-4 rounded border inline-block min-w-[200px]">
                      <span className="text-primary font-semibold">
                        {output.symbol || output.id}
                      </span>
                      <span className="mx-2">=</span>
                      <span className="text-foreground">
                        {output.formula || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {inputs.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Where,
              </h4>
              <div className="grid gap-2">
                {inputs.map((input) => (
                  <div
                    key={input.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="font-mono font-semibold text-primary min-w-[60px]">
                      {input.symbol || input.id} =
                    </span>
                    <span className="text-muted-foreground">
                      {input.label} ({input.unit})
                    </span>
                  </div>
                ))}
                {outputs.map((output) => (
                  <div
                    key={output.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="font-mono font-semibold text-primary min-w-[60px]">
                      {output.symbol || output.id} =
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

export default CalculatorBuilder;
