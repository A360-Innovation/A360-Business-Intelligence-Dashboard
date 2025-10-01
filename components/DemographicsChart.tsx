
import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Bar } from 'recharts';
import { DemographicConcern } from '../types';
import DashboardCard from './DashboardCard';

interface DemographicsChartProps {
  demographicsData: DemographicConcern[];
  onItemClick: (title: string) => void;
}

const concernColors: { [key: string]: string } = {
    'Acne': 'hsl(212, 33%, 49%)',
    'Pigmentation': 'hsl(211, 35%, 60%)',
    'Scarring': 'hsl(214, 32%, 74%)',
    'Wrinkles': 'hsl(212, 33%, 39%)',
    'Texture': 'hsl(217, 33%, 86%)',
    'Sagging': 'hsl(213, 33%, 32%)',
    'Volume Loss': 'hsl(212, 31%, 28%)',
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

// Custom shape for rounded corners on each stacked bar segment
const RoundedBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  const radius = 4;
  if (width <= 0) return null; // Don't render zero-width bars
  return (
    <g>
        <path
            d={`M${x + radius},${y}h${width - 2 * radius}a${radius},${radius},0,0,1,${radius},${radius}v${height - 2 * radius}a${radius},${radius},0,0,1,-${radius},${radius}h-${width - 2 * radius}a${radius},${radius},0,0,1,-${radius},-${radius}v-${height - 2 * radius}a${radius},${radius},0,0,1,${radius},-${radius}z`}
            fill={fill}
            stroke="hsl(var(--card))"
            strokeWidth={2}
        />
    </g>
  );
};

const DemographicsChart: React.FC<DemographicsChartProps> = ({ demographicsData, onItemClick }) => {
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
    <DashboardCard
      title="Concerns by Demographics"
      tooltipText="Data is segmented by patient age from transcript demographics."
      className="h-full"
    >
      <div className="w-full h-[350px]">
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 20 }}
            barCategoryGap="25%"
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
                <Bar key={concern} dataKey={concern} stackId="a" fill={concernColors[concern] || '#cccccc'} onClick={() => onItemClick(`Demographic Concern: ${concern}`)} className="cursor-pointer" shape={<RoundedBar />} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default DemographicsChart;