'use client';

import React, { useState, useContext } from 'react';
import { Page } from './types';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './views/DashboardPage';
import ChatPage from './views/ChatPage';
import PodcastsPage from './views/PodcastsPage';
import PracticePage from './views/PracticePage';
import TreatmentAnalysisPage from './views/TreatmentAnalysisPage';
import PatientJourneyPage from './views/PatientJourneyPage';
import PerformancePage from './views/PerformancePage';
import ForecastingPage from './views/ForecastingPage';
import MarketIntelPage from './views/MarketIntelPage';
import OpportunitiesPage from './views/OpportunitiesPage';
import PromptsPage from './views/PromptsPage';
import SettingsPage from './views/SettingsPage';
import KpisPage from './views/KpisPage';
import ClinicPerformancePage from './views/ClinicPerformancePage';
import TranscriptsPage from './views/TranscriptsPage';
import { PlayerProvider, PlayerContext } from './contexts/PlayerContext';
import Player from './components/Player';
import ExpandedPlayer from './components/ExpandedPlayer';
import { cn } from './lib/utils';
import { Menu } from 'lucide-react';
import LoginPage from './views/LoginPage';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

const AuthenticatedApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { currentPodcast } = useContext(PlayerContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isSuperAdmin } = useAuth();

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
    settings: 'Settings',
    kpis: 'Daily KPIs',
    clinicPerformance: 'Clinic Performance',
    transcripts: 'Transcripts Explorer',
  };

  return (
    <div className="flex h-screen bg-background text-foreground text-sm">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-[70px] px-6 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden mr-4 p-2 -ml-2 rounded-md text-muted-foreground hover:bg-secondary"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">{pageTitles[currentPage]}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div 
                className="flex items-center gap-3 cursor-pointer rounded-lg p-1 pr-2 hover:bg-secondary transition-colors"
                onClick={() => setCurrentPage('settings')}
                title="View profile and settings"
            >
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {user?.email?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="text-left hidden sm:block">
                    <p className="font-semibold text-sm text-foreground truncate max-w-[150px]">{user?.email || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{isSuperAdmin ? 'Super Admin' : 'Practitioner'}</p>
                </div>
            </div>
          </div>
        </header>
        <main className={cn("flex-1 overflow-y-auto bg-background", currentPodcast && "pb-24")}>
          <ErrorBoundary>
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
            {currentPage === 'settings' && <SettingsPage />}
            {currentPage === 'kpis' && <KpisPage />}
            {currentPage === 'clinicPerformance' && <ClinicPerformancePage />}
            {currentPage === 'transcripts' && <TranscriptsPage />}
          </ErrorBoundary>
        </main>
        {currentPodcast && <Player />}
        <ExpandedPlayer />
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const { session } = useAuth();

  if (!session) {
    return <LoginPage />;
  }

  return (
    <PlayerProvider>
      <AuthenticatedApp />
    </PlayerProvider>
  );
};

export default App;
