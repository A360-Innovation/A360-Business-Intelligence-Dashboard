
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
import SettingsPage from './pages/SettingsPage';
import { PlayerProvider, PlayerContext } from './contexts/PlayerContext';
import Player from './components/Player';
import ExpandedPlayer from './components/ExpandedPlayer';
import { cn } from './lib/utils';
import { Menu, Search, Bell, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './components/ui/button';
import LoginPage from './pages/LoginPage';
import { useAuth } from './contexts/AuthContext';

const AuthenticatedApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { currentPodcast } = useContext(PlayerContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 bg-secondary border-none rounded-lg h-9 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <Bell className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={() => setCurrentPage('settings')}>
                <SettingsIcon className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-destructive/20 text-destructive flex items-center justify-center font-bold text-xs ml-2">
              K
            </div>
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
          {currentPage === 'settings' && <SettingsPage />}
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