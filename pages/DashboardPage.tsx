

import React, { useState, useRef, useEffect } from 'react';
import { Timeframe, NarrativePaneInfo } from '../types';
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
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import Loader from '../components/icons/Loader';

declare const Shepherd: any;

const DashboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('Monthly');
  const [narrativePane, setNarrativePane] = useState<NarrativePaneInfo>({
    isOpen: false,
    title: '',
    content: '',
  });
  const [analysisCache, setAnalysisCache] = useState<{ [key: string]: string }>({});
  
  const { data, loading, error } = useDashboardData();
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
        buttons: [{ action: tour.back, classes: 'shepherd-button-secondary', text: 'Back' }, { action: tour.next, text: 'Next' }]
    });
    
    tour.addStep({
        id: 'timeframe',
        title: 'Timeframe Selection',
        text: 'Easily switch between Monthly and Weekly views to see data from different periods.',
        attachTo: { element: '#timeframe-switcher', on: 'bottom' },
        buttons: [{ action: tour.back, classes: 'shepherd-button-secondary', text: 'Back' }, { action: tour.next, text: 'Next' }]
    });

    tour.addStep({
        id: 'metrics',
        title: 'Key Performance Indicators (KPIs)',
        text: 'These cards show your most important metrics at a glance. Click any card to open a detailed, AI-generated analysis.',
        attachTo: { element: '#metric-cards-grid', on: 'bottom' },
        buttons: [{ action: tour.back, classes: 'shepherd-button-secondary', text: 'Back' }, { action: tour.next, text: 'Next' }]
    });
    
    tour.addStep({
        id: 'concerns',
        title: 'Interactive Charts',
        text: 'Visualizations like this "Patient Concerns" chart are interactive. Click on a slice to drill down for more specific data.',
        attachTo: { element: '#concerns-chart-card', on: 'bottom' },
        buttons: [{ action: tour.back, classes: 'shepherd-button-secondary', text: 'Back' }, { action: tour.next, text: 'Next' }]
    });

    tour.addStep({
        id: 'chat',
        title: 'A360 Chat',
        text: 'Have a specific question? Use our AI-powered chat to query your clinic data using natural language.',
        attachTo: { element: '#nav-item-chat', on: 'right' },
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
    // Check cache first
    if (analysisCache[title]) {
      setNarrativePane({
        isOpen: true,
        title: title,
        content: analysisCache[title],
      });
      return; // Found in cache, no need to fetch
    }

    // Not in cache, show loading and fetch
    setNarrativePane({
      isOpen: true,
      title: title,
      content: 'loading',
    });

    const titleToEndpointSlug: { [key: string]: string } = {
        'Total Transcripts': 'total-transcripts',
        'Overall Satisfaction': 'overall-satisfaction',
        'Education Effectiveness': 'education-effectiveness',
        'Top Procedures': 'top-procedures',
        // Fallbacks for titles that might come from older mock data
        'Total Transcripts This Month': 'total-transcripts',
        'Overall Satisfaction Score': 'overall-satisfaction',
        'Top Procedures Recommended': 'top-procedures',
        'Total Transcripts This Week': 'total-transcripts',
    };
    
    const endpointSlug = titleToEndpointSlug[title];

    if (endpointSlug) {
      try {
        const endpoint = `https://chat-stream-production.up.railway.app/reports/${endpointSlug}?months=4`;
        const response = await fetch(endpoint);
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
        
        // Update cache with new content
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
    } else {
        const fallbackContent = `Detailed analysis for **${title}**. This report provides an in-depth look at the underlying data, trends, and actionable insights. \n\n*This feature is under development. AI-generated content will be available here soon.*`;

        // Also cache fallback content
        setAnalysisCache(prevCache => ({
            ...prevCache,
            [title]: fallbackContent,
        }));

        setNarrativePane({
            isOpen: true,
            title: title,
            content: fallbackContent,
        });
    }
  };


  const handleCloseNarrative = () => {
    setNarrativePane({ ...narrativePane, isOpen: false });
  };

  const DashboardHeader = () => (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Insights Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of consultation data</p>
      </div>
      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
        <div id="timeframe-switcher" className="flex items-center bg-secondary rounded-lg p-1 text-sm font-medium">
          <Button
            onClick={() => setTimeframe('Monthly')}
            variant="ghost"
            size="sm"
            className={cn("w-20", timeframe === 'Monthly' && 'bg-card text-card-foreground shadow-sm')}
          >
            Monthly
          </Button>
          <Button
            onClick={() => setTimeframe('Weekly')}
            variant="ghost"
            size="sm"
            className={cn("w-20", timeframe === 'Weekly' && 'bg-card text-card-foreground shadow-sm')}
          >
            Weekly
          </Button>
        </div>
        <div className="relative">
          <select className="appearance-none bg-card border border-input rounded-md shadow-sm h-9 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
            <option>Last 4 months</option>
            {/* <option>Last 60 Days</option>
            <option>Last 90 Days</option> */}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        <Button variant="outline" size="sm" onClick={() => tourRef.current?.start()} className="h-9">
            <HelpCircle className="h-4 w-4 mr-2"/>
            Take a tour
        </Button>
      </div>
    </header>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-150px)]">
          <div className="flex flex-col items-center gap-4">
            <Loader />
            <p className="text-muted-foreground">Loading Dashboard Data...</p>
          </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <DashboardHeader />
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
      <DashboardHeader />
      
      <main>
        {/* High-Level Metrics */}
        <div id="metric-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {data.highLevelMetrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              tooltipText="This metric is calculated based on an aggregation of all consultation transcripts for the selected time period."
              onClick={() => handleOpenNarrative(metric.title)}
            />
          ))}
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              <div id="concerns-chart-card">
                <ConcernsChart 
                    data={data.concerns} 
                    onSliceClick={(name) => handleOpenNarrative(`Concern: ${name}`)}
                  />
              </div>
              <TreatmentTrendsChart 
                  data={data.treatmentTrends} 
                  onBarClick={(payload) => handleOpenNarrative(`Treatment Trend: ${payload.name}`)}
                />
              <MarketingOpportunities
                  demographicsData={data.demographics}
                  seasonalData={data.seasonalTrends}
                  onItemClick={(title) => handleOpenNarrative(title)}
                />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              <PatientExperienceChart
                  satisfactionData={data.satisfactionScores}
                  educationData={data.educationScores}
                  onPointClick={(payload) => handleOpenNarrative(`Patient Experience - ${payload.month}`)}
                />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TopProcedures 
                    data={data.topProcedures} 
                    onItemClick={(name) => handleOpenNarrative(`Top Procedure: ${name}`)}
                  />
                <WorkflowQuality 
                    data={data.workflowQuality}
                    onItemClick={(title) => handleOpenNarrative(`Workflow Quality: ${title}`)}
                  />
              </div>
              <SalesExcellence 
                  scores={data.salesExcellence}
                  onScoreClick={(skill) => handleOpenNarrative(`Sales Excellence: ${skill}`)}
                />
              <AnalysisFields 
                  insights={data.analysisFields}
                  onItemClick={(category) => handleOpenNarrative(`Analysis: ${category}`)}
                />
            </div>
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
