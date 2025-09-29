
import React from 'react';
import { Page } from '../../types';
import { cn } from '../../lib/utils';
import { LayoutDashboard, BotMessageSquare, Mic, GraduationCap, Beaker, Route, Users, TrendingUp, Globe, Target, BookText } from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
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

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <aside className="w-64 flex flex-col bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center">
          <img src="https://ik.imagekit.io/0fheaxmfc/Main%20Logo.png?updatedAt=1754492000386" alt="Aesthetics360 Logo" className="h-8 w-auto" />
        </div>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isClickable = true; // All items are clickable now
          const isActive = currentPage === item.id;
          return (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (isClickable) {
                  setCurrentPage(item.id as Page);
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
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
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
  );
};

export default Sidebar;
