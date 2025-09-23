
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Bot, User, Send, CornerDownLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const suggestedPrompts = [
    "Summarize the last 5 consultations about acne.",
    "What are the most common objections to fillers?",
    "Generate a follow-up email for a new Botox patient.",
    "Which patient demographic is most interested in chemical peels?",
];

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleSendMessage = () => {
        if (input.trim() === '') return;

        const newUserMessage: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
        };
        setMessages((prev) => [...prev, newUserMessage]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: Date.now() + 1,
                text: "Thank you for your message. I am processing your request and will provide a detailed analysis shortly.",
                sender: 'ai',
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1000);
    };
    
    const handlePromptClick = (prompt: string) => {
        setInput(prompt);
        textareaRef.current?.focus();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

  return (
    <div className="flex flex-col h-full bg-background">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
             <div className="mx-auto bg-secondary p-3 rounded-full">
                <Bot className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mt-4">A360 Chat</h1>
            <p className="text-muted-foreground mt-2 max-w-md">
                Your AI-powered clinical insights assistant. Ask me anything about your practice data.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
                {suggestedPrompts.map((prompt, i) => (
                    <button
                        key={i}
                        onClick={() => handlePromptClick(prompt)}
                        className="p-3 bg-card border border-border rounded-lg text-left text-sm hover:bg-accent transition-colors"
                    >
                       {prompt}
                    </button>
                ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={cn("flex items-start gap-3", message.sender === 'user' && 'justify-end')}>
                {message.sender === 'ai' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                    </div>
                )}
                 <div className={cn(
                        "max-w-md rounded-xl p-3 text-sm", 
                        message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border border-border rounded-bl-none'
                    )}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                 </div>
                {message.sender === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                )}
            </div>
          ))
        )}
      </div>
      <div className="p-4 bg-card border-t border-border">
          <div className="relative">
             <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about patient trends, procedure popularity, or marketing insights..."
                className="w-full bg-secondary border border-border rounded-lg resize-none p-3 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                rows={1}
             />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                 <p className="text-xs text-muted-foreground mr-2 hidden sm:block">
                    <kbd className="font-sans">Shift</kbd> + <kbd className="font-sans">Enter</kbd> for newline
                 </p>
                <Button size="icon" className="h-8 w-8" onClick={handleSendMessage} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ChatPage;
