
import React from 'react';
import { PractitionerProfile } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus, CheckCircle2, Lightbulb } from 'lucide-react';
import { cn } from '../../lib/utils';

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
                            <TrendIcon direction={metric.trendDirection} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{metric.value}</div>
                            <p className={cn(
                                "text-xs text-muted-foreground",
                                metric.trendDirection === 'up' && 'text-success',
                                metric.trendDirection === 'down' && 'text-destructive',
                            )}>
                                {metric.trend} vs last period
                            </p>
                        </CardContent>
                   </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader><CardTitle>Skill Competency Profile</CardTitle></CardHeader>
                    <CardContent>
                       <div style={{ width: '100%', height: 350 }}>
                           <ResponsiveContainer>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={practitioner.skillScores}>
                                    <PolarGrid stroke="hsl(var(--border))"/>
                                    <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name={practitioner.name} dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                                    <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}/>
                                </RadarChart>
                           </ResponsiveContainer>
                       </div>
                    </CardContent>
                </Card>
                <div className="lg:col-span-2 space-y-4 flex flex-col">
                    <Card className="flex-1">
                        <CardHeader className="flex-row items-center gap-2">
                             <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                             <CardTitle>Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-2">
                                {practitioner.strengths.map((item, i) => (
                                    <li key={i} className="text-sm text-muted-foreground">{item}</li>
                                ))}
                             </ul>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                         <CardHeader className="flex-row items-center gap-2">
                             <Lightbulb className="h-5 w-5 text-warning flex-shrink-0" />
                             <CardTitle>Opportunities</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-2">
                                {practitioner.opportunities.map((item, i) => (
                                    <li key={i} className="text-sm text-muted-foreground">{item}</li>
                                ))}
                             </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
};

export default PractitionerDetail;
