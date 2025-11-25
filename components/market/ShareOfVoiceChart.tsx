import React from 'react';
import { ShareOfVoice } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DashboardCard from '../DashboardCard';

interface ShareOfVoiceChartProps {
  data: ShareOfVoice[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-sm">
          <p className="font-bold text-card-foreground mb-1">{label}</p>
          <p className="text-sm text-primary">{`Share of Voice: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
};


const ShareOfVoiceChart: React.FC<ShareOfVoiceChartProps> = ({ data }) => {
    return (
        <DashboardCard
            title="Share of Voice (Local Market)"
            tooltipText="Measure your brand's visibility compared to competitors in online conversations and local media mentions."
        >
             <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barSize={20}>
                        <defs>
                            <linearGradient id="gradPrimary" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                                <stop offset="100%" stopColor="hsl(212, 56%, 75%)" stopOpacity={1} />
                            </linearGradient>
                             <linearGradient id="gradSecondary" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity={1} />
                                <stop offset="100%" stopColor="hsl(var(--border))" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                        <XAxis type="number" tickFormatter={(tick) => `${tick}%`} domain={[0, 40]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
                        <Bar dataKey="value" name="Share of Voice" radius={[0, 10, 10, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.name === "Aesthetics360" ? 'url(#gradPrimary)' : 'url(#gradSecondary)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </DashboardCard>
    );
};

export default ShareOfVoiceChart;