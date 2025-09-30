import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Bar } from 'recharts';
import { DemographicConcern, SeasonalTrend } from '../types';
import DashboardCard from './DashboardCard';
import { Flower2, Sun, Leaf, Snowflake } from 'lucide-react';

interface MarketingOpportunitiesProps {
  demographicsData: DemographicConcern[];
  seasonalData: SeasonalTrend[];
  onItemClick: (title: string) => void;
}

const seasonIcons: { [key: string]: React.ElementType } = {
    Spring: Flower2,
    Summer: Sun,
    Fall: Leaf,
    Winter: Snowflake,
};

const concernColors: { [key: string]: string } = {
    'Acne': 'hsl(var(--primary))',
    'Pigmentation': 'hsl(212, 56%, 70%)',
    'Scarring': 'hsl(212, 56%, 80%)',
    'Wrinkles': '#a3a3a3',
    'Texture': '#b8b8b8',
    'Sagging': 'hsl(33, 94%, 51%)',
    'Volume Loss': 'hsl(33, 94%, 61%)',
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-sm">
          <p className="font-bold text-card-foreground mb-2">Ages {label}</p>
          {payload.slice().reverse().map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.fill }} className="text-sm">
              {`${pld.dataKey}: ${pld.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
};

const MarketingOpportunities: React.FC<MarketingOpportunitiesProps> = ({ demographicsData, seasonalData, onItemClick }) => {
  // FIX: Replaced `flatMap` with a more explicit `reduce` to ensure proper type
  // inference, resolving an issue where `allConcerns` was not correctly typed as `string[]`.
  const allConcerns: string[] = Array.from(
    demographicsData.reduce((set, group) => {
      group.concerns.forEach(c => set.add(c.name));
      return set;
    }, new Set<string>())
  );
    
  const chartData = demographicsData.map(group => {
      const groupData: { [key: string]: any } = { group: group.group };
      group.concerns.forEach(concern => {
          groupData[concern.name] = concern.value;
      });
      return groupData;
  });

  return (
    <DashboardCard title="Marketing & Growth Opportunities" tooltipText="Data is segmented by patient age and season from transcript timestamps and demographics.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Concerns by Demographics */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Concerns by Demographics</h4>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" tickFormatter={(tick) => `${tick}%`} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="group" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={40} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '12px',
                    paddingTop: '10px',
                    color: 'hsl(var(--muted-foreground))',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    paddingBottom: '5px'
                  }}
                />
                {allConcerns.map(concern => (
                    <Bar key={concern} dataKey={concern} stackId="a" fill={concernColors[concern] || '#cccccc'} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seasonal Trends */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Seasonal Trends</h4>
           <div className="grid grid-cols-2 gap-4 h-full">
              {seasonalData.map((item) => {
                const Icon = seasonIcons[item.season];
                return (
                  <div
                    key={item.season}
                    onClick={() => onItemClick(`Seasonal Trend: ${item.season}`)}
                    className="cursor-pointer p-4 rounded-lg border hover:bg-accent transition-colors flex flex-col items-center justify-center text-center group"
                  >
                    {Icon && <Icon className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />}
                    <p className="font-semibold text-sm text-foreground">{item.season}</p>
                    <p className="text-2xl font-bold text-primary mt-1">+{item.increase}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.concern}</p>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default MarketingOpportunities;