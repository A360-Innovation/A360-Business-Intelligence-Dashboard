
import React from 'react';
import { Timeframe } from '../types';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { ChevronDown } from 'lucide-react';

interface HeaderProps {
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}

const Header: React.FC<HeaderProps> = ({ timeframe, setTimeframe }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Clinic Insights Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of consultation data</p>
      </div>
      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
        <div className="flex items-center bg-secondary rounded-lg p-1 text-sm font-medium">
          <Button
            onClick={() => setTimeframe('Monthly')}
            variant="ghost"
            size="sm"
            className={cn("w-20", timeframe === 'Monthly' && 'bg-card text-card-foreground shadow-sm')}
          >
            Monthly
          </Button>
          <Button
            onClick={() => setTimeframe('Weekly')}
            variant="ghost"
            size="sm"
            className={cn("w-20", timeframe === 'Weekly' && 'bg-card text-card-foreground shadow-sm')}
          >
            Weekly
          </Button>
        </div>
        <div className="relative">
          <select className="appearance-none bg-card border border-input rounded-md shadow-sm h-9 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
            <option>Last 30 Days</option>
            <option>Last 60 Days</option>
            <option>Last 90 Days</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    </header>
  );
};

export default Header;
