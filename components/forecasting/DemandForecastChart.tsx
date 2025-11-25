import React from 'react';
import { ForecastDataPoint } from '../../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import DashboardCard from '../DashboardCard';

interface DemandForecastChartProps {
  data: ForecastDataPoint[];
}

const colors: { [key: string]: string } = {
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
            <p key={pld.dataKey} style={{ color: colors[pld.name.replace('_forecast', '')] }} className="text-sm">
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
        <DashboardCard
            title="Predicted Treatment Demand (Next 6 Months)"
            tooltipText="Visualize the projected demand for key treatments over the next six months, based on historical data and predictive models."
        >
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                          {treatments.map(t => (
                              <linearGradient key={t} id={`grad-${t}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colors[t]} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={colors[t]} stopOpacity={0}/>
                              </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                        
                        {forecastStartIndex > -1 && (
                            <ReferenceArea x1={data[forecastStartIndex].month} x2={data[data.length - 1].month} stroke="none" fill="hsl(var(--secondary))" fillOpacity={0.5} />
                        )}

                        {treatments.map(treatment => (
                            <Area
                                key={treatment}
                                type="monotone"
                                dataKey={treatment}
                                stroke={colors[treatment]}
                                fill={`url(#grad-${treatment})`}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 5, stroke: 'hsl(var(--card))', strokeWidth: 2 }}
                                connectNulls
                                name={treatment}
                                style={{ filter: `drop-shadow(0px 2px 4px ${colors[treatment]}60)` }}
                            />
                        ))}
                        {treatments.map(treatment => (
                            <Area
                                key={`${treatment}_forecast`}
                                type="monotone"
                                dataKey={`${treatment}_forecast`}
                                stroke={colors[treatment]}
                                fill="transparent"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                activeDot={{ r: 5, stroke: 'hsl(var(--card))', strokeWidth: 2 }}
                                connectNulls
                                name={`${treatment} (Forecast)`}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </DashboardCard>
    );
};

export default DemandForecastChart;