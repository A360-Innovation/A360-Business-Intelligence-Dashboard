import React from 'react';
import { SimulationStatus } from '../../../types';
import { cn } from '../../../lib/utils';
import { Mic, Bot, BrainCircuit } from 'lucide-react';

interface PatientProfileCardProps {
  persona: {
    name: string;
    avatarUrl: string;
  };
  status: SimulationStatus;
}

const statusConfig = {
    listening: { text: 'Listening...', icon: Mic, color: 'text-success', ring: 'ring-success/50' },
    speaking: { text: 'AI is Speaking...', icon: Bot, color: 'text-primary', ring: 'ring-primary/50' },
    analyzing: { text: 'Analyzing...', icon: BrainCircuit, color: 'text-warning', ring: 'ring-warning/50' },
    idle: { text: 'Ready', icon: Mic, color: 'text-muted-foreground', ring: 'ring-transparent' },
    ended: { text: 'Session Ended', icon: Bot, color: 'text-muted-foreground', ring: 'ring-transparent' },
};

const PatientProfileCard: React.FC<PatientProfileCardProps> = ({ persona, status }) => {
    const currentStatus = statusConfig[status];

    return (
        <div className="text-center">
            <p className="text-sm font-semibold text-muted-foreground mb-4">AI Patient</p>
            <div className="relative inline-block">
                <img 
                    src={persona.avatarUrl} 
                    alt={persona.name}
                    className="h-32 w-32 rounded-full object-cover ring-4 ring-background"
                />
                <div className={cn(
                    "absolute inset-0 rounded-full ring-2 ring-offset-4 ring-offset-background transition-all duration-300",
                    currentStatus.ring,
                    (status === 'listening' || status === 'speaking' || status === 'analyzing') && 'animate-pulse'
                )}></div>
            </div>
            
            <h2 className="mt-6 text-2xl font-bold text-foreground">{persona.name}</h2>
            
            <div className="mt-8 flex items-center justify-center gap-2 p-3 bg-secondary rounded-lg">
                <currentStatus.icon className={cn("h-4 w-4 animate-pulse", currentStatus.color)} />
                <p className={cn("text-sm font-medium", currentStatus.color)}>
                    {currentStatus.text}
                </p>
            </div>

            <div className="mt-6 text-left p-4 border border-border rounded-lg bg-secondary/50">
                <h3 className="font-semibold text-foreground">Session Goal</h3>
                <p className="text-sm text-muted-foreground mt-1">Practice handling a nervous first-time patient who is concerned about unnatural results.</p>
            </div>
        </div>
    );
};

export default PatientProfileCard;
