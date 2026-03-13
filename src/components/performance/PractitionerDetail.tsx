import React from 'react';
import { PractitionerProfile } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus, CheckCircle2, Lightbulb } from 'lucide-react';
import { cn } from '../../lib/utils';
import DashboardCard from '../DashboardCard';
import Tooltip from '../Tooltip';
import { HelpCircle } from 'lucide-react';

interface PractitionerDetailProps {
  practitioner: PractitionerProfile | null;
}

const TrendIcon = ({ direction }: { direction: 'up' | 'down' | 'neutral' }) => {
    if (direction === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
    if (direction === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const PractitionerDetail: React.FC<PractitionerDetailProps> = ({ practitioner }) => {
    if (!practitioner) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">Select a practitioner</p>
                    <p className="text-muted-foreground mt-1">Choose a profile from the list to view their detailed performance analysis.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <header className="flex items-center gap-4">
                <img src={practitioner.avatarUrl} alt={practitioner.name} className="h-20 w-20 rounded-full object-cover shadow-md" />
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{practitioner.name}</h1>
                    <p className="text-muted-foreground mt-1 text-lg">{practitioner.role}</p>
                </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {practitioner.keyMetrics.map(metric => (
                   <Card key={metric.title}>
                        <CardHeader className="pb-2 flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                             <Tooltip content="This key metric summarizes the practitioner's performance in a specific area, showing the current value and trend compared to the previous period.">
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Tooltip>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-primary">{metric.value}</span>
                                <div className={cn(
                                    "flex items-center text-xs text-muted-foreground",
                                    metric.trendDirection === 'up' && 'text-success',
                                    metric.trendDirection === 'down' && 'text-destructive',
                                )}>
                                    <TrendIcon direction={metric.trendDirection} />
                                    <span>{metric.trend}</span>
                                </div>
                            </div>
                        </CardContent>
                   </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <DashboardCard
                    title="Skill Competency Profile"
                    tooltipText="This radar chart visualizes the practitioner's key competencies, comparing their performance across different areas of the consultation."
                    className="lg:col-span-3"
                >
                   <div style={{ width: '100%', height: 350 }}>
                       <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={practitioner.skillScores}>
                                <PolarGrid stroke="hsl(var(--border))"/>
                                <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name={practitioner.name} dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} fill="hsl(var(--primary))" fillOpacity={0.4} />
                            </RadarChart>
                       </ResponsiveContainer>
                   </div>
                </DashboardCard>
                <div className="lg:col-span-2 space-y-4 flex flex-col">
                    <DashboardCard
                        title="Strengths"
                        tooltipText="These are the most prominent strengths identified by the AI from analyzing consultation transcripts."
                        className="flex-1"
                        headerContent={<CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />}
                    >
                         <ul className="space-y-2">
                            {practitioner.strengths.map((item, i) => (
                                <li key={i} className="text-sm text-muted-foreground">{item}</li>
                            ))}
                         </ul>
                    </DashboardCard>
                    <DashboardCard
                         title="Opportunities"
                         tooltipText="Specific areas where the practitioner can improve their communication and sales skills, with concrete suggestions."
                         className="flex-1"
                         headerContent={<Lightbulb className="h-5 w-5 text-warning flex-shrink-0" />}
                    >
                         <ul className="space-y-2">
                            {practitioner.opportunities.map((item, i) => (
                                <li key={i} className="text-sm text-muted-foreground">{item}</li>
                            ))}
                         </ul>
                    </DashboardCard>
                </div>
            </div>

        </div>
    );
};

export default PractitionerDetail;