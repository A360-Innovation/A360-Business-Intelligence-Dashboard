import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { PatientExperienceData } from '../types';
import DashboardCard from './DashboardCard';

interface PatientExperienceChartProps {
  satisfactionData: PatientExperienceData[];
  educationData: PatientExperienceData[];
  onPointClick: (payload: any) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-sm">
          <p className="font-bold text-card-foreground mb-2">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }} className="text-sm">
              {`${pld.name}: ${pld.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

const PatientExperienceChart: React.FC<PatientExperienceChartProps> = ({ satisfactionData, educationData, onPointClick }) => {
  const combinedData = satisfactionData.map((item, index) => ({
    month: item.month,
    satisfaction: item.score,
    education: educationData[index].score,
  }));
  
  return (
    <DashboardCard title="Patient Experience & Sentiment" tooltipText="Scores are derived from NLP markers in transcripts, analyzing patient language for satisfaction and understanding.">
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <AreaChart data={combinedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="educationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[70, 100]} tickFormatter={(tick) => `${tick}%`} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false}/>
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontSize: '12px',
                paddingTop: '10px',
                color: 'hsl(var(--muted-foreground))',
              }}
            />
            <Area 
                name="Overall Satisfaction" 
                type="monotone" 
                dataKey="satisfaction"
                stroke="hsl(var(--primary))"
                fill="url(#satisfactionGradient)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
                // Fix: Correctly access the data payload from the 'props' object provided by recharts instead of the raw event target.
                activeDot={{ r: 6, onClick: (props: any) => onPointClick(props.payload), stroke: 'hsl(var(--primary))', fill: 'hsl(var(--card))', strokeWidth: 2 }} 
                className="cursor-pointer"
                style={{ filter: `drop-shadow(0 2px 4px hsl(var(--primary) / 0.4))` }}
            />
             <Area 
                name="Education Effectiveness" 
                type="monotone" 
                dataKey="education"
                stroke="hsl(var(--success))"
                fill="url(#educationGradient)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'hsl(var(--success))', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
                // Fix: Correctly access the data payload from the 'props' object provided by recharts instead of the raw event target.
                activeDot={{ r: 6, onClick: (props: any) => onPointClick(props.payload), stroke: 'hsl(var(--success))', fill: 'hsl(var(--card))', strokeWidth: 2 }} 
                className="cursor-pointer"
                style={{ filter: `drop-shadow(0 2px 4px hsl(var(--success) / 0.4))` }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default PatientExperienceChart;