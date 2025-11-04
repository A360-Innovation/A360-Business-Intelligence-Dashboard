import React from 'react';
import DateRangePicker from '../ui/DateRangePicker';

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

    const handleDateRangeChange = (range: { from: Date, to: Date }) => {
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        setFilters({
            ...filters,
            day_from: formatDate(range.from),
            day_to: formatDate(range.to)
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
                 <label className="text-xs font-medium text-muted-foreground">Date Range</label>
                 <DateRangePicker
                    date={{
                        from: new Date(filters.day_from + 'T00:00:00'),
                        to: new Date(filters.day_to + 'T00:00:00')
                    }}
                    onDateChange={handleDateRangeChange}
                 />
            </div>
        </div>
    );
};

export default FilterBar;