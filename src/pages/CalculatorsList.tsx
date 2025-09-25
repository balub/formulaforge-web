import React from "react";
import { Link } from "react-router-dom";
import { Calculator, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import calculatorsData from "@/data/calculators.json";

const CalculatorsList = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calculators</h1>
          <p className="text-muted-foreground">
            Browse all available calculators
          </p>
        </div>
        <Link to="/builder">
          <Button className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-smooth">
            <Zap className="w-4 h-4 mr-2" />
            Create Calculator
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculatorsData.map((calc) => (
          <Link key={calc.id} to={`/calculator/${calc.id}`}>
            <Card className="group hover:shadow-elegant transition-smooth cursor-pointer bg-gradient-card border-0 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                    {calc.title}
                  </CardTitle>
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-card group-hover:shadow-glow transition-smooth">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  {calc.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {calc.inputs.length} inputs • {calc.outputs.length} outputs
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CalculatorsList;
