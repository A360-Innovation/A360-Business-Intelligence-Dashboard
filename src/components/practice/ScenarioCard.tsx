

import React from 'react';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ScenarioCardProps {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  onSelect: () => void;
}

const difficultyClasses = {
  Beginner: 'bg-success/10 text-success',
  Intermediate: 'bg-warning/10 text-warning',
  Advanced: 'bg-destructive/10 text-destructive',
};

const ScenarioCard: React.FC<ScenarioCardProps> = ({ title, description, difficulty, onSelect }) => {
  return (
    <div className="bg-card border border-border rounded-xl flex flex-col p-6 transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex-1">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-foreground">{title}</h3>
            <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", difficultyClasses[difficulty])}>
                {difficulty}
            </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </div>
      <Button className="w-full mt-6" onClick={onSelect}>
        <Play className="h-4 w-4 mr-2" />
        Start Practice
      </Button>
    </div>
  );
};

export default ScenarioCard;