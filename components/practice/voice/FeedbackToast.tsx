
import React from 'react';
import { FeedbackNotification } from '../../../types';
import { cn } from '../../../lib/utils';
import { Lightbulb, AlertTriangle, CheckCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '../../ui/button';

interface FeedbackToastProps {
    notification: FeedbackNotification;
    onDismiss: () => void;
    onRetry: () => void;
}

const config = {
    error: { icon: AlertTriangle, color: 'border-destructive bg-destructive/5 text-destructive', iconColor: 'text-destructive' },
    tip: { icon: Lightbulb, color: 'border-amber-500 bg-amber-500/5 text-amber-600', iconColor: 'text-amber-500' },
    success: { icon: CheckCircle, color: 'border-success bg-success/5 text-success', iconColor: 'text-success' },
};

const FeedbackToast: React.FC<FeedbackToastProps> = ({ notification, onDismiss, onRetry }) => {
    const { icon: Icon, color, iconColor } = config[notification.type];

    return (
        <div className={cn("rounded-lg border p-4 shadow-sm w-full relative", color)}>
            <Button variant="ghost" size="icon" onClick={onDismiss} className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:bg-transparent">
                <X className="h-3 w-3" />
            </Button>
            <div className="flex items-start gap-3">
                <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconColor)} />
                <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{notification.message}</p>
                    {notification.type === 'error' && (
                        <Button variant="link" size="sm" onClick={onRetry} className="h-auto p-0 mt-2 text-xs text-primary font-semibold">
                            <RefreshCw className="h-3 w-3 mr-1.5" />
                            Retry this section
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackToast;
