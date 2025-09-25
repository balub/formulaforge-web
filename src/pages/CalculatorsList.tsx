import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calculator, Zap, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import calculatorsData from "@/data/calculators.json";

const CalculatorsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter calculators based on search query
  const filteredCalculators = useMemo(() => {
    if (!searchQuery.trim()) {
      return calculatorsData;
    }

    const query = searchQuery.toLowerCase();
    return calculatorsData.filter((calc) => {
      return (
        calc.title.toLowerCase().includes(query) ||
        calc.description.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

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

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search calculators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-secondary"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          {filteredCalculators.length === 0 ? (
            <p>No calculators found for "{searchQuery}"</p>
          ) : (
            <p>
              {filteredCalculators.length} calculator
              {filteredCalculators.length !== 1 ? "s" : ""} found for "
              {searchQuery}"
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCalculators.map((calc) => (
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
