
import React from 'react';
import { SeasonalTrend } from '../types';
import DashboardCard from './DashboardCard';
import { Flower2, Sun, Leaf, Snowflake } from 'lucide-react';

interface SeasonalTrendsProps {
  seasonalData: SeasonalTrend[];
  onItemClick: (title: string) => void;
}

const seasonIcons: { [key: string]: React.ElementType } = {
    Spring: Flower2,
    Summer: Sun,
    Fall: Leaf,
    Winter: Snowflake,
};

const SeasonalTrends: React.FC<SeasonalTrendsProps> = ({ seasonalData, onItemClick }) => {
  return (
    <DashboardCard
      title="Seasonal Trends"
      tooltipText="Data is segmented by season from transcript timestamps."
      className="h-full"
    >
      <div className="grid grid-cols-2 gap-4 h-full">
        {seasonalData.map((item) => {
          const Icon = seasonIcons[item.season];
          return (
            <div
              key={item.season}
              onClick={() => onItemClick(`Seasonal Trend: ${item.season}`)}
              className="cursor-pointer p-4 rounded-xl border bg-background hover:bg-accent transition-colors flex flex-col items-center justify-center text-center group"
            >
              {Icon && <Icon className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />}
              <p className="font-semibold text-sm text-foreground">{item.season}</p>
              <p className="text-2xl font-bold text-primary mt-1">+{item.increase}%</p>
              <p className="text-sm text-muted-foreground mt-1 break-words">{item.concern}</p>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};

export default SeasonalTrends;