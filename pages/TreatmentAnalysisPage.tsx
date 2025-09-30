

import React, { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import Loader from '../components/icons/Loader';
import TreatmentSelector from '../components/treatments/TreatmentSelector';
import AnalysisDisplay from '../components/treatments/AnalysisDisplay';
import { treatmentAnalysisData } from '../data/treatmentAnalysisData';
import { Procedure } from '../types';

const TreatmentAnalysisPage: React.FC = () => {
    const { data: dashboardData, loading, error } = useDashboardData();
    const [selectedTreatment, setSelectedTreatment] = useState<Procedure | null>(null);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <Loader />
                    <p className="text-muted-foreground">Loading Treatment Data...</p>
                </div>
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg">
                    <h2 className="text-lg font-semibold text-destructive">Failed to Load Data</h2>
                    <p className="text-destructive/80 mt-1">{error || "An unknown error occurred."}</p>
                </div>
            </div>
        );
    }

    const analysisData = selectedTreatment ? treatmentAnalysisData[selectedTreatment.name] : null;

    return (
        <div className="flex flex-col lg:flex-row h-full">
            <TreatmentSelector
                treatments={dashboardData.topProcedures}
                selectedTreatment={selectedTreatment}
                onSelect={setSelectedTreatment}
            />
            <div className="flex-1 overflow-y-auto">
                <AnalysisDisplay
                    treatment={selectedTreatment}
                    analysisData={analysisData}
                    demographicsData={dashboardData.demographics}
                />
            </div>
        </div>
    );
};

export default TreatmentAnalysisPage;