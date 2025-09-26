
import React, { useState } from 'react';
import { PatientJourney } from '../types';
import { journeyData } from '../data/journeyData';
import JourneySelector from '../components/journey/JourneySelector';
import JourneyTimeline from '../components/journey/JourneyTimeline';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PatientJourneyPage: React.FC = () => {
    const [selectedJourney, setSelectedJourney] = useState<PatientJourney | null>(null);

    if (!selectedJourney) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground">Patient Journey Visualization</h1>
                    <p className="text-muted-foreground mt-1">Select a patient archetype to trace their experience from start to finish.</p>
                </header>
                <JourneySelector journeys={journeyData} onSelect={setSelectedJourney} />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Button variant="ghost" onClick={() => setSelectedJourney(null)} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Journey Selection
            </Button>
            <JourneyTimeline journey={selectedJourney} />
        </div>
    );
};

export default PatientJourneyPage;
