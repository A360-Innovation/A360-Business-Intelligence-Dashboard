
import React from 'react';
import { PatientJourney } from '../../types';
import { User, Activity, HelpCircle } from 'lucide-react';
import Tooltip from '../Tooltip';

interface JourneySelectorProps {
    journeys: PatientJourney[];
    onSelect: (journey: PatientJourney) => void;
}

const JourneySelector: React.FC<JourneySelectorProps> = ({ journeys, onSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeys.map(journey => (
                <div 
                    key={journey.id}
                    onClick={() => onSelect(journey)}
                    className="bg-card border border-border rounded-xl flex flex-col p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1.5 hover:border-primary relative group"
                >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip content="Analyze patient archetypes to understand their complete experiences, from initial inquiry to follow-up, identifying points of friction and success.">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Tooltip>
                    </div>
                    <h3 className="font-bold text-lg text-primary">{journey.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 flex-grow">{journey.description}</p>
                    <div className="mt-6 pt-4 border-t border-border space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                            <User className="h-4 w-4 mr-2 text-primary/70" />
                            <span><strong className="text-foreground">{journey.patientProfile.name}</strong>, Age {journey.patientProfile.age}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                            <Activity className="h-4 w-4 mr-2 text-primary/70" />
                            <span>Primary Concern: <strong className="text-foreground">{journey.patientProfile.concern}</strong></span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JourneySelector;
