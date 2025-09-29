
import React, { useState, useContext } from 'react';
import { Page } from './types';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import PodcastsPage from './pages/PodcastsPage';
import PracticePage from './pages/PracticePage';
import TreatmentAnalysisPage from './pages/TreatmentAnalysisPage';
import PatientJourneyPage from './pages/PatientJourneyPage';
import PerformancePage from './pages/PerformancePage';
import ForecastingPage from './pages/ForecastingPage';
import MarketIntelPage from './pages/MarketIntelPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import PromptsPage from './pages/PromptsPage';
import { PlayerProvider, PlayerContext } from './contexts/PlayerContext';
import Player from './components/Player';
import { cn } from './lib/utils';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { currentPodcast } = useContext(PlayerContext);

  const pageTitles: { [key in Page]: string } = {
    dashboard: 'Dashboard',
    chat: 'A360 Chat',
    podcasts: 'Weekly Podcasts',
    practice: 'Consultation Simulator',
    treatments: 'Treatment Analysis',
    journey: 'Patient Journey',
    performance: 'Practitioner Performance',
    forecasting: 'Forecasting & Trends',
    market: 'Market Intelligence',
    opportunities: 'Opportunities Hub',
    prompts: 'Prompt Library',
  };

  return (
    <div className="flex h-screen bg-background text-foreground text-sm">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between py-4 px-6 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-foreground">{pageTitles[currentPage]}</h1>
          </div>
        </header>
        <main className={cn("flex-1 overflow-y-auto bg-background", currentPodcast && "pb-24")}>
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'chat' && <ChatPage />}
          {currentPage === 'podcasts' && <PodcastsPage />}
          {currentPage === 'practice' && <PracticePage />}
          {currentPage === 'treatments' && <TreatmentAnalysisPage />}
          {currentPage === 'journey' && <PatientJourneyPage />}
          {currentPage === 'performance' && <PerformancePage />}
          {currentPage === 'forecasting' && <ForecastingPage />}
          {currentPage === 'market' && <MarketIntelPage />}
          {currentPage === 'opportunities' && <OpportunitiesPage />}
          {currentPage === 'prompts' && <PromptsPage />}
        </main>
        {currentPodcast && <Player />}
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
};

export default App;
