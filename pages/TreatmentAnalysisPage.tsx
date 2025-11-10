import React, { useState, useEffect } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import Loader from '../components/icons/Loader';
import TreatmentSelector from '../components/treatments/TreatmentSelector';
import AnalysisDisplay from '../components/treatments/AnalysisDisplay';
import { Procedure } from '../types';
import { useTreatmentAnalysis } from '../hooks/useTreatmentAnalysis';
import { cn } from '../lib/utils';
import EducationEffectivenessDisplay from '../components/treatments/EducationEffectivenessDisplay';
import { ChevronDown } from 'lucide-react';
import { useClinicsList } from '../hooks/useClinicsList';
import { useAuth } from '../contexts/AuthContext';

const TreatmentAnalysisPage: React.FC = () => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const { isSuperAdmin } = useAuth();
    const { clinics } = useClinicsList();
    const [selectedClinic, setSelectedClinic] = useState<string>('All Clinics');

    const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardData({
        startDate: formatDate(threeMonthsAgo),
        endDate: formatDate(today),
        clinic: isSuperAdmin ? selectedClinic : '',
    });
    const [selectedTreatment, setSelectedTreatment] = useState<Procedure | null>(null);
    const [activeView, setActiveView] = useState<'analysis' | 'education'>('analysis');

    const { 
        analysisData,
        educationData, 
        loading: analysisLoading, 
        error: analysisError 
    } = useTreatmentAnalysis(selectedTreatment?.name || null, isSuperAdmin ? selectedClinic : '');

    if (dashboardLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <Loader />
                    <p className="text-muted-foreground">Loading Treatment Data...</p>
                </div>
            </div>
        );
    }

    if (dashboardError || !dashboardData) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg">
                    <h2 className="text-lg font-semibold text-destructive">Failed to Load Data</h2>
                    <p className="text-destructive/80 mt-1">{dashboardError || "An unknown error occurred."}</p>
                </div>
            </div>
        );
    }
    
    const renderContent = () => {
        if (!selectedTreatment) {
            return (
                <div className="flex items-center justify-center h-full p-8">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">Select a treatment to view analysis</p>
                        <p className="text-muted-foreground mt-1">Choose an item from the list on the left to begin.</p>
                    </div>
                </div>
            );
        }
        
        if (activeView === 'analysis') {
            return (
                <AnalysisDisplay
                    treatment={selectedTreatment}
                    analysisData={analysisData}
                    isLoading={analysisLoading}
                    error={analysisError}
                />
            );
        }

        if (activeView === 'education') {
            return (
                 <EducationEffectivenessDisplay
                    treatment={selectedTreatment}
                    educationData={educationData}
                    isLoading={analysisLoading}
                    error={analysisError}
                />
            );
        }

        return null;
    };


    return (
        <div className="flex flex-col lg:flex-row h-full">
            <TreatmentSelector
                treatments={dashboardData.topProcedures}
                selectedTreatment={selectedTreatment}
                onSelect={(treatment) => {
                    setSelectedTreatment(treatment);
                    setActiveView('analysis');
                }}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                {selectedTreatment && (
                    <header className="p-4 sm:p-6 lg:p-8 pb-0 border-b border-border flex-shrink-0">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{selectedTreatment.name}</h1>
                                <p className="text-muted-foreground mt-1">Deep dive into performance, patient profile, and communication strategies.</p>
                            </div>
                            {isSuperAdmin && (
                                <div className="mt-4 sm:mt-0">
                                    <label htmlFor="clinic-select" className="sr-only">Select Clinic</label>
                                    <div className="relative">
                                        <select
                                            id="clinic-select"
                                            value={selectedClinic}
                                            onChange={(e) => setSelectedClinic(e.target.value)}
                                            className="appearance-none h-9 w-48 rounded-md border border-input bg-card pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            {clinics.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                             )}
                        </div>
                        <nav className="mt-4 -mb-px flex space-x-6">
                            <button
                                onClick={() => setActiveView('analysis')}
                                className={cn(
                                    "py-3 px-1 border-b-2 font-semibold text-sm",
                                    activeView === 'analysis'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                )}
                            >
                                Overall Analysis
                            </button>
                            <button
                                onClick={() => setActiveView('education')}
                                className={cn(
                                    "py-3 px-1 border-b-2 font-semibold text-sm",
                                    activeView === 'education'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                )}
                            >
                                Education Effectiveness
                            </button>
                        </nav>
                    </header>
                )}
                 <div className="flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default TreatmentAnalysisPage;