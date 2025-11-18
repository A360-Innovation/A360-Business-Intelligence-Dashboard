import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '../lib/utils';

// Helper to format dates to 'YYYY-MM-DD'
const toISOStringShort = (date: Date) => date.toISOString().split('T')[0];

interface DateRangePickerProps {
    value: { from: string; to: string };
    onChange: (range: { from: string; to: string }) => void;
    className?: string;
}

const presetRanges = [
    { label: 'Demo Period (2025)', getRange: () => ({ from: new Date('2025-06-01T00:00:00'), to: new Date('2025-10-31T00:00:00') }) },
    { label: 'Last 7 Days', days: 6 }, // 6 days ago to today = 7 days total
    { label: 'Last 30 Days', days: 29 },
    { label: 'Last 90 Days', days: 89 },
    { label: 'Last 12 Months', days: 365 },
    { label: 'This Month', getRange: () => {
        const now = new Date();
        return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
    }},
    { label: 'Last Month', getRange: () => {
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const to = new Date(now.getFullYear(), now.getMonth(), 0);
        return { from, to };
    }},
    { label: 'Year to Date', getRange: () => {
        const now = new Date();
        return { from: new Date(now.getFullYear(), 0, 1), to: now };
    }}
];

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Use string values for local state to match native input
    const [range, setRange] = useState({ from: value.from, to: value.to });
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Sync local state when external value changes
    useEffect(() => {
        setRange({ from: value.from, to: value.to });
    }, [value]);

    const handlePresetClick = (preset: typeof presetRanges[0]) => {
        let newRange: { from: Date; to: Date; };
        if ('getRange' in preset) {
            newRange = preset.getRange();
        } else {
            const to = new Date();
            const from = new Date();
            from.setDate(to.getDate() - preset.days);
            newRange = { from, to };
        }
        setRange({ from: toISOStringShort(newRange.from), to: toISOStringShort(newRange.to) });
    };
    
    const handleApply = () => {
        // Prevent applying invalid range (end before start)
        if (new Date(range.from) > new Date(range.to)) {
            onChange({ from: range.to, to: range.from });
        } else {
            onChange(range);
        }
        setIsOpen(false);
    };

    const fromDate = new Date(value.from + 'T00:00:00');
    const toDate = new Date(value.to + 'T00:00:00');
    const displayValue = `${fromDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${toDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    return (
        <div className={cn("relative", className)} ref={pickerRef}>
            <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="h-9 w-full sm:w-64 justify-start text-left font-normal bg-card">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="truncate">{displayValue}</span>
            </Button>
            
            {isOpen && (
                <Card className="absolute top-full mt-2 w-full max-w-sm sm:w-[520px] sm:max-w-none p-4 z-10 shadow-lg right-0">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-1/3 flex flex-col space-y-1">
                             {presetRanges.map(preset => (
                                <Button key={preset.label} variant="ghost" size="sm" className="w-full justify-start text-sm" onClick={() => handlePresetClick(preset)}>
                                    {preset.label}
                                </Button>
                             ))}
                        </div>
                        <div className="w-full sm:w-2/3 space-y-4 pt-4 sm:pt-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-border">
                            <div>
                                <label htmlFor="from" className="text-xs font-medium text-muted-foreground">Start date</label>
                                <input type="date" id="from" value={range.from} onChange={e => setRange(prev => ({...prev, from: e.target.value}))} className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/>
                            </div>
                             <div>
                                <label htmlFor="to" className="text-xs font-medium text-muted-foreground">End date</label>
                                <input type="date" id="to" value={range.to} onChange={e => setRange(prev => ({...prev, to: e.target.value}))} className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-border">
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={handleApply}>Apply</Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default DateRangePicker;