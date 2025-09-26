
import React, { useState } from 'react';
import { PractitionerProfile } from '../types';
import { performanceData } from '../data/performanceData';
import PractitionerLeaderboard from '../components/performance/PractitionerLeaderboard';
import PractitionerDetail from '../components/performance/PractitionerDetail';

const PerformancePage: React.FC = () => {
    const [practitioners, setPractitioners] = useState<PractitionerProfile[]>(performanceData);
    const [selectedPractitioner, setSelectedPractitioner] = useState<PractitionerProfile | null>(practitioners[0] || null);
    
    return (
        <div className="flex h-full">
            <PractitionerLeaderboard 
                practitioners={practitioners}
                setPractitioners={setPractitioners}
                selectedPractitioner={selectedPractitioner}
                onSelect={setSelectedPractitioner}
            />
            <div className="flex-1 overflow-y-auto">
                <PractitionerDetail practitioner={selectedPractitioner} />
            </div>
        </div>
    );
};

export default PerformancePage;
