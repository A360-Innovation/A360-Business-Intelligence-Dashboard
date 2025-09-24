
import React, { useState } from 'react';
import { Page } from './types';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const pageTitles: { [key in Page]: string } = {
    dashboard: 'Dashboard',
    chat: 'A360 Chat',
  };

  return (
    <div className="flex h-screen bg-background text-foreground text-sm">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between py-4 px-6 border-b border-border bg-card">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-foreground">{pageTitles[currentPage]}</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'chat' && <ChatPage />}
        </main>
      </div>
    </div>
  );
};

export default App;