
import React from 'react';
import ScoreIndicator from './ScoreIndicator';
import { Check, Lightbulb } from 'lucide-react';

const FeedbackPanel: React.FC = () => {
  // Mock data - in a real app, this would come from props/state
  const scores = {
    rapport: 82,
    education: 75,
    objectionHandling: 60,
  };

  const strengths = [
    "Opened with a warm greeting.",
    "Acknowledged patient's nervousness.",
  ];

  const opportunities = [
    "Use the 'Feel-Felt-Found' method for objections.",
    "Explain the 'why' behind your recommendation.",
    "Ask more open-ended questions."
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Performance Scores</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
            <ScoreIndicator score={scores.rapport} label="Rapport" />
            <ScoreIndicator score={scores.education} label="Education" />
            <ScoreIndicator score={scores.objectionHandling} label="Objections" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Key Strengths</h3>
        <ul className="space-y-2">
            {strengths.map((item, index) => (
                <li key={index} className="flex items-start text-sm">
                    <Check className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                </li>
            ))}
        </ul>
      </div>

       <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Opportunities</h3>
        <ul className="space-y-2">
            {opportunities.map((item, index) => (
                <li key={index} className="flex items-start text-sm">
                    <Lightbulb className="h-4 w-4 text-warning mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedbackPanel;
