import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendData } from '../types';
import DashboardCard from './DashboardCard';

interface TreatmentTrendsChartProps {
  data: TrendData[];
  onBarClick: (payload: any) => void;
}

const gradientColors = ['hsl(212, 33%, 49%)', 'hsl(212, 33%, 59%)', 'hsl(212, 33%, 69%)', 'hsl(211, 35%, 75%)', 'hsl(217, 33%, 86%)'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-sm">
          <p className="font-bold text-card-foreground mb-2">{label}</p>
          {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.fill }} className="text-sm font-semibold">
              {`${pld.name}: ${pld.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

// Custom shape for rounded bar tops
const RoundedBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  const radius = 6;
  return (
    <g>
      <path d={`M${x},${y + radius} A${radius},${radius},0,0,1,${x + radius},${y} L${x + width - radius},${y} A${radius},${radius},0,0,1,${x + width},${y + radius} L${x + width},${y + height} L${x},${y + height} Z`} fill={fill} />
    </g>
  );
};


const TreatmentTrendsChart: React.FC<TreatmentTrendsChartProps> = ({ data, onBarClick }) => {
  const treatments = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'month') : [];

  return (
    <DashboardCard title="Treatment Trends (Top 5 MoM)" tooltipText="Monthly comparisons are generated from transcript analysis to identify trends in recommended treatments.">
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              {gradientColors.map((color, index) => (
                <linearGradient key={index} id={`grad${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.2} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--secondary))' }} />
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontSize: '12px',
                color: 'hsl(var(--muted-foreground))',
                paddingTop: '10px',
              }}
            />
            {treatments.map((treatment, index) => (
              <Bar 
                key={treatment} 
                dataKey={treatment} 
                fill={`url(#grad${index % gradientColors.length})`} 
                onClick={onBarClick} 
                className="cursor-pointer"
                shape={<RoundedBar />}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default TreatmentTrendsChart;