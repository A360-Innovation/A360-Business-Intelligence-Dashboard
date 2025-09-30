

import React, { useState } from 'react';
import { Procedure } from '../../types';
import { cn } from '../../lib/utils';
import { Search } from 'lucide-react';

interface TreatmentSelectorProps {
  treatments: Procedure[];
  selectedTreatment: Procedure | null;
  onSelect: (treatment: Procedure) => void;
}

const TreatmentSelector: React.FC<TreatmentSelectorProps> = ({ treatments, selectedTreatment, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTreatments = treatments.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <aside className="w-full lg:w-80 flex-shrink-0 bg-card border-b lg:border-b-0 lg:border-r border-border lg:h-full flex flex-col">
            <div className="p-4 border-b border-border">
                <h2 className="font-bold text-foreground mb-3">Select a Treatment</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search treatments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-secondary border border-transparent rounded-md h-9 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {filteredTreatments.length > 0 ? filteredTreatments.map(treatment => (
                    <a
                        key={treatment.name}
                        href="#"
                        onClick={(e) => { e.preventDefault(); onSelect(treatment); }}
                        className={cn(
                            'block px-3 py-2 text-sm font-medium rounded-md transition-colors',
                            selectedTreatment?.name === treatment.name
                                ? 'bg-secondary text-foreground'
                                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                        )}
                    >
                        {treatment.name}
                    </a>
                )) : (
                    <p className="p-3 text-sm text-muted-foreground text-center">No treatments found.</p>
                )}
            </nav>
        </aside>
    );
};

export default TreatmentSelector;