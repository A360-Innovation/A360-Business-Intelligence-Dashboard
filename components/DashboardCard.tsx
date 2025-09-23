
import React, { ReactNode } from 'react';
import Tooltip from './Tooltip';
import { HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';

interface DashboardCardProps {
  title: string;
  tooltipText: string;
  children: ReactNode;
  className?: string;
  headerContent?: ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, tooltipText, children, className = '', headerContent }) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center space-x-2">
            {headerContent}
            <Tooltip content={tooltipText}>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;