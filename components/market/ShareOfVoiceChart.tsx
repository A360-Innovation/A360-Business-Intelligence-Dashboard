import React from 'react';
import { ShareOfVoice } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ShareOfVoiceChartProps {
  data: ShareOfVoice[];
}

const COLORS = ['hsl(var(--primary))', '#7795B9', '#9AB3D0', '#BDD1E6', '#E0EEFA'];

const ShareOfVoiceChart: React.FC<ShareOfVoiceChartProps> = ({ data }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                    Share of Voice (Local Market)
                </CardTitle>
            </CardHeader>
            <CardContent>
                 <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                            <XAxis type="number" tickFormatter={(tick) => `${tick}%`} domain={[0, 40]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
                            <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
                            <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} formatter={(value: number) => `${value}%`} />
                            <Bar dataKey="value" name="Share of Voice">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === "Aesthetics360" ? 'hsl(var(--primary))' : COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default ShareOfVoiceChart;
