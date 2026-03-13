import React from 'react';
import { JourneyEvent, JourneyEventType } from '../../types';
import { cn } from '../../lib/utils';
import { Phone, ClipboardList, MessageSquareWarning, ThumbsUp, Syringe, CalendarCheck, Star } from 'lucide-react';

interface JourneyEventCardProps {
    event: JourneyEvent;
}

const eventConfig: { [key in JourneyEventType]: { icon: React.ElementType, color: string } } = {
    Inquiry: { icon: Phone, color: 'bg-blue-500' },
    Consultation: { icon: ClipboardList, color: 'bg-primary' },
    Objection: { icon: MessageSquareWarning, color: 'bg-warning' },
    Resolution: { icon: ThumbsUp, color: 'bg-success' },
    Treatment: { icon: Syringe, color: 'bg-purple-500' },
    // Fix: Object property keys with hyphens must be quoted.
    'Follow-up': { icon: CalendarCheck, color: 'bg-teal-500' },
    Satisfaction: { icon: Star, color: 'bg-amber-500' },
};

const JourneyEventCard: React.FC<JourneyEventCardProps> = ({ event }) => {
    const { icon: Icon, color } = eventConfig[event.type];

    return (
        <div className="relative flex items-start">
            {/* Icon on the timeline */}
            <div className={cn("absolute left-[-32px] top-1 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background", color)}>
                <Icon className="h-3 w-3 text-white" />
            </div>
            
            {/* Event Details Card */}
            <div className="ml-4 w-full">
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-foreground">{event.title}</h4>
                        <span className="text-xs font-medium text-muted-foreground">{event.date}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{event.summary}</p>
                </div>
            </div>
        </div>
    );
};

export default JourneyEventCard;