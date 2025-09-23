
import React from 'react';
import { SalesScore } from '../types';
import DashboardCard from './DashboardCard';
import { cn } from '../lib/utils';

interface SalesExcellenceProps {
  scores: SalesScore[];
  onScoreClick: (skill: string) => void;
}

const getScoreClasses = (score: number) => {
  if (score >= 90) return 'bg-success/10 text-success';
  if (score >= 80) return 'bg-primary/10 text-primary';
  if (score >= 70) return 'bg-warning/10 text-warning';
  return 'bg-destructive/10 text-destructive';
};

const SalesExcellence: React.FC<SalesExcellenceProps> = ({ scores, onScoreClick }) => {
  return (
    <DashboardCard title="Sales Excellence Scores" tooltipText="Each skill is defined and scored based on established transcript benchmarks.">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {scores.map(item => (
          <div 
            key={item.skill} 
            onClick={() => onScoreClick(item.skill)} 
            className={cn(
                "text-center p-3 rounded-lg cursor-pointer transition-transform hover:scale-105",
                getScoreClasses(item.score)
            )}
          >
            <p className="text-3xl font-bold">{item.score}</p>
            <p className="text-xs text-current/80 mt-1">{item.skill}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default SalesExcellence;
