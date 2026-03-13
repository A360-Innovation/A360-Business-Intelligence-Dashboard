
import React from 'react';
import { Opportunity } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { Lightbulb, HelpCircle, Building2 } from 'lucide-react';
import Tooltip from '../Tooltip';

interface OpportunityCardProps {
    opportunity: Opportunity;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
    const formattedDate = new Date(opportunity.day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const getConfidenceBadgeClass = (score: number | null) => {
        if (score === null) return 'bg-gray-100 text-gray-600';
        if (score >= 0.9) return 'bg-success/10 text-success';
        if (score >= 0.7) return 'bg-primary/10 text-primary';
        return 'bg-warning/10 text-warning';
    };

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-base capitalize">{opportunity.type.replace('_', ' ')}</CardTitle>
                        <Tooltip content="This card highlights a key moment from a consultation. The 'snippet' is the direct quote, and the 'AI rationale' explains why it's a coaching opportunity.">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Tooltip>
                    </div>
                    <span className="text-xs text-muted-foreground">{formattedDate}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground text-sm">
                    "{opportunity.snippet}"
                </blockquote>
                {opportunity.rationale && (
                    <div className="mt-4 flex items-start gap-2 p-3 bg-secondary rounded-lg">
                        <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground"><span className="font-semibold">AI Rationale:</span> {opportunity.rationale}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center text-xs text-muted-foreground flex-wrap gap-x-4 gap-y-2">
                <p>Transcript ID: <span className="font-mono text-primary/80">{opportunity.transcript_id.slice(0, 8)}...</span></p>
                {opportunity.clinic && (
                    <div className="flex items-center gap-1.5" title={opportunity.clinic}>
                        <Building2 className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate max-w-[120px]">{opportunity.clinic}</span>
                    </div>
                )}
                {opportunity.confidence !== null && (
                     <Badge className={cn("text-xs", getConfidenceBadgeClass(opportunity.confidence))}>
                        Confidence: {(opportunity.confidence * 100).toFixed(0)}%
                     </Badge>
                )}
            </CardFooter>
        </Card>
    );
};

export default OpportunityCard;