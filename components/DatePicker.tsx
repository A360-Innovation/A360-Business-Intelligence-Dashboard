import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="relative w-[160px]">
                <input
                    type="date"
                    className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
        );
    }
);
DatePicker.displayName = "DatePicker";

export default DatePicker;
