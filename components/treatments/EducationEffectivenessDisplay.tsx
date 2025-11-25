import React from 'react';
import { Procedure, TreatmentEducationData } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { AlertCircle } from 'lucide-react';
import DashboardCard from '../DashboardCard';
import Loader from '../icons/Loader';
import { cn } from '../../lib/utils';

interface EducationEffectivenessDisplayProps {
  treatment: Procedure;
  educationData: TreatmentEducationData | null;
  isLoading: boolean;
  error: string | null;
}

const COLORS: { [key: string]: string } = {
    excellent: 'hsl(142, 71%, 45%)', // Success
    good: 'hsl(212, 33%, 49%)', // Primary
    fair: 'hsl(48, 96%, 50%)', // Warning
    poor: 'hsl(0, 84%, 60%)', // Destructive
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-sm">
          <p className="font-bold text-card-foreground mb-1">{payload[0].name}</p>
          <p className="text-sm text-primary">{`Consultations: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
};


const EducationEffectivenessDisplay: React.FC<EducationEffectivenessDisplayProps> = ({ treatment, educationData, isLoading, error }) => {
    if (isLoading) {
        return (
             <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <Loader />
                    <p className="text-muted-foreground">Fetching Education Data for {treatment.name}...</p>
                </div>
            </div>
        );
    }

    if (error) {
         return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg max-w-lg">
                    <h2 className="text-lg font-semibold text-destructive">Failed to Load Education Data for {treatment.name}</h2>
                    <p className="text-destructive/80 mt-1 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!educationData) {
        return (
             <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">No education data available</p>
                    <p className="text-muted-foreground mt-1">We couldn't find any data for {treatment.name} in the selected timeframe.</p>
                </div>
            </div>
        );
    }

    const pieData = educationData.label_distribution.map(d => ({ 
        name: d.label.charAt(0).toUpperCase() + d.label.slice(1), 
        value: d.count 
    }));

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Consultations Analyzed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{educationData.total_consultations}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Education Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", educationData.avg_education_effectiveness_pct >= 80 ? 'text-success' : educationData.avg_education_effectiveness_pct >= 60 ? 'text-warning' : 'text-destructive')}>
                            {educationData.avg_education_effectiveness_pct}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <DashboardCard
                    title="Effectiveness Distribution"
                    tooltipText="Breakdown of education effectiveness scores across all consultations for this treatment."
                    className="lg:col-span-3"
                >
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    paddingAngle={5}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()] || '#cccccc'} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </DashboardCard>

                <DashboardCard
                    title="Common Education Gaps"
                    tooltipText="Identifies areas where patient education could be improved, based on transcript analysis."
                    className="lg:col-span-2"
                >
                    <ul className="space-y-3">
                        {educationData.common_education_gaps.map((gap, index) => (
                            <li key={index} className="flex items-start text-sm">
                                <AlertCircle className="h-4 w-4 text-warning mr-3 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-foreground capitalize">{gap.gap}</p>
                                    <p className="text-muted-foreground text-xs">Frequency: {gap.frequency}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </DashboardCard>
            </div>
        </div>
    );
};

export default EducationEffectivenessDisplay;