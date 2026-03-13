
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
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border -mx-6 -mb-6 h-full">
        {/* Strengths Column */}
        <div className="p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
             <CheckCircle2 className="h-5 w-5 text-success mr-2 flex-shrink-0" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {data.strengths.map(item => (
              <li 
                key={item} 
                onClick={() => onItemClick(item)} 
                className="text-sm text-foreground cursor-pointer hover:text-primary transition-colors p-2 -m-2 rounded-lg hover:bg-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Opportunities Column */}
        <div className="p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 text-warning mr-2 flex-shrink-0" />
            Opportunities
          </h4>
          <ul className="space-y-2">
            {data.opportunities.map(item => (
              <li 
                key={item} 
                onClick={() => onItemClick(item)} 
                className="text-sm text-foreground cursor-pointer hover:text-primary transition-colors p-2 -m-2 rounded-lg hover:bg-secondary"
              >
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
