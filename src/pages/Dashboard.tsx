import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import calculatorsData from '@/data/calculators.json';

const Dashboard = () => {
  const categories = [...new Set(calculatorsData.map(calc => calc.category))];
  
  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-white shadow-glow">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Calculator Blocks</h1>
          <p className="text-xl text-white/90 mb-6">
            Create, manage, and share powerful calculators with ease
          </p>
          <div className="flex gap-4">
            <Link to="/admin">
              <Button size="lg" variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                Create Calculator
              </Button>
            </Link>
            <Link to={`/calculator/${calculatorsData[0]?.id}`}>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Calculators
            </CardTitle>
            <Calculator className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{calculatorsData.length}</div>
            <p className="text-xs text-success">
              +{calculatorsData.length} from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all calculators
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,234</div>
            <p className="text-xs text-success">
              +12% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calculator Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Available Calculators</h2>
          <Link to="/admin">
            <Button className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-smooth">
              <Zap className="w-4 h-4 mr-2" />
              Create New
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
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {calc.category}
                    </span>
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
    </div>
  );
};

export default Dashboard;