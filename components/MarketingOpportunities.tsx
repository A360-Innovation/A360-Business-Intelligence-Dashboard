
import React from 'react';
import { DemographicConcern, SeasonalTrend } from '../types';
import DashboardCard from './DashboardCard';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, LabelList } from 'recharts';

interface MarketingOpportunitiesProps {
  demographicsData: DemographicConcern[];
  seasonalData: SeasonalTrend[];
  onItemClick: (title: string) => void;
}

const barColors = ['bg-primary', 'bg-primary/70', 'bg-primary/40'];

const MarketingOpportunities: React.FC<MarketingOpportunitiesProps> = ({ demographicsData, seasonalData, onItemClick }) => {
  return (
    <DashboardCard title="Marketing & Growth Opportunities" tooltipText="Data is segmented by patient age and season from transcript timestamps and demographics.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Concerns by Demographics */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Concerns by Demographics</h4>
          <div className="space-y-4">
            {demographicsData.map(group => (
              <div key={group.group} onClick={() => onItemClick(`Demographics: ${group.group}`)} className="cursor-pointer p-3 rounded-lg border hover:bg-accent transition-colors">
                <p className="font-bold text-sm text-muted-foreground mb-2">Ages {group.group}</p>
                <ul className="space-y-2">
                  {group.concerns.map((concern, index) => (
                    <li key={concern.name} className="text-xs text-muted-foreground">
                      <div className="flex justify-between items-center">
                        <span>{concern.name}</span>
                        <span className="font-medium text-foreground">{concern.value}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className={`${barColors[index]} h-1.5 rounded-full`} style={{ width: `${concern.value}%` }}></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Trends */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Seasonal Trends</h4>
           <div style={{ width: '100%', height: 350 }} onClick={() => onItemClick('Seasonal Trends')}>
                <ResponsiveContainer>
                    <BarChart data={seasonalData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
                        <XAxis type="number" hide domain={[0, 40]} />
                        <YAxis type="category" dataKey="season" width={50} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip cursor={{fill: 'hsl(var(--accent))'}} contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} />
                        <Bar dataKey="increase" fill="hsl(var(--primary))" background={{ fill: 'hsl(var(--background))' }} radius={[0, 4, 4, 0]} barSize={25}>
                           <LabelList 
                             dataKey="increase" 
                             position="right"
                             formatter={(value: number) => `+${value}%`}
                             style={{ fill: 'hsl(var(--primary))', fontSize: 12, fontWeight: 'bold' }}
                           />
                           <LabelList
                             dataKey="concern"
                             position="insideLeft"
                             offset={10}
                             style={{ fill: 'hsl(var(--primary-foreground))', fontSize: 12 }}
                           />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default MarketingOpportunities;
