import React, { useState, useRef, useEffect } from 'react';
import { NarrativePaneInfo } from '../types';
import MetricCard from '../components/MetricCard';
import ConcernsChart from '../components/ConcernsChart';
import TopProcedures from '../components/TopProcedures';
import TreatmentTrendsChart from '../components/TreatmentTrendsChart';
import PatientExperienceChart from '../components/PatientExperienceChart';
import WorkflowQuality from '../components/WorkflowQuality';
import MarketingOpportunities from '../components/MarketingOpportunities';
import SalesExcellence from '../components/SalesExcellence';
import AnalysisFields from '../components/AnalysisFields';
import NarrativePane from '../components/NarrativePane';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { Download, HelpCircle, ChevronDown } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import Loader from '../components/icons/Loader';
import DateRangePicker from '../components/DateRangePicker';
import { useAuth } from '../contexts/AuthContext';
import { useClinicsList } from '../hooks/useClinicsList';


declare const Shepherd: any;

const DashboardPage: React.FC = () => {
  const [narrativePane, setNarrativePane] = useState<NarrativePaneInfo>({
    isOpen: false,
    title: '',
    content: '',
  });
  const [analysisCache, setAnalysisCache] = useState<{ [key: string]: string }>({});
  const { session, isSuperAdmin } = useAuth();

  const getInitialDateRange = () => {
    return {
      startDate: '2025-06-01',
      endDate: '2025-10-31',
    };
  };

  const [dateRange, setDateRange] = useState(getInitialDateRange());
  const { clinics } = useClinicsList();
  const [selectedClinic, setSelectedClinic] = useState<string>('All Clinics');
  
  const { data, loading, error } = useDashboardData({ 
    startDate: dateRange.startDate, 
    endDate: dateRange.endDate,
    clinic: isSuperAdmin ? selectedClinic : '',
  });
  const tourRef = useRef<any>(null);


  useEffect(() => {
    if (typeof Shepherd === 'undefined' || loading || error) {
        return;
    }

    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'shadow-md',
        scrollTo: { behavior: 'smooth', block: 'center' },
        cancelIcon: {
            enabled: true,
        },
      }
    });

    tour.addStep({
        id: 'welcome',
        title: 'Welcome to Aesthetics360!',
        text: 'This guided tour will walk you through the key features of your clinic dashboard. Let\'s get started!',
        buttons: [{ action: tour.next, text: 'Next' }]
    });

    tour.addStep({
        id: 'navigation',
        title: 'Main Navigation',
        text: 'Use the sidebar to navigate between different modules like the Dashboard, Chat, Practice Mode, and more.',
        attachTo: { element: '#sidebar', on: 'right' },
        buttons: [{ action: tour.back, classes: 'shepherd-button-secondary', text: 'Back' }, { action: tour.next, text: 'Finish' }]
    });

    tour.addStep({
        id: 'metrics',
        title: 'Key Performance Indicators (KPIs)',
        text: 'These cards show your most important metrics at a glance. Click on any card with an available AI analysis to open a detailed, AI-generated report.',
        attachTo: { element: '#metric-cards-grid', on: 'bottom' },
        buttons: [{ action: tour.back, classes: 'shepherd-button-secondary', text: 'Back' }, { action: tour.next, text: 'Finish' }]
    });
    
    tour.addStep({
        id: 'concerns',
        title: 'Interactive Charts',
        text: 'Visualizations like this "Patient Concerns" chart are interactive. You can click on slices to drill down and explore the data.',
        attachTo: { element: '#concerns-chart-card', on: 'bottom' },
        buttons: [{ action: tour.back, classes: 'shepherd-button-secondary', text: 'Back' }, { action: tour.next, text: 'Finish' }]
    });

    tourRef.current = tour;

    return () => {
        if (tour.isActive()) {
            tour.cancel();
        }
    };
  }, [loading, error]);


  const handleOpenNarrative = async (title: string) => {
    if (!session) {
        setNarrativePane({ isOpen: true, title, content: 'Authentication error: Please log in again.' });
        return;
    }
    // Defines which titles have an AI analysis endpoint.
    const titleToEndpointSlug: { [key: string]: string } = {
        'Total Transcripts': 'total-transcripts',
        'Overall Satisfaction Score': 'overall-satisfaction',
        'Education Effectiveness': 'education-effectiveness',
        'Top Procedures Recommended': 'top-procedures',
    };
    
    const endpointSlug = titleToEndpointSlug[title];

    // If no endpoint is configured for this title, do nothing.
    if (!endpointSlug) {
      console.warn(`No AI analysis endpoint configured for: "${title}". Modal will not open.`);
      return;
    }

    // Check cache first
    if (analysisCache[title]) {
      setNarrativePane({
        isOpen: true,
        title: title,
        content: analysisCache[title],
      });
      return;
    }

    // Not in cache, show loading and fetch
    setNarrativePane({
      isOpen: true,
      title: title,
      content: 'loading',
    });

    try {
      const endpoint = `https://chat-stream-production.up.railway.app/reports/${endpointSlug}?months=4`;
      const response = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (!response.ok) {
        let errorBody = 'Could not retrieve details from the server.';
        try {
          const errorJson = await response.json();
          errorBody = errorJson.detail || errorBody;
        } catch (e) { /* ignore JSON parsing errors */ }
        throw new Error(`API Error ${response.status}: ${errorBody}`);
      }
      const data = await response.json();
      const analysisContent = data.analysis || 'No analysis available for this topic.';
      
      setAnalysisCache(prevCache => ({
          ...prevCache,
          [title]: analysisContent,
      }));
      
      setNarrativePane({
        isOpen: true,
        title: title,
        content: analysisContent,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setNarrativePane({
        isOpen: true,
        title: title,
        content: `### An error occurred\n\nWe were unable to load the analysis. Please try again later.\n\n**Details:**\n\`\`\`\n${errorMessage}\n\`\`\``,
      });
    }
  };


  const handleCloseNarrative = () => {
    setNarrativePane({ ...narrativePane, isOpen: false });
  };

  const DashboardSubHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Clinic Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Key metrics and trends for the selected period.</p>
      </div>
      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
         <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <div>
                <label htmlFor="clinic" className="sr-only">Clinic</label>
                <div className="relative">
                  <select
                      id="clinic"
                      name="clinic"
                      value={selectedClinic}
                      onChange={(e) => setSelectedClinic(e.target.value)}
                      className="appearance-none h-9 w-48 rounded-md border border-input bg-card pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      aria-label="Select Clinic"
                  >
                      {clinics.map(c => (
                          <option key={c} value={c}>{c}</option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            )}
            <DateRangePicker
                value={{ from: dateRange.startDate, to: dateRange.endDate }}
                onChange={({ from, to }) => setDateRange({ startDate: from, endDate: to })}
            />
          </div>
        <Button variant="outline" size="sm" onClick={() => tourRef.current?.start()} className="h-9">
            <HelpCircle className="h-4 w-4 mr-2"/>
            Take a tour
        </Button>
        <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Export
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <DashboardSubHeader />
        <div className="flex items-center justify-center h-[calc(100vh-250px)]">
            <div className="flex flex-col items-center gap-4">
              <Loader />
              <p className="text-muted-foreground">Loading Dashboard Data...</p>
            </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <DashboardSubHeader />
        <div className="flex items-center justify-center h-[calc(100vh-250px)]">
            <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg">
              <h2 className="text-lg font-semibold text-destructive">Failed to Load Dashboard</h2>
              <p className="text-destructive/80 mt-1">{error || "An unknown error occurred. Please try again later."}</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <main className="space-y-6">
        <DashboardSubHeader />

        {/* High-Level Metrics */}
        <div id="metric-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.highLevelMetrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={metric.icon}
              onClick={() => handleOpenNarrative(metric.title)}
            />
          ))}
        </div>
        
        {/* Primary Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5" id="concerns-chart-card">
                <ConcernsChart 
                    data={data.concerns} 
                    onSliceClick={(name) => handleOpenNarrative(`Concern: ${name}`)}
                />
            </div>
            <div className="lg:col-span-7">
                <TreatmentTrendsChart 
                    data={data.treatmentTrends} 
                    onBarClick={(payload) => handleOpenNarrative(`Treatment Trend: ${payload.name}`)}
                />
            </div>
        </div>
        
        {/* Secondary Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
                <PatientExperienceChart
                    satisfactionData={data.satisfactionScores}
                    educationData={data.educationScores}
                    onPointClick={(payload) => handleOpenNarrative(`Patient Experience - ${payload.month}`)}
                />
            </div>
            <div className="lg:col-span-5">
                <TopProcedures 
                    data={data.topProcedures} 
                    onItemClick={(name) => handleOpenNarrative(`Top Procedure: ${name}`)}
                />
            </div>
        </div>

        {/* Growth Opportunities */}
        <div className="grid grid-cols-1 gap-6">
            <MarketingOpportunities
                demographicsData={data.demographics}
                seasonalData={data.seasonalTrends}
                onItemClick={(title) => handleOpenNarrative(title)}
            />
        </div>

        {/* Qualitative Insights & Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SalesExcellence 
                scores={data.salesExcellence}
                onScoreClick={(skill) => handleOpenNarrative(`Sales Excellence: ${skill}`)}
            />
            <WorkflowQuality 
                data={data.workflowQuality}
                onItemClick={(title) => handleOpenNarrative(`Workflow Quality: ${title}`)}
            />
            <AnalysisFields 
                insights={data.analysisFields}
                onItemClick={(category) => handleOpenNarrative(`Analysis: ${category}`)}
            />
        </div>
      </main>

      <NarrativePane
        isOpen={narrativePane.isOpen}
        title={narrativePane.title}
        content={narrativePane.content}
        onClose={handleCloseNarrative}
      />
    </div>
  );
};

export default DashboardPage;