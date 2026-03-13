
import React from 'react';
import { PatientJourney } from '../../types';
import JourneyEventCard from './JourneyEventCard';

interface JourneyTimelineProps {
    journey: PatientJourney;
}

const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ journey }) => {
    return (
        <div>
            <header className="mb-8 p-6 bg-card border border-border rounded-xl">
                <h2 className="text-2xl font-bold text-foreground">{journey.title}</h2>
                <p className="text-muted-foreground mt-1">{journey.description}</p>
                <div className="mt-4 text-sm text-muted-foreground">
                    Patient Profile: <span className="font-semibold text-foreground">{journey.patientProfile.name}, {journey.patientProfile.age}</span> | Main Concern: <span className="font-semibold text-foreground">{journey.patientProfile.concern}</span>
                </div>
            </header>
            <div className="relative pl-8">
                {/* Vertical Line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border ml-[11px]"></div>
                
                <div className="space-y-8">
                    {journey.events.map((event, index) => (
                        <JourneyEventCard key={index} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JourneyTimeline;
