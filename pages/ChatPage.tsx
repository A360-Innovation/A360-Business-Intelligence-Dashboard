

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, User, ArrowUp, Paperclip, ChevronRight, Link, Copy, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Tooltip from '../components/Tooltip';

interface Chunk {
    id: number;
    transcript_id: string;
    chunk_index: number;
    vscore: number;
    tscore: number;
    hybrid: number;
    preview: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  sources?: Chunk[];
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
    const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isAiTyping]);
    
    useEffect(() => {
        // Adjust textarea height dynamically
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = 200; // Max height in pixels
            
            if (scrollHeight > maxHeight) {
                textareaRef.current.style.height = `${maxHeight}px`;
                textareaRef.current.style.overflowY = 'auto';
            } else {
                textareaRef.current.style.height = `${scrollHeight}px`;
                textareaRef.current.style.overflowY = 'hidden';
            }
        }
    }, [input]);
    
    const toggleSources = (messageId: number) => {
        setExpandedSources(prev => {
            const newSet = new Set(prev);
            if (newSet.has(messageId)) {
                newSet.delete(messageId);
            } else {
                newSet.add(messageId);
            }
            return newSet;
        });
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification for feedback here.
    };

    const formatMessageContent = (content: string): string => {
        let formattedText = content;

        // General formatting for lists of opportunities, similar to NarrativePane
        // Main Headers
        formattedText = formattedText
            .replace(/Opportunity Snapshot:/g, '## Opportunity Snapshot')
            .replace(/Ranked Opportunities:/g, '### Ranked Opportunities');
        
        // Numbered list for each opportunity
        formattedText = formattedText.replace(/(\d+)\. (Product\/Service:)/g, '\n\n$1. **$2**');
        
        // Key-value pairs within each opportunity
        const labels = [
            "Relevance", "Consultation trigger", "Introduction script",
            "Clinical justification", "Frequency missed", "Revenue impact",
            "Success indicators"
        ];
        
        labels.forEach(label => {
            const regex = new RegExp(`(\\*)?\\s*(${label}):`, 'gi');
            formattedText = formattedText.replace(regex, '\n- **$2:**');
        });

        // Default formatting for other content (e.g., fixing headings without space)
        formattedText = formattedText.split('\n').map(line => {
            const trimmedLine = line.trimStart();
            const match = trimmedLine.match(/^(#+)(.*)/);
            if (match) {
                const hashes = match[1];
                const contentText = match[2].trim();
                return `${hashes} ${contentText}`;
            }
            return line;
        }).join('\n');

        return formattedText;
    };

    const handleSendMessage = useCallback(async () => {
        if (input.trim() === '' || isAiTyping) return;

        const userQuestion = input;
        const newUserMessage: Message = { id: Date.now(), text: userQuestion, sender: 'user' };
        
        const aiMessageId = Date.now() + 1;
        const aiMessagePlaceholder: Message = { id: aiMessageId, text: '', sender: 'ai', sources: [] };
        
        setMessages((prev) => [...prev, newUserMessage, aiMessagePlaceholder]);
        setInput('');
        setIsAiTyping(true);

        try {
            const response = await fetch('https://chat-stream-production.up.railway.app/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversation_id: "demo-125",
                    message: userQuestion,
                }),
            });

            if (!response.ok || !response.body) {
                let errorText = `API error: ${response.status} ${response.statusText}`;
                 try {
                    const errorData = await response.json();
                    errorText = errorData.detail || errorText;
                } catch (e) { /* ignore if no JSON body */ }
                throw new Error(errorText);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let eventName = 'message';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('event:')) {
                        eventName = line.substring(6).trim();
                    } else if (line.startsWith('data:')) {
                        const data = line.substring(5).trim();

                        if (eventName === 'message') {
                            setMessages(prev =>
                                prev.map(msg =>
                                    msg.id === aiMessageId ? { ...msg, text: msg.text + data } : msg
                                )
                            );
                        } else if (eventName === 'context') {
                            try {
                                const contextData = JSON.parse(data);
                                if (Array.isArray(contextData)) {
                                    setMessages(prev =>
                                        prev.map(msg => {
                                            if (msg.id === aiMessageId) {
                                                const existingSources = msg.sources || [];
                                                const newSources: Chunk[] = contextData.map((item: any, index: number) => ({
                                                    id: existingSources.length + index,
                                                    preview: String(item),
                                                    transcript_id: `Source ${existingSources.length + index + 1}`,
                                                    chunk_index: existingSources.length + index,
                                                    vscore: 0, tscore: 0, hybrid: 0,
                                                }));
                                                return { ...msg, sources: existingSources.concat(newSources) };
                                            }
                                            return msg;
                                        })
                                    );
                                }
                            } catch (e) {
                                console.error("Could not parse context from SSE:", data, e);
                            }
                        } else if (eventName === 'end' && data === '[END]') {
                            setIsAiTyping(false);
                            return;
                        }
                    } else if (line.trim() === '') {
                        eventName = 'message'; // Reset to default after an event is dispatched
                    }
                }
            }
        } catch (error) {
            const errorMessageText = error instanceof Error ? error.message : "Sorry, something went wrong. Please try again.";
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, text: errorMessageText } : msg
                )
            );
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

    const MessageEntry = ({ message }: { message: Message }) => (
        <div className="w-full max-w-3xl mx-auto py-6 border-b border-border last:border-b-0">
            <div className="flex items-center gap-3 mb-3">
                {message.sender === 'user' ? (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                ) : (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                    </div>
                )}
                <span className="font-semibold text-foreground">
                    {message.sender === 'user' ? 'You' : 'AI Assistant'}
                </span>
            </div>
            
            <div className="pl-11">
                <div className="prose prose-sm max-w-none text-muted-foreground [&_p]:my-0">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.sender === 'ai' ? formatMessageContent(message.text) : (message.text || ' ')}
                    </ReactMarkdown>
                </div>

                {message.sender === 'ai' && message.text && (
                    <div className="mt-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground"
                            onClick={() => handleCopy(message.text)}
                            title="Copy message"
                        >
                            <Copy className="h-3.5 w-3.5 mr-1.5" />
                            Copy
                        </Button>
                    </div>
                )}

                {message.sender === 'ai' && message.sources && message.sources.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center">
                            <Link className="h-3 w-3 mr-1.5" /> Sources
                        </h4>
                        <div className="space-y-2">
                            {(expandedSources.has(message.id) ? message.sources : message.sources.slice(0, 3)).map((source) => (
                                <div key={source.id} className="bg-secondary p-2 rounded-md text-xs text-muted-foreground border border-border/50" title={source.preview}>
                                    <p className="font-mono text-primary/80 text-[10px] truncate">
                                        Transcript: {source.transcript_id}
                                    </p>
                                    <p className="mt-1 text-foreground/80">
                                        "{source.preview.trim()}"
                                    </p>
                                </div>
                            ))}
                        </div>
                        {message.sources.length > 3 && (
                            <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-xs font-semibold" onClick={() => toggleSources(message.id)}>
                                {expandedSources.has(message.id) ? 'Show less' : `Show ${message.sources.length - 3} more sources...`}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
    
    return (
        <div className="flex flex-col h-full bg-background relative isolate">
            <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl opacity-50"></div>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6">
                {messages.length === 0 && !isAiTyping ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <h1 className="text-4xl font-bold text-foreground">What can I help with?</h1>
                        <div className="mt-8 w-full max-w-3xl">
                             <div className="flex items-center justify-center gap-2 mb-3">
                                <p className="text-sm text-muted-foreground">Examples of queries:</p>
                                <Tooltip content="Ask questions in natural language about your clinic data. The AI will search through consultation transcripts to give you accurate answers and summaries.">
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </Tooltip>
                            </div>
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
                    <div>
                        {messages.map((message) => <MessageEntry key={message.id} message={message} />)}
                        
                        {isAiTyping && messages[messages.length - 1]?.sender === 'ai' && messages[messages.length - 1]?.text === '' && (
                            <div className="w-full max-w-3xl mx-auto py-6 border-b border-border last:border-b-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="font-semibold text-foreground">AI Assistant</span>
                                </div>
                                <div className="pl-11">
                                    <div className="flex items-center space-x-1.5">
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></span>
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]"></span>
                                    </div>
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
