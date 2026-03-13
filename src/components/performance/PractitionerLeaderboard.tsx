'use client';


import React, { useState } from 'react';
import { PractitionerProfile } from '../../types';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ChevronsUpDown } from 'lucide-react';

interface PractitionerLeaderboardProps {
  practitioners: PractitionerProfile[];
  setPractitioners: (practitioners: PractitionerProfile[]) => void;
  selectedPractitioner: PractitionerProfile | null;
  onSelect: (practitioner: PractitionerProfile) => void;
}

const PractitionerLeaderboard: React.FC<PractitionerLeaderboardProps> = ({ practitioners, setPractitioners, selectedPractitioner, onSelect }) => {
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    const sortPractitioners = (key: 'overallScore' | 'name') => {
        const sorted = [...practitioners].sort((a, b) => {
            if (key === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            return sortOrder === 'asc' ? a.overallScore - b.overallScore : b.overallScore - a.overallScore;
        });
        setPractitioners(sorted);
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <aside className="w-full lg:w-80 flex-shrink-0 bg-card border-b lg:border-b-0 lg:border-r border-border lg:h-full flex flex-col">
            <div className="p-4 border-b border-border">
                <h2 className="font-bold text-foreground">Practitioner List</h2>
                <div className="flex items-center gap-2 mt-3">
                     <Button variant="outline" size="sm" onClick={() => sortPractitioners('overallScore')} className="flex-1 text-xs">
                        Sort by Score <ChevronsUpDown className="h-3 w-3 ml-2"/>
                     </Button>
                     <Button variant="outline" size="sm" onClick={() => sortPractitioners('name')} className="flex-1 text-xs">
                        Sort by Name <ChevronsUpDown className="h-3 w-3 ml-2"/>
                     </Button>
                </div>
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {practitioners.map(p => (
                    <div
                        key={p.id}
                        onClick={() => onSelect(p)}
                        className={cn(
                            'flex items-center p-2 rounded-md cursor-pointer transition-colors',
                            selectedPractitioner?.id === p.id 
                                ? 'bg-secondary' 
                                : 'hover:bg-accent'
                        )}
                    >
                        <img src={p.avatarUrl} alt={p.name} className="h-10 w-10 rounded-full object-cover" />
                        <div className="ml-3 flex-1">
                            <p className="font-semibold text-sm text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.role}</p>
                        </div>
                        <div className="text-right">
                             <div className={cn(
                                 "flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold",
                                 p.overallScore > 90 ? "bg-success/20 text-success" : p.overallScore > 80 ? "bg-primary/20 text-primary" : "bg-warning/20 text-warning"
                             )}>
                                 {p.overallScore}
                             </div>
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default PractitionerLeaderboard;