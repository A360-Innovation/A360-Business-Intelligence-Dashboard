
import React from 'react';
import { EmergingConcern } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface EmergingConcernsProps {
  concerns: EmergingConcern[];
}

const EmergingConcerns: React.FC<EmergingConcernsProps> = ({ concerns }) => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-warning" />
                    Emerging Patient Concerns
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {concerns.map(concern => (
                        <div key={concern.name} className="flex items-start">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                                <TrendingUp className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-foreground">{concern.name}</h4>
                                    <span className="text-sm font-bold text-success">+{concern.growth}%</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{concern.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default EmergingConcerns;
