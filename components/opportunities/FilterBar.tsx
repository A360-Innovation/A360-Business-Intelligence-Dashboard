import React from 'react';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';
import DateRangePicker from '../DateRangePicker';

interface FilterBarProps {
  filters: { type: string; day_from: string; day_to: string; clinic: string };
  setFilters: (filters: { type: string; day_from: string; day_to: string; clinic: string }) => void;
  clinics: string[];
  isSuperAdmin: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, clinics, isSuperAdmin }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleDateRangeChange = ({ from, to }: { from: string; to: string }) => {
        setFilters(prev => ({ ...prev, day_from: from, day_to: to }));
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
                    <option value="upselling">Upselling</option>
                    <option value="cross_selling">Cross-Selling</option>
                    <option value="follow_up">Follow-up</option>
                </select>
            </div>
            {isSuperAdmin && (
                <div className="w-full sm:w-auto">
                    <label htmlFor="clinic" className="text-xs font-medium text-muted-foreground">Clinic</label>
                    <div className="relative mt-1">
                        <select
                            id="clinic"
                            name="clinic"
                            value={filters.clinic}
                            onChange={handleInputChange}
                            className="appearance-none h-9 w-full sm:w-48 rounded-md border-input bg-secondary border-transparent pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            {clinics.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            )}
            <div className="w-full sm:w-auto sm:ml-auto">
                 <label className="text-xs font-medium text-muted-foreground block mb-1">Date Range</label>
                 <DateRangePicker
                    value={{ from: filters.day_from, to: filters.day_to }}
                    onChange={handleDateRangeChange}
                />
            </div>
        </div>
    );
};

export default FilterBar;