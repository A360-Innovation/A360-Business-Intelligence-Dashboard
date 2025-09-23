
import React from 'react';
import Tooltip from './Tooltip';
import { Card } from './ui/card';
import { HelpCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  tooltipText: string;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, tooltipText, onClick }) => {
  return (
    <Card 
      className="transition-colors duration-300 cursor-pointer hover:border-ring/50"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
          <Tooltip content={tooltipText}>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </Tooltip>
        </div>
        <div className="mt-2">
          <p className="text-3xl font-bold text-primary">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;