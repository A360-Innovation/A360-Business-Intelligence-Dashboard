
import React from 'react';
import { SimulationStatus } from '../../../types';
import { cn } from '../../../lib/utils';
import { Mic, Bot } from 'lucide-react';

interface AudioVisualizerProps {
  status: SimulationStatus;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ status }) => {
    const isListening = status === 'listening';
    const isSpeaking = status === 'speaking';
    const isAnalyzing = status === 'analyzing';

    return (
        <div className="flex items-center justify-center w-64 h-24">
            <div className={cn(
                "relative flex items-center justify-center h-16 w-16 rounded-full transition-all duration-300",
                isListening ? 'bg-success/10' :
                isSpeaking ? 'bg-primary/10' :
                'bg-secondary'
            )}>
                {/* Pulsing rings for active states */}
                {(isListening || isSpeaking) && (
                    <>
                        <div className={cn(
                            "absolute h-full w-full rounded-full animate-ping opacity-75",
                            isListening ? 'bg-success/50' : 'bg-primary/50'
                        )}></div>
                         <div className={cn(
                            "absolute h-full w-full rounded-full animate-ping opacity-50 [animation-delay:0.5s]",
                            isListening ? 'bg-success/50' : 'bg-primary/50'
                        )}></div>
                    </>
                )}

                {/* Central Icon */}
                <div className="relative z-10">
                    {isListening && <Mic className="h-6 w-6 text-success" />}
                    {isSpeaking && <Bot className="h-6 w-6 text-primary" />}
                    {isAnalyzing && (
                        <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-warning"></div>
                    )}
                    { (status === 'idle' || status === 'ended') && <Mic className="h-6 w-6 text-muted-foreground" /> }
                </div>
            </div>
        </div>
    );
};

export default AudioVisualizer;