
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, User, ArrowUp, Paperclip, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const exampleQueries = [
    "Summarize key patient concerns for the 25-35 age group this month.",
    "What are the top 3 up-selling opportunities based on recent consultations?",
    "Identify common objections to filler treatments and suggest effective responses.",
    "Generate marketing copy for a summer campaign targeting pigmentation issues.",
];

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isAiTyping]);
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height to recalculate
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = 200; // Max height in pixels
            
            textareaRef.current.style.height = `${scrollHeight}px`; // Set height first
            
            if (scrollHeight > maxHeight) {
                textareaRef.current.style.height = `${maxHeight}px`;
                textareaRef.current.style.overflowY = 'auto';
            } else {
                textareaRef.current.style.overflowY = 'hidden';
            }
        }
    }, [input]);

    const handleSendMessage = useCallback(async () => {
        if (input.trim() === '' || isAiTyping) return;

        const newUserMessage: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
        };
        setMessages((prev) => [...prev, newUserMessage]);
        const userQuestion = input;
        setInput('');
        setIsAiTyping(true);

        try {
            // Mocked AI response to prevent fetch errors in the current environment.
            await new Promise(resolve => setTimeout(resolve, 1200));

            let aiText = "This is a mocked response. In a real application, I would provide a detailed analysis based on your question about the clinic's data.";

            if (userQuestion.toLowerCase().includes("concerns")) {
                aiText = "Based on the data for the 25-35 age group, the primary concerns are:\n\n1.  **Skin Pigmentation (38%):** Many patients are looking for solutions for sunspots and melasma.\n2.  **Acne / Breakouts (22%):** Adult acne remains a significant concern.\n3.  **Early Wrinkles (18%):** Patients are increasingly interested in preventative anti-aging treatments like 'baby botox'.";
            } else if (userQuestion.toLowerCase().includes("filler")) {
                aiText = "Common objections to filler treatments include:\n\n-   **Fear of looking unnatural:** Patients often express worry about an 'overdone' look. The best response is to reassure them with a conservative approach, showing before-and-after photos of natural results, and suggesting a 'start small and add more later' plan.\n-   **Concerns about pain/discomfort:** Explain the use of topical numbing cream and the minimal discomfort involved.\n-   **Cost:** Break down the cost and explain the longevity of the results. Offering financing options can also be effective.";
            } else if (userQuestion.toLowerCase().includes("marketing") || userQuestion.toLowerCase().includes("campaign")) {
                aiText = "For a summer campaign targeting pigmentation, here is some sample copy:\n\n**Headline:** Reveal Your Radiance This Summer!\n\n**Body:** Don't let sunspots or melasma dim your glow. Our advanced IPL Photofacial and Chemical Peel treatments are designed to safely and effectively reduce unwanted pigmentation, leaving you with a clear, even complexion. Book a free consultation today and step into summer with confidence!";
            }

            const newAiMessage: Message = {
                id: Date.now() + 1,
                text: aiText,
                sender: 'ai',
            };
            setMessages((prev) => [...prev, newAiMessage]);

        } catch (error) {
            console.error("Failed to fetch AI response:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: "Sorry, I couldn't process your request right now. Please check the console for details or try again later.",
                sender: 'ai',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsAiTyping(false);
        }
    }, [input, isAiTyping]);
    
    const handlePromptClick = useCallback((prompt: string) => {
        setInput(prompt);
        textareaRef.current?.focus();
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const isSendDisabled = !input.trim() || isAiTyping;

    return (
        <div className="flex flex-col h-full bg-background relative isolate">
            <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl opacity-50"></div>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
                {messages.length === 0 && !isAiTyping ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <h1 className="text-4xl font-bold text-foreground">What can I help with?</h1>
                        <div className="mt-8 w-full max-w-3xl">
                            <p className="text-sm text-muted-foreground mb-3">Examples of queries:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {exampleQueries.map((prompt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePromptClick(prompt)}
                                        className="flex items-center justify-between p-3 bg-card/50 border border-border rounded-lg text-left text-sm text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                                        disabled={isAiTyping}
                                    >
                                       <span>{prompt}</span>
                                       <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((message) => (
                            <div key={message.id} className={cn("flex items-start gap-3 w-full max-w-3xl mx-auto", message.sender === 'user' && 'justify-end')}>
                                {message.sender === 'ai' && (
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
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
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isAiTyping && (
                            <div className="flex items-start gap-3 w-full max-w-3xl mx-auto">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
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
                )}
            </div>

            <div className="px-4 pb-4 sm:px-6 bg-transparent sticky bottom-0">
                <div className="w-full max-w-3xl mx-auto">
                  <div className="relative flex items-end p-1 bg-secondary/70 backdrop-blur-sm rounded-xl shadow-sm border border-border">
                      <textarea
                          ref={textareaRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask AI anything..."
                          className="flex-1 bg-transparent resize-none focus:outline-none text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50 p-3 pr-24"
                          rows={1}
                          disabled={isAiTyping}
                      />
                      <div className="absolute right-3 bottom-2.5 flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" disabled={isAiTyping}>
                              <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button size="icon" className="h-9 w-9 bg-foreground text-background hover:bg-foreground/90" onClick={handleSendMessage} disabled={isSendDisabled}>
                              <ArrowUp className="h-4 w-4" />
                          </Button>
                      </div>
                  </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;