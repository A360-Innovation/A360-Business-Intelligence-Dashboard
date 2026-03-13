
import React from 'react';
import { Procedure } from '../types';
import DashboardCard from './DashboardCard';

interface TopProceduresProps {
  data: Procedure[];
  onItemClick: (name: string) => void;
}

const TopProcedures: React.FC<TopProceduresProps> = ({ data, onItemClick }) => {
  return (
    <DashboardCard title="Top Procedures Recommended" tooltipText="This list shows procedures recommended during consultations, not necessarily performed treatments.">
      <ul className="space-y-4">
        {data.map((proc) => (
          <li key={proc.name} className="group cursor-pointer rounded-lg p-2 -m-2 hover:bg-accent transition-colors" onClick={() => onItemClick(proc.name)}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-foreground group-hover:text-primary">{proc.name}</span>
              <span className="text-sm font-bold text-foreground">{proc.count} ({proc.percentage}%)</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-500 bg-primary"
                style={{ width: `${proc.percentage}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
};

export default TopProcedures;
