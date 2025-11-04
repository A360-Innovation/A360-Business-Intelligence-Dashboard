import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import useOnClickOutside from '../../hooks/useOnClickOutside';

interface DateRangePickerProps {
  date: { from: Date; to: Date };
  onDateChange: (date: { from: Date; to: Date }) => void;
  className?: string;
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({ date, onDateChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState(date);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  const presets = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 Days', days: 6 },
    { label: 'Last 30 Days', days: 29 },
    { label: 'This Month', type: 'month' },
    { label: 'Last Month', type: 'last_month' },
  ];

  const handlePresetClick = (preset: any) => {
    const to = new Date();
    const from = new Date();
    
    if (preset.type === 'month') {
        from.setDate(1);
    } else if (preset.type === 'last_month') {
        from.setMonth(from.getMonth() - 1);
        from.setDate(1);
        to.setDate(0);
    } else {
        from.setDate(to.getDate() - preset.days);
    }
    
    // Set hours to 0 to avoid timezone issues
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);

    setRange({ from, to });
    onDateChange({ from, to });
    setIsOpen(false);
  };
  
  return (
    <div className={cn('relative', className)} ref={ref}>
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="h-9 w-[260px] justify-start text-left font-normal">
        <Calendar className="mr-2 h-4 w-4" />
        <span>
          {formatDate(date.from)} - {formatDate(date.to)}
        </span>
      </Button>
      {isOpen && (
        <div className="absolute z-10 top-full mt-2 w-auto bg-card border border-border rounded-lg shadow-lg p-3">
          <div className="flex">
            <div className="flex flex-col space-y-1 pr-4 border-r border-border">
                {presets.map(preset => (
                    <Button
                        key={preset.label}
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        onClick={() => handlePresetClick(preset)}
                    >
                        {preset.label}
                    </Button>
                ))}
            </div>
            <div className="pl-4">
                 <p className="text-sm font-medium text-muted-foreground mb-2 text-center">Custom Range</p>
                 <div className="flex items-center gap-2">
                    <div>
                        <label htmlFor="from" className="text-xs text-muted-foreground">From</label>
                         <input 
                            type="date"
                            id="from"
                            value={range.from.toISOString().split('T')[0]}
                            onChange={(e) => setRange(prev => ({ ...prev, from: new Date(e.target.value + 'T00:00:00') }))}
                            className="mt-1 appearance-none w-full bg-secondary border border-transparent rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                    </div>
                     <div>
                        <label htmlFor="to" className="text-xs text-muted-foreground">To</label>
                         <input 
                            type="date"
                            id="to"
                            value={range.to.toISOString().split('T')[0]}
                            onChange={(e) => setRange(prev => ({ ...prev, to: new Date(e.target.value + 'T00:00:00') }))}
                            className="mt-1 appearance-none w-full bg-secondary border border-transparent rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                    </div>
                 </div>
                 <Button
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => {
                        onDateChange(range);
                        setIsOpen(false);
                    }}
                 >
                    Apply
                 </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
