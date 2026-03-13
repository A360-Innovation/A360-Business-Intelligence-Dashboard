

import React from 'react';
import { Scenario, TranscriptMessage, FeedbackNotification } from '../../../types';
import { Button } from '../../ui/button';
import { RefreshCw, List } from 'lucide-react';
import LiveTranscript from './LiveTranscript';
import ReviewScoreCard from './ReviewScoreCard';

interface SessionReviewUIProps {
  scenario: Scenario;
  transcript: TranscriptMessage[];
  feedback: FeedbackNotification[];
  onRestart: () => void;
  onSelectNew: () => void;
}

const SessionReviewUI: React.FC<SessionReviewUIProps> = ({ scenario, transcript, feedback, onRestart, onSelectNew }) => {
  // Mock scores for demonstration
  const rapportScore = 100 - (feedback.filter(f => f.message.includes("rapport")).length * 18);
  const educationScore = 82;
  const objectionScore = 100 - (feedback.filter(f => f.message.includes("cost")).length * 25);

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <header className="mb-6 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Session Review: <span className="text-primary">{scenario.title}</span></h1>
        <p className="text-muted-foreground mt-1">Here's a summary of your performance in this consultation simulation.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ReviewScoreCard 
            score={rapportScore} 
            title="Rapport Building"
            description="Evaluates ability to build trust and validate patient feelings."
        />
        <ReviewScoreCard 
            score={educationScore} 
            title="Education Clarity"
            description="Measures how effectively treatment plans and concepts are explained."
        />
        <ReviewScoreCard 
            score={objectionScore} 
            title="Objection Handling"
            description="Assesses skill in addressing patient concerns like cost and results."
        />
      </div>

      <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b border-border">Full Transcript</h3>
        <div className="flex-1 overflow-y-auto">
            <LiveTranscript transcript={transcript} />
        </div>
      </div>

      <footer className="mt-6 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onRestart}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Practice this scenario again
        </Button>
        <Button onClick={onSelectNew}>
            <List className="h-4 w-4 mr-2" />
            Select another scenario
        </Button>
      </footer>
    </div>
  );
};

export default SessionReviewUI;