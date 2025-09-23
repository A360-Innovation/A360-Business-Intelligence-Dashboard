
import React from 'react';
import DashboardCard from './DashboardCard';
import { CheckCircle2, Lightbulb } from 'lucide-react';

interface WorkflowQualityProps {
  data: {
    strengths: string[];
    opportunities: string[];
  };
  onItemClick: (title: string) => void;
}

const WorkflowQuality: React.FC<WorkflowQualityProps> = ({ data, onItemClick }) => {
  return (
    <DashboardCard title="Clinical Workflow Quality" tooltipText="Based on Sales Excellence categories and a transcript scoring system.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
             <CheckCircle2 className="h-5 w-5 text-success mr-2 flex-shrink-0" />
            Strengths
            </h4>
          <ul className="space-y-1">
            {data.strengths.map(item => (
              <li key={item} onClick={() => onItemClick(item)} className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors p-2 -m-2 rounded-md hover:bg-accent">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            <Lightbulb className="h-5 w-5 text-warning mr-2 flex-shrink-0" />
            Opportunities
          </h4>
          <ul className="space-y-1">
            {data.opportunities.map(item => (
              <li key={item} onClick={() => onItemClick(item)} className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors p-2 -m-2 rounded-md hover:bg-accent">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardCard>
  );
};

export default WorkflowQuality;
