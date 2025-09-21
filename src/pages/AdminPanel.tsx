import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Calculator, Code, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateCalculatorDialog from '@/components/CreateCalculatorDialog';
import calculatorsData from '@/data/calculators.json';

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

const AdminPanel = () => {
  const [calculators, setCalculators] = useState<CalculatorData[]>(calculatorsData);

  const handleCreateCalculator = (newCalculator: CalculatorData) => {
    setCalculators(prev => [...prev, newCalculator]);
  };

  const handleDeleteCalculator = (id: string) => {
    setCalculators(prev => prev.filter(calc => calc.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your calculator blocks</p>
          </div>
        </div>
        <CreateCalculatorDialog onCreateCalculator={handleCreateCalculator} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Calculators</p>
                <p className="text-2xl font-bold">{calculators.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-accent" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{[...new Set(calculators.map(c => c.category))].length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
                <div className="w-4 h-4 bg-success rounded-full" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{calculators.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-warning/20 flex items-center justify-center">
                <div className="w-4 h-4 bg-warning rounded-full" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculator List */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Calculator Blocks</CardTitle>
          <CardDescription>
            Manage and configure your calculator collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calculators.map((calc) => (
              <div
                key={calc.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-smooth"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-card">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{calc.title}</h3>
                    <p className="text-sm text-muted-foreground">{calc.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{calc.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {calc.inputs.length} inputs • {calc.outputs.length} outputs
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link to={`/calculator/${calc.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCalculator(calc.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* JSON Editor Card */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            JSON Configuration
          </CardTitle>
          <CardDescription>
            For now, edit the calculators.json file directly to add or modify calculators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/30 rounded-lg border">
            <code className="text-sm text-muted-foreground">
              src/data/calculators.json
            </code>
            <p className="text-sm text-muted-foreground mt-2">
              Each calculator object contains: id, title, description, category, inputs array, and outputs array with formulas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;