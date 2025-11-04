

import React from 'react';
import { Page } from '../../types';
import { cn } from '../../lib/utils';
import { LayoutDashboard, BotMessageSquare, Mic, Beaker, Target, BookText, Settings, X, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const categorizedNavItems = [
  {
    category: 'Analytics',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'opportunities', label: 'Opportunities', icon: Target },
      { id: 'treatments', label: 'Treatments', icon: Beaker },
    ]
  },
  {
    category: 'AI Tools',
    items: [
      { id: 'chat', label: 'A360 Chat', icon: BotMessageSquare },
      { id: 'prompts', label: 'Prompt Library', icon: BookText },
      { id: 'podcasts', label: 'Podcasts', icon: Mic },
    ]
  }
];

const settingsNavItem = { id: 'settings', label: 'Settings', icon: Settings };

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  
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
        <div className="h-[70px] px-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center">
            <img src="https://ik.imagekit.io/0fheaxmfc/Main%20Logo.png?updatedAt=1754492000386" alt="Aesthetics360 Logo" className="h-10 w-auto" />
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 -mr-2 rounded-md hover:bg-secondary"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {categorizedNavItems.map((categoryGroup) => (
            <div key={categoryGroup.category}>
              <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{categoryGroup.category}</h3>
              <div className="space-y-1">
                {categoryGroup.items.map((item) => {
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
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-secondary text-foreground font-semibold"
                          : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                        !isClickable && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border space-y-1">
           <a
              id={`nav-item-${settingsNavItem.id}`}
              key={settingsNavItem.id}
              href="#"
              onClick={(e) => { e.preventDefault(); handleLinkClick(settingsNavItem.id as Page); }}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                currentPage === settingsNavItem.id
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <settingsNavItem.icon className="mr-3 h-5 w-5" />
              {settingsNavItem.label}
            </a>
            <a
              id="nav-item-logout"
              href="#"
              onClick={(e) => { e.preventDefault(); logout(); }}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;