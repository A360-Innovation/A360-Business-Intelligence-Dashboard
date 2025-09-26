
import React from 'react';
import { cn } from '../../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';

interface ReviewScoreCardProps {
    score: number;
    title: string;
    description: string;
}

const ReviewScoreCard: React.FC<ReviewScoreCardProps> = ({ score, title, description }) => {
    const getScoreColor = (s: number) => {
        if (s >= 90) return 'text-success';
        if (s >= 70) return 'text-primary';
        if (s >= 50) return 'text-warning';
        return 'text-destructive';
    };
    
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-xs">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className={cn("text-5xl font-bold", getScoreColor(score))}>{score}<span className="text-3xl text-muted-foreground">%</span></p>
            </CardContent>
        </Card>
    );
};

export default ReviewScoreCard;
