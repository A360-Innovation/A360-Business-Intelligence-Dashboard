
import React from 'react';
import DashboardCard from './DashboardCard';

interface AnalysisFieldsProps {
  insights: { category: string; summary:string }[];
  onItemClick: (category: string) => void;
}

const AnalysisFields: React.FC<AnalysisFieldsProps> = ({ insights, onItemClick }) => {
  return (
    <DashboardCard title="Analysis Fields" tooltipText="These insights are generated automatically from identifying patterns in consultation transcripts.">
      <div className="flex flex-col divide-y divide-border -mt-6">
        {insights.map(insight => (
          <div key={insight.category} className="cursor-pointer group p-6 hover:bg-accent transition-colors" onClick={() => onItemClick(insight.category)}>
            <p className="text-sm font-semibold text-foreground group-hover:text-primary">{insight.category}</p>
            <p className="text-sm text-muted-foreground mt-1">{insight.summary}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default AnalysisFields;
