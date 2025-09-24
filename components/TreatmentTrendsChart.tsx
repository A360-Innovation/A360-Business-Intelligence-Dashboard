import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendData } from '../types';
import DashboardCard from './DashboardCard';

interface TreatmentTrendsChartProps {
  data: TrendData[];
  onBarClick: (payload: any) => void;
}

const barColors = ['#547BA3', '#7795B9', '#9AB3D0', '#BDD1E6', '#E0EEFA'];

const TreatmentTrendsChart: React.FC<TreatmentTrendsChartProps> = ({ data, onBarClick }) => {
  const treatments = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'month') : [];

  return (
    <DashboardCard title="Treatment Trends (Top 5 MoM)" tooltipText="Monthly comparisons are generated from transcript analysis to identify trends in recommended treatments.">
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" />
            <XAxis dataKey="month" tick={{ fill: '#667085', fontSize: 12 }} />
            <YAxis tick={{ fill: '#667085', fontSize: 12 }} />
            <RechartsTooltip />
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontSize: '12px',
                color: 'hsl(var(--muted-foreground))',
                paddingTop: '10px',
              }}
            />
            {treatments.map((treatment, index) => (
              <Bar key={treatment} dataKey={treatment} fill={barColors[index % barColors.length]} onClick={onBarClick} className="cursor-pointer" />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default TreatmentTrendsChart;