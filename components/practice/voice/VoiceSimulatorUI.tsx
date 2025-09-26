import React, { useState, useEffect, useRef } from 'react';
import { Scenario, TranscriptMessage, FeedbackNotification, SimulationStatus } from '../../../types';
import { Button } from '../../ui/button';
import { CornerDownLeft } from 'lucide-react';
import PatientProfileCard from './PatientProfileCard';
import LiveTranscript from './LiveTranscript';
import FeedbackToast from './FeedbackToast';
import AudioVisualizer from './AudioVisualizer';
import { generateAndPlayAudio } from '../../../lib/elevenlabs';

interface VoiceSimulatorUIProps {
  scenario: Scenario;
  onEndSession: (transcript: TranscriptMessage[], feedback: FeedbackNotification[]) => void;
}

const mockResponses = [
    "That's a very valid concern. Let's break down exactly what that means...",
    "I understand completely. Many of our patients feel the same way initially.",
    "Interesting point. Based on your goals, have you considered this alternative?",
];

const VoiceSimulatorUI: React.FC<VoiceSimulatorUIProps> = ({ scenario, onEndSession }) => {
    const [status, setStatus] = useState<SimulationStatus>('idle');
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
    const [feedback, setFeedback] = useState<FeedbackNotification[]>([]);
    const simulationControl = useRef({ isCancelled: false });

    useEffect(() => {
        simulationControl.current.isCancelled = false;

        const conversationFlow = async () => {
            const handleAiSpeech = async (message: TranscriptMessage) => {
                if (simulationControl.current.isCancelled) return;
                setTranscript(prev => [...prev, message]);
                setStatus('speaking');
                try {
                    await generateAndPlayAudio(message.text);
                } catch (error) {
                    console.error("Audio generation/playback failed, continuing simulation silently.", error);
                    // Fallback to a fixed delay if audio fails
                    await new Promise(r => setTimeout(r, 2500));
                }
            };
            
            // 1. AI starts speaking
            await handleAiSpeech({ id: Date.now(), text: scenario.initialMessage, sender: 'ai' });
            if (simulationControl.current.isCancelled) return;
            
            // Loop for a couple of turns
            for (let i = 0; i < 2; i++) {
                // 2. AI stops, user starts
                setStatus('listening');
                await new Promise(r => setTimeout(r, 4000));
                if (simulationControl.current.isCancelled) return;
                
                // 3. User stops, analysis begins
                const userMessageId = Date.now();
                setTranscript(prev => [...prev, { id: userMessageId, text: `(This is a simulated user response about ${scenario.title})`, sender: 'user' }]);
                setStatus('analyzing');
                await new Promise(r => setTimeout(r, 1500));
                if (simulationControl.current.isCancelled) return;
                
                // 4. Feedback is generated
                if (i === 0) {
                    setFeedback(prev => [...prev, {id: Date.now(), type: 'error', message: "You missed an opportunity to build rapport by not validating the patient's feelings first.", transcriptId: userMessageId}]);
                } else if (i === 1) {
                    setFeedback(prev => [...prev, {id: Date.now(), type: 'tip', message: "Good job acknowledging the cost. Now, pivot to value and longevity.", transcriptId: userMessageId}]);
                }
                
                // 5. AI responds
                await handleAiSpeech({ id: Date.now() + 1, text: mockResponses[i % mockResponses.length], sender: 'ai' });
                if (simulationControl.current.isCancelled) return;
            }

            setStatus('ended');
        };

        conversationFlow();
        
        return () => {
            simulationControl.current.isCancelled = true;
        };
    }, [scenario]);

    const dismissFeedback = (id: number) => {
        setFeedback(prev => prev.filter(f => f.id !== id));
    };

    const handleRetrySection = (transcriptIdToRetry: number) => {
        simulationControl.current.isCancelled = true;

        const messageIndex = transcript.findIndex(m => m.id === transcriptIdToRetry);
        if (messageIndex === -1) return;

        // Find the AI message just before the user's error to rewind to.
        // Fix: Replace `findLastIndex` with `map` and `lastIndexOf` for wider compatibility.
        const lastAiMessageIndex = transcript.slice(0, messageIndex).map(m => m.sender).lastIndexOf('ai');
        
        // Rewind state
        setTranscript(prev => prev.slice(0, lastAiMessageIndex + 1));
        setFeedback(prev => prev.filter(f => f.id !== feedback.find(fb => fb.transcriptId === transcriptIdToRetry)?.id));
        
        // Set status to listening to allow the user to try again
        setStatus('listening');
    };
    
    const handleEnd = () => {
        simulationControl.current.isCancelled = true;
        onEndSession(transcript, feedback);
    };

    return (
        <div className="flex h-full bg-background relative isolate overflow-hidden">
            <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-primary/5 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Left Panel: Patient Profile */}
            <aside className="w-80 flex-shrink-0 bg-card/50 backdrop-blur-sm border-r border-border h-full flex flex-col p-6">
                <PatientProfileCard persona={scenario.persona} status={status} />
            </aside>

            {/* Center Panel: Transcript & Visualizer */}
            <main className="flex-1 flex flex-col h-full">
                <LiveTranscript transcript={transcript} />
                <div className="flex-shrink-0 h-40 flex items-center justify-center">
                    <AudioVisualizer status={status} />
                </div>
            </main>

            {/* Right Panel: Feedback & Controls */}
            <aside className="w-96 flex-shrink-0 bg-card border-l border-border h-full flex flex-col">
                <div className="flex-1 p-4 space-y-3 relative overflow-y-auto">
                    {feedback.map(f => (
                        <FeedbackToast 
                            key={f.id} 
                            notification={f} 
                            onDismiss={() => dismissFeedback(f.id)} 
                            onRetry={() => handleRetrySection(f.transcriptId)}
                        />
                    ))}
                </div>
                <div className="p-4 border-t border-border bg-card">
                    <Button variant="outline" className="w-full" onClick={handleEnd}>
                        <CornerDownLeft className="h-4 w-4 mr-2" />
                        End & Review Session
                    </Button>
                </div>
            </aside>
        </div>
    );
};

export default VoiceSimulatorUI;
