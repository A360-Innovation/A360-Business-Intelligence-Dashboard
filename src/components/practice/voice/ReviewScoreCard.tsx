

import React from 'react';
import { cn } from '../../../lib/utils';
import { CardContent } from '../../ui/card';
import DashboardCard from '../../DashboardCard';

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
        <DashboardCard
            title={title}
            tooltipText="This score is automatically calculated by analyzing your transcript for effective communication markers related to this skill."
        >
            <p className="text-xs text-muted-foreground -mt-4 mb-2">{description}</p>
            <p className={cn("text-5xl font-bold", getScoreColor(score))}>{score}<span className="text-3xl text-muted-foreground">%</span></p>
        </DashboardCard>
    );
};

export default ReviewScoreCard;