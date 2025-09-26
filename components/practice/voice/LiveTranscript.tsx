import React, { useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { User, Bot } from 'lucide-react';
import { TranscriptMessage } from '../../../types';

interface LiveTranscriptProps {
  transcript: TranscriptMessage[];
}

const LiveTranscript: React.FC<LiveTranscriptProps> = ({ transcript }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
      <div className="space-y-6 max-w-4xl mx-auto">
        {transcript.map((message) => (
          <div key={message.id} className={cn("flex items-start gap-4 w-full", message.sender === 'user' && 'justify-end')}>
            {message.sender === 'ai' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center" title="AI Patient">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={cn(
              "max-w-xl rounded-xl p-3 text-sm whitespace-pre-wrap shadow-sm",
              message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border border-border rounded-bl-none'
            )}>
              <p>{message.text}</p>
            </div>
            {message.sender === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center" title="You">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTranscript;
