

import React from 'react';
import { Procedure, TreatmentAnalysisData } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Bar } from 'recharts';
import { MessageSquareWarning, Zap } from 'lucide-react';
import DashboardCard from '../DashboardCard';
import Loader from '../icons/Loader';

interface AnalysisDisplayProps {
  treatment: Procedure;
  analysisData: TreatmentAnalysisData | null;
  isLoading: boolean;
  error: string | null;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ treatment, analysisData, isLoading, error }) => {
    if (isLoading) {
        return (
             <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <Loader />
                    <p className="text-muted-foreground">Fetching Analysis for {treatment.name}...</p>
                </div>
            </div>
        )
    }

    if (error) {
         return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg max-w-lg">
                    <h2 className="text-lg font-semibold text-destructive">Failed to Load Analysis for {treatment.name}</h2>
                    <p className="text-destructive/80 mt-1 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!analysisData) {
        return (
             <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">No analysis data available</p>
                    <p className="text-muted-foreground mt-1">We couldn't find any data for {treatment.name} in the selected timeframe.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysisData.keyMetrics.map(metric => (
                   <Card key={metric.title}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{metric.value}</div>
                        </CardContent>
                   </Card>
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardCard
                    title="Common Patient Objections"
                    tooltipText="Identifies the most common concerns and objections patients express about this treatment so you can prepare."
                >
                    <div className="space-y-4">
                        {analysisData.objections.map(obj => (
                            <div key={obj.title + obj.description} className="flex items-start">
                                <MessageSquareWarning className="h-5 w-5 text-warning mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground">{obj.title} (Frequency: {obj.frequency})</h4>
                                    <p className="text-sm text-muted-foreground">{obj.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>
                
                 <DashboardCard
                    title="Cross-Sell Opportunities"
                    tooltipText="Discover which other treatments are frequently recommended alongside this one, creating up-selling opportunities."
                 >
                    <div className="space-y-4">
                         {analysisData.crossSell.map(item => (
                            <div key={item.name} className="flex items-start">
                                <Zap className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground">{item.name} (Frequency: {item.frequency})</h4>
                                    <p className="text-sm text-muted-foreground">{item.rationale}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>

                <DashboardCard
                    title="Patient Age Profile"
                    tooltipText="Understand the demographic profile of patients most interested in this treatment to focus your marketing efforts."
                    className="lg:col-span-2"
                >
                   <div style={{ width: '100%', height: 250 }}>
                       <ResponsiveContainer>
                            <BarChart data={analysisData.demographics.age_distribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="age_range" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <RechartsTooltip 
                                    cursor={{ fill: 'hsl(var(--accent))' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-card p-3 border border-border rounded-lg shadow-sm">
                                                    <p className="font-bold text-card-foreground mb-1">Age Range: {label}</p>
                                                    <p className="text-sm text-primary">{`Patient Count: ${payload[0].value}`}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="count" fill="hsl(var(--primary))" name="Patient Count" radius={[4, 4, 0, 0]} />
                            </BarChart>
                       </ResponsiveContainer>
                   </div>
                </DashboardCard>
            </div>
        </div>
    );
};

export default AnalysisDisplay;