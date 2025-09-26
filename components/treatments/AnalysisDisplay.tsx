
import React from 'react';
import { Procedure, DemographicConcern } from '../../types';
import { TreatmentAnalysis } from '../../data/treatmentAnalysisData';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Bar } from 'recharts';
import { MessageSquareWarning, ScrollText, Zap } from 'lucide-react';

interface AnalysisDisplayProps {
  treatment: Procedure | null;
  analysisData: TreatmentAnalysis | null;
  demographicsData: DemographicConcern[];
}

const concernColors: { [key: string]: string } = {
    'Acne': '#547BA3', 'Pigmentation': '#7795B9', 'Scarring': '#9AB3D0',
    'Wrinkles': '#BDD1E6', 'Texture': '#E0EEFA', 'Sagging': '#416288',
    'Volume Loss': '#324D6A',
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ treatment, analysisData, demographicsData }) => {
    if (!treatment || !analysisData) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">Select a treatment to view analysis</p>
                    <p className="text-muted-foreground mt-1">Choose an item from the list on the left to begin.</p>
                </div>
            </div>
        );
    }

    // Prepare data for demographics chart
    const relevantConcerns = Object.keys(concernColors);
    const chartData = demographicsData.map(group => {
        const concernsForGroup = group.concerns.filter(c => relevantConcerns.includes(c.name));
        return {
            group: group.group,
            value: concernsForGroup.reduce((sum, c) => sum + c.value, 0) // Example: sum of values
        };
    });

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-foreground">{treatment.name} Analysis</h1>
                <p className="text-muted-foreground mt-1">Deep dive into performance, patient profile, and communication strategies.</p>
            </header>
            
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
                <Card>
                    <CardHeader><CardTitle>Common Patient Objections</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {analysisData.objections.map(obj => (
                            <div key={obj.title} className="flex items-start">
                                <MessageSquareWarning className="h-5 w-5 text-warning mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground">{obj.title}</h4>
                                    <p className="text-sm text-muted-foreground">{obj.description}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Effective Scripts & Talking Points</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                         {analysisData.effectiveScripts.map(item => (
                            <div key={item.title} className="flex items-start">
                                <ScrollText className="h-5 w-5 text-success mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground italic">"{item.script}"</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader><CardTitle>Cross-Sell Opportunities</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                         {analysisData.crossSell.map(item => (
                            <div key={item.name} className="flex items-start">
                                <Zap className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground">{item.rationale}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Patient Demographics Profile</CardTitle></CardHeader>
                    <CardContent>
                       <div style={{ width: '100%', height: 250 }}>
                           <ResponsiveContainer>
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="group" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <RechartsTooltip />
                                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Concern Score" />
                                </BarChart>
                           </ResponsiveContainer>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalysisDisplay;
