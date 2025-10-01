

import React, { useState } from 'react';
import { Scenario, TranscriptMessage, FeedbackNotification } from '../types';
import { practiceScenarios } from '../data/practiceScenarios';
import ScenarioCard from '../components/practice/ScenarioCard';
import VoiceSimulatorUI from '../components/practice/voice/VoiceSimulatorUI';
import SessionReviewUI from '../components/practice/voice/SessionReviewUI';

const PracticePage = () => {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  
  // Store session data to pass to the review screen
  const [sessionTranscript, setSessionTranscript] = useState<TranscriptMessage[]>([]);
  const [sessionFeedback, setSessionFeedback] = useState<FeedbackNotification[]>([]);

  const handleSelectScenario = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setIsReviewing(false);
    setSessionTranscript([]);
    setSessionFeedback([]);
  };

  const handleShowReview = (transcript: TranscriptMessage[], feedback: FeedbackNotification[]) => {
    setSessionTranscript(transcript);
    setSessionFeedback(feedback);
    setIsReviewing(true);
  };

  const handleEndSession = () => {
    setActiveScenario(null);
    setIsReviewing(false);
  };

  if (!activeScenario) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Consultation Practice Mode</h1>
          <p className="text-muted-foreground mt-1">Select a scenario to start your voice-based training session with an AI-powered patient.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practiceScenarios.map(s => (
            <ScenarioCard key={s.id} {...s} onSelect={() => handleSelectScenario(s)} />
          ))}
        </div>
      </div>
    );
  }

  if (isReviewing) {
    return (
        <SessionReviewUI 
            scenario={activeScenario}
            transcript={sessionTranscript}
            feedback={sessionFeedback}
            onRestart={() => handleSelectScenario(activeScenario)}
            onSelectNew={handleEndSession}
        />
    );
  }

  return (
    <VoiceSimulatorUI 
      scenario={activeScenario} 
      onEndSession={handleShowReview}
    />
  );
};

export default PracticePage;