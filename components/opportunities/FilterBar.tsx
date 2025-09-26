
import React from 'react';
import { Button } from '../ui/button';

interface FilterBarProps {
  filters: { type: string; day_from: string; day_to: string; };
  setFilters: (filters: { type: string; day_from: string; day_to: string; }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };
    
    return (
        <div className="p-4 bg-card border border-border rounded-lg flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto">
                <label htmlFor="type" className="text-xs font-medium text-muted-foreground">Opportunity Type</label>
                <select 
                    id="type"
                    name="type" 
                    value={filters.type} 
                    onChange={handleInputChange}
                    className="mt-1 appearance-none w-full bg-secondary border border-transparent rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                    <option value="objection_handling">Objection Handling</option>
                    <option value="upselling" disabled>Upselling (coming soon)</option>
                    <option value="rapport" disabled>Rapport (coming soon)</option>
                </select>
            </div>
            <div className="w-full sm:w-auto">
                 <label htmlFor="day_from" className="text-xs font-medium text-muted-foreground">From</label>
                 <input 
                    type="date"
                    id="day_from"
                    name="day_from"
                    value={filters.day_from}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none w-full bg-secondary border border-transparent rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
            </div>
            <div className="w-full sm:w-auto">
                 <label htmlFor="day_to" className="text-xs font-medium text-muted-foreground">To</label>
                 <input 
                    type="date"
                    id="day_to"
                    name="day_to"
                    value={filters.day_to}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none w-full bg-secondary border border-transparent rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
            </div>
        </div>
    );
};

export default FilterBar;
