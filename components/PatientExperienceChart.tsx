import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
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
          <LineChart data={combinedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis domain={[70, 100]} tickFormatter={(tick) => `${tick}%`} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontSize: '12px',
                paddingTop: '10px',
                color: 'hsl(var(--muted-foreground))',
              }}
            />
            <Line 
                name="Overall Satisfaction" 
                type="monotone" 
                dataKey="satisfaction" 
                stroke="hsl(var(--primary))"
                strokeWidth={2} 
                dot={{ r: 4, fill: 'hsl(var(--primary))' }} 
                // Fix: Corrected the onClick handler signature. It receives a single props object.
                activeDot={{ r: 6, onClick: (props: any) => onPointClick(props.payload) }} 
                className="cursor-pointer" 
            />
            <Line 
                name="Education Effectiveness" 
                type="monotone" 
                dataKey="education" 
                stroke="hsl(var(--success))"
                strokeWidth={2} 
                dot={{ r: 4, fill: 'hsl(var(--success))' }} 
                // Fix: Corrected the onClick handler signature. It receives a single props object.
                activeDot={{ r: 6, onClick: (props: any) => onPointClick(props.payload) }} 
                className="cursor-pointer"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default PatientExperienceChart;