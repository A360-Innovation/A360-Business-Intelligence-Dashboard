
import React from 'react';
import { ForecastDataPoint } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';

interface DemandForecastChartProps {
  data: ForecastDataPoint[];
}

const colors = {
    Botox: 'hsl(var(--primary))',
    Fillers: 'hsl(var(--success))',
    Peel: 'hsl(var(--warning))',
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-sm">
          <p className="font-bold text-card-foreground mb-2">{label}</p>
          {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.stroke }} className="text-sm">
              {`${pld.name.replace('_forecast', '')}: ${Math.round(pld.value)} ${pld.dataKey.includes('forecast') ? '(Forecast)' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
};

const DemandForecastChart: React.FC<DemandForecastChartProps> = ({ data }) => {
    const treatments = ['Botox', 'Fillers', 'Peel'];
    const forecastStartIndex = data.findIndex(d => d.hasOwnProperty('Botox_forecast'));
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Predicted Treatment Demand (Next 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                            
                            {forecastStartIndex > -1 && (
                                <ReferenceArea x1={data[forecastStartIndex - 1].month} x2={data[data.length - 1].month} stroke="none" fill="hsl(var(--secondary))" fillOpacity={0.5} label={{ value: "Forecast", position: "insideTopLeft", fill: "hsl(var(--muted-foreground))", fontSize: 12, dy: 10, dx: 10 }} />
                            )}

                            {treatments.map(treatment => (
                                <Line
                                    key={treatment}
                                    type="monotone"
                                    dataKey={treatment}
                                    stroke={colors[treatment as keyof typeof colors]}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                    connectNulls
                                    name={treatment}
                                />
                            ))}
                            {treatments.map(treatment => (
                                <Line
                                    key={`${treatment}_forecast`}
                                    type="monotone"
                                    dataKey={`${treatment}_forecast`}
                                    stroke={colors[treatment as keyof typeof colors]}
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                    connectNulls
                                    name={treatment}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default DemandForecastChart;
