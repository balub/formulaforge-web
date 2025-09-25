import React from "react";
import { NavLink } from "react-router-dom";
import { Calculator, Wrench, Plus, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import calculatorsData from "@/data/calculators.json";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-card border-r border-border flex flex-col shadow-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Calculator Blocks
            </h1>
            <p className="text-sm text-muted-foreground">Build & Share</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth text-sm font-medium",
              isActive
                ? "bg-primary text-primary-foreground shadow-elegant"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )
          }
        >
          <Home className="w-4 h-4" />
          Calculators
        </NavLink>

        <NavLink
          to="/builder"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth text-sm font-medium",
              isActive
                ? "bg-primary text-primary-foreground shadow-elegant"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )
          }
        >
          <Wrench className="w-4 h-4" />
          Builder
        </NavLink>

        <div className="pt-4">
          <div className="flex items-center justify-between px-4 pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Calculators
            </span>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="space-y-1">
            {calculatorsData.map((calc) => (
              <NavLink
                key={calc.id}
                to={`/calculator/${calc.id}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-smooth text-sm",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-card"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )
                }
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                {calc.title}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Calculator Blocks v1.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
