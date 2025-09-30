





import React from 'react';
import { Page } from '../../types';
import { cn } from '../../lib/utils';
import { LayoutDashboard, BotMessageSquare, Mic, GraduationCap, Beaker, Route, Users, TrendingUp, Globe, Target, BookText, Settings, X } from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'opportunities', label: 'Opportunities', icon: Target },
  { id: 'chat', label: 'A360 Chat', icon: BotMessageSquare },
  { id: 'prompts', label: 'Prompt Library', icon: BookText },
  { id: 'podcasts', label: 'Podcasts', icon: Mic },
  { id: 'practice', label: 'Practice Mode', icon: GraduationCap },
  { id: 'treatments', label: 'Treatments', icon: Beaker },
  { id: 'journey', label: 'Patient Journey', icon: Route },
  { id: 'performance', label: 'Performance', icon: Users },
  { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
  { id: 'market', label: 'Market Intel', icon: Globe },
];

const bottomNavItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const handleLinkClick = (page: Page) => {
    setCurrentPage(page);
    setIsOpen(false); // Close sidebar on navigation on mobile
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      ></div>
      
      {/* Sidebar Panel */}
      <aside 
        id="sidebar" 
        className={cn(
          "w-64 flex flex-col bg-card border-r border-border fixed lg:relative inset-y-0 left-0 z-40",
          "transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center">
            <img src="https://ik.imagekit.io/0fheaxmfc/Main%20Logo.png?updatedAt=1754492000386" alt="Aesthetics360 Logo" className="h-8 w-auto" />
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 -mr-2 rounded-md hover:bg-secondary"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isClickable = true;
            const isActive = currentPage === item.id;
            return (
              <a
                id={`nav-item-${item.id}`}
                key={item.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (isClickable) {
                    handleLinkClick(item.id as Page);
                  }
                }}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                  !isClickable && "opacity-50 cursor-not-allowed"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </nav>
        
        <div className="p-2 border-t border-border">
           {bottomNavItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <a
                id={`nav-item-${item.id}`}
                key={item.id}
                href="#"
                onClick={(e) => { e.preventDefault(); handleLinkClick(item.id as Page); }}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </a>
            );
          })}
          <div className="flex items-center p-2 mt-2 border-t border-border">
            <div className="w-8 h-8 rounded-full bg-destructive/20 text-destructive flex items-center justify-center font-bold">
              K
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-foreground">kate+demo</p>
              <p className="text-xs text-muted-foreground">kate+demo@aesth...</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;