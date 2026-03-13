
import React from 'react';
import { Card } from './ui/card';
import { FileText, Smile, BookOpen, TrendingUp, HelpCircle } from 'lucide-react';
import Tooltip from './Tooltip';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  onClick: () => void;
  tooltipText?: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  FileText,
  Smile,
  BookOpen,
  TrendingUp,
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, onClick, tooltipText }) => {
  const Icon = iconMap[icon] || FileText;

  return (
    <Card 
      className="transition-shadow hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Tooltip content={tooltipText || "Click to view detailed AI analysis"}>
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            </Tooltip>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <h3 className="text-sm font-medium text-muted-foreground mt-1">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
