
import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { User, Bot } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatTranscriptProps {
  messages: Message[];
  isAiTyping: boolean;
  personaName: string;
}

const ChatTranscript: React.FC<ChatTranscriptProps> = ({ messages, isAiTyping, personaName }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
      <div className="space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex items-start gap-3 w-full", message.sender === 'user' && 'justify-end')}>
            {message.sender === 'ai' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center" title={`AI Patient: ${personaName}`}>
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={cn(
              "max-w-md md:max-w-lg rounded-xl p-3 text-sm whitespace-pre-wrap",
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
        {isAiTyping && (
          <div className="flex items-start gap-3 w-full">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center" title={`AI Patient: ${personaName}`}>
                <Bot className="w-4 h-4 text-primary" />
             </div>
             <div className="max-w-md rounded-xl p-3 bg-card border border-border rounded-bl-none flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]"></span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTranscript;
