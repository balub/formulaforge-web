import React, { useState } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

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
  category: string;
  inputs: InputField[];
  outputs: OutputField[];
}

interface CreateCalculatorDialogProps {
  onCreateCalculator: (calculator: CalculatorData) => void;
}

const CreateCalculatorDialog = ({ onCreateCalculator }: CreateCalculatorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [inputs, setInputs] = useState<InputField[]>([]);
  const [outputs, setOutputs] = useState<OutputField[]>([]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setInputs([]);
    setOutputs([]);
  };

  const addInput = () => {
    const newInput: InputField = {
      id: `input_${Date.now()}`,
      label: '',
      symbol: '',
      unit: '',
      type: 'number',
      required: true,
      placeholder: 'Enter value'
    };
    setInputs([...inputs, newInput]);
  };

  const removeInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const updateInput = (index: number, field: keyof InputField, value: any) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setInputs(newInputs);
  };

  const addOutput = () => {
    const newOutput: OutputField = {
      id: `output_${Date.now()}`,
      label: '',
      symbol: '',
      unit: '',
      formula: ''
    };
    setOutputs([...outputs, newOutput]);
  };

  const removeOutput = (index: number) => {
    setOutputs(outputs.filter((_, i) => i !== index));
  };

  const updateOutput = (index: number, field: keyof OutputField, value: string) => {
    const newOutputs = [...outputs];
    newOutputs[index] = { ...newOutputs[index], [field]: value };
    setOutputs(newOutputs);
  };

  const handleCreate = () => {
    if (!title.trim() || !description.trim() || !category.trim() || inputs.length === 0 || outputs.length === 0) {
      return;
    }

    const calculator: CalculatorData = {
      id: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      inputs,
      outputs
    };

    onCreateCalculator(calculator);
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-smooth">
          <Plus className="w-4 h-4 mr-2" />
          Create Calculator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Create New Calculator
          </DialogTitle>
          <DialogDescription>
            Build a custom calculator by defining inputs, formulas, and outputs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Calculator Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., BMI Calculator"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Health, Finance, Math"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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

          {/* Inputs */}
          <Card>
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
                          onChange={(e) => updateInput(index, 'label', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Symbol</Label>
                        <Input
                          placeholder="e.g., V"
                          value={input.symbol}
                          onChange={(e) => updateInput(index, 'symbol', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          placeholder="e.g., Volts (V)"
                          value={input.unit}
                          onChange={(e) => updateInput(index, 'unit', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Placeholder</Label>
                        <Input
                          placeholder="e.g., Enter voltage"
                          value={input.placeholder}
                          onChange={(e) => updateInput(index, 'placeholder', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={input.required}
                          onCheckedChange={(checked) => updateInput(index, 'required', checked)}
                        />
                        <Label>Required</Label>
                      </div>
                      <div className="space-y-2">
                        <Label>Min Value</Label>
                        <Input
                          type="number"
                          placeholder="Optional"
                          value={input.min ?? ''}
                          onChange={(e) => updateInput(index, 'min', e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Value</Label>
                        <Input
                          type="number"
                          placeholder="Optional"
                          value={input.max ?? ''}
                          onChange={(e) => updateInput(index, 'max', e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Outputs */}
          <Card>
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
                          onChange={(e) => updateOutput(index, 'label', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Symbol</Label>
                        <Input
                          placeholder="e.g., R"
                          value={output.symbol}
                          onChange={(e) => updateOutput(index, 'symbol', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          placeholder="e.g., Ohms (Ω)"
                          value={output.unit}
                          onChange={(e) => updateOutput(index, 'unit', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Formula</Label>
                        <Input
                          placeholder="e.g., voltage / current"
                          value={output.formula}
                          onChange={(e) => updateOutput(index, 'formula', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Reference input fields by their IDs in the formula. Available inputs: {inputs.map(i => i.id).join(', ') || 'None yet'}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!title.trim() || !description.trim() || !category.trim() || inputs.length === 0 || outputs.length === 0}
              className="bg-gradient-primary"
            >
              Create Calculator
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCalculatorDialog;