import React, { useState, useRef, useEffect } from 'react';
import { Button, Textarea } from '../components/ui/FormControls';
import * as Icons from '../components/ui/Icons';
import { useTranslation } from '../hooks/useTranslation';
import Logo from '../components/ui/Logo';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Type Definitions ---
interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
}

// --- Chat History Sidebar Component ---
const ChatHistorySidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const historyItems = ["Botox Upsell Analysis", "Last Week's Satisfaction", "Objection Handling Scripts", "New Patient Funnel", "Marketing Campaign Ideas"];

    return (
        <div className={cn(
            "flex flex-col bg-card border-r border-border",
            "transition-all duration-300 ease-in-out flex-shrink-0",
            isOpen ? 'w-[270px]' : 'w-0',
            "overflow-hidden"
        )}>
            <div className="h-[70px] flex items-center justify-between px-4 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Logo className="h-8 w-8" />
                    <span className="font-bold text-foreground text-lg">Aesthetics360</span>
                </div>
                <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary">
                    <Icons.ChevronsLeftIcon className="h-5 w-5 text-muted-foreground" />
                </button>
            </div>
            
            <div className="p-4 space-y-4">
                <div className="flex justify-around items-center p-1 bg-secondary rounded-lg">
                    <button className="p-2 flex-1 rounded-lg hover:bg-background text-muted-foreground"><Icons.FilterIcon className="h-5 w-5 mx-auto"/></button>
                    <button className="p-2 flex-1 rounded-lg hover:bg-background text-muted-foreground"><Icons.TargetIcon className="h-5 w-5 mx-auto"/></button>
                    <button className="p-2 flex-1 rounded-lg hover:bg-background text-muted-foreground"><Icons.SettingsIcon className="h-5 w-5 mx-auto"/></button>
                </div>
                <Button variant="default" className="w-full !rounded-lg !py-2.5">
                    <Icons.MessageCircleIcon className="h-5 w-5"/>
                    <span>{t('aiCenter.newChat')}</span>
                </Button>
            </div>
            
            <nav className="flex-1 overflow-y-auto px-4">
                <h3 className="px-2 pb-2 text-sm font-semibold text-muted-foreground">{t('aiCenter.workspace')}</h3>
                <div className="space-y-1">
                    {historyItems.map(item => (
                        <a key={item} href="#" className="flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                            <Icons.MessageCircleIcon className="h-5 w-5"/>
                            <span>{item}</span>
                        </a>
                    ))}
                </div>
            </nav>
        </div>
    );
};


// --- Welcome Screen Component ---
const WelcomeScreen: React.FC<{ onSendMessage: (prompt: string) => void; isLoading: boolean }> = ({ onSendMessage, isLoading }) => {
    const { t } = useTranslation();
    const prompts = [
        t('aiCenter.prompt1'),
        t('aiCenter.prompt2'),
        t('aiCenter.prompt3'),
        t('aiCenter.prompt4'),
    ];

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4">
            <div className="text-left mb-12">
                <h1 className="text-5xl font-bold tracking-tight text-foreground">{t('aiCenter.welcomeTitle')}</h1>
                <p className="mt-2 text-5xl tracking-tight text-muted-foreground">{t('aiCenter.welcomeSubtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prompts.map((prompt, index) => (
                    <button 
                        key={index}
                        onClick={() => onSendMessage(prompt)}
                        disabled={isLoading}
                        className="group text-left p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-all flex justify-between items-start disabled:opacity-50 h-full"
                    >
                        <p className="text-sm font-medium text-foreground">{prompt}</p>
                        <Icons.ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-4" />
                    </button>
                ))}
            </div>
        </div>
    );
};


// --- Chat View Components ---
const formatContent = (c: string): string => {
    if (!c || c === 'loading') {
      return c;
    }
  
    let text = c;
    let sources: string[] = [];
  
    // --- Phase 1: Deep Cleaning & Source Extraction ---
    const allEvidenceRegex = /(?:\[t:|\(t:|\bInt:)([a-f0-9-–]+)/g;
    
    const matches = Array.from(text.matchAll(allEvidenceRegex));
    if (matches.length > 0) {
      sources = matches.map(match => match[1]);
    }

    text = text.replace(/\[t:[a-f0-9-–]+\]/g, '');
    text = text.replace(/\(t:[a-f0-9-–]+\)/g, '');
    text = text.replace(/\bInt:[a-f0-9-–]+\b/g, '');
    
    // Remove "Evidence:" blocks which contain raw data and are not meant for display.
    text = text.replace(/\s*Evidence:.*?(?=\s*(?:Likely Root Cause:|Micro-script:)|$)/g, '');
    
    // Clean up stray numeric artifacts that appear on their own line.
    text = text.replace(/^\s*\d+\.?\s*$/gm, '');

    text = text.replace(/Group\)Patients/g, 'Group) Patients');
  
    // --- Phase 2: Intelligent Splitting ---
    text = text.replace(/([a-z0-9.,?"'\)])([A-Z])/g, '$1 $2');
    text = text.replace(/([a-z0-9.,?"'\)])([A-Z])/g, '$1 $2');
  
    text = text.replace(/(\.)(\d+\.\s)/g, '$1\n\n$2');
  
    const majorSectionKeywords = [
        'Headline', 'Body', 'Opportunity Snapshot', 'Ranked Opportunities', 
        'Ranked Concerns', 'Ranked List', 'Direct Answer', 'Red Flags to Avoid',
        'Special Summer Offer', 'Call to Action', 'Hashtags',
        'Summary of Key Patient Concerns'
    ];
    const listItemKeywords = [
        'Product/Service', 'Relevance', 'Consultation trigger', 'Introduction script', 
        'Example from Data', 'Clinical justification', 'Frequency missed', 'Frequency', 
        'Revenue impact', 'Evidence', 'Success indicators', 'Why it matters', 
        'Micro-script solution', 'When to use', 'Impact', 'Should have said', 'Expected outcome'
    ];
  
    const allKeywords = [...majorSectionKeywords, ...listItemKeywords];
    const keywordRegex = new RegExp(`(?<!\n)\\s*(${allKeywords.join('|')})`, 'g');
    text = text.replace(keywordRegex, '\n\n$1');
  
    // --- Phase 3: Markdown Conversion & Final Cleanup ---
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/\s*\*\s*/g, ' ');
    text = text.replace(/\*$/gm, '');
    text = text.replace(/\.\*/g, '.');
    text = text.replace(/:\*/g, ':');
    text = text.replace(/\* /g, ' ');
    text = text.replace(/\*/g, '');

    text = text.split('\n').map(line => {
        line = line.trim();
        if (!line) return line;

        const majorKeywordMatch = majorSectionKeywords.find(kw => line.startsWith(kw));
        if (majorKeywordMatch) {
            const restOfLine = line.substring(majorKeywordMatch.length).replace(/^:\s*/, '').trim();
            return `### ${majorKeywordMatch}\n${restOfLine}`;
        }

        const listItemKeywordMatch = listItemKeywords.find(kw => line.startsWith(kw));
        if (listItemKeywordMatch) {
            const restOfLine = line.substring(listItemKeywordMatch.length).replace(/^:\s*/, '').trim();
            return `\n- **${listItemKeywordMatch}:** ${restOfLine}`;
        }
        
        if (line.match(/^\d+\.\s/)) {
            return `\n${line}`;
        }

        return line;
    }).join('\n');
  
    // --- Phase 4: Final Polishing ---
    text = text.replace(/\n{3,}/g, '\n\n').trim();
    
    // --- Phase 5: Append Sources ---
    if (sources.length > 0) {
        const uniqueSources = [...new Set(sources)];
        text += `\n\n### Sources\n${uniqueSources.map(s => `- \`${s}\``).join('\n')}`;
    }

    return text;
};

const FormattedResponse: React.FC<{ content: string }> = ({ content }) => {
    if (content === '') {
        return (
            <div className="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        );
    }
    
    const formattedContent = formatContent(content);

    return (
        <div className="prose max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-strong:font-semibold">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{formattedContent}</ReactMarkdown>
        </div>
    );
};

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    if (message.role === 'user') {
        return (
            <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl max-w-lg">
                    <p className="text-base">{message.content}</p>
                </div>
            </div>
        );
    }
    
    return (
         <div className="flex justify-start">
            <div className="bg-card text-card-foreground px-4 py-3 rounded-2xl max-w-2xl border border-border">
                <FormattedResponse content={message.content} />
            </div>
        </div>
    );
};

const ChatView: React.FC<{ messages: ChatMessage[]; messagesEndRef: React.RefObject<HTMLDivElement> }> = ({ messages, messagesEndRef }) => {
    return (
        <div className="w-full max-w-3xl mx-auto pt-12 px-4 space-y-6">
            {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
            <div ref={messagesEndRef} />
        </div>
    );
};

// --- Chat Footer Component ---
interface ChatFooterProps {
    onSendMessage: (p: string) => void;
    isLoading: boolean;
    showStarters: boolean;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ onSendMessage, isLoading, showStarters }) => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 160;
            textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
            textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
        }
    }, [input]);

    return (
        <footer className="w-full max-w-3xl mx-auto p-4 z-10 flex-shrink-0">
            <div className="space-y-3">
                <div className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border flex flex-col transition-all duration-300">
                    {isBannerVisible && (
                        <div className="flex items-center justify-between p-3 bg-success/10 rounded-t-2xl border-b border-success/20">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold bg-success/20 text-success px-2 py-0.5 rounded-full">New</span>
                                <p className="text-sm text-success">{t('aiCenter.newBannerText')}</p>
                            </div>
                            <button onClick={() => setIsBannerVisible(false)} className="p-1 rounded-full text-success/80 hover:bg-success/20">
                                <Icons.XIcon className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    <div className="relative flex items-end p-2">
                        <Textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={t('aiCenter.placeholder')} rows={1} disabled={isLoading} className="w-full pl-3 pr-12 py-3 !bg-transparent !border-none resize-none focus:!ring-0 !text-base !shadow-none max-h-40" />
                        <Button className="absolute right-3 bottom-3 !rounded-lg !p-2.5" size="sm" onClick={handleSend} disabled={isLoading || !input.trim()}>
                           {isLoading ? <div className="w-5 h-5 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin"></div> : <Icons.ArrowUpIcon className="h-5 w-5"/>}
                        </Button>
                    </div>
                </div>
                {showStarters && (
                    <div className="flex items-center justify-center gap-2">
                        {[t('aiCenter.starter1'), t('aiCenter.starter2'), t('aiCenter.starter3')].map(prompt => (
                            <button key={prompt} onClick={() => onSendMessage(prompt)} disabled={isLoading} className="px-3 py-1.5 bg-secondary/50 backdrop-blur-sm border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed">{prompt}</button>
                        ))}
                    </div>
                )}
            </div>
        </footer>
    );
};

// --- Main Page Component ---
const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isLoadingRef = useRef(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    async function* streamAsyncIterator(stream: ReadableStream<Uint8Array>) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    if (buffer.length > 0) yield buffer;
                    return;
                }
                buffer += decoder.decode(value, { stream: true });
                let eolIndex;
                while ((eolIndex = buffer.indexOf('\n')) >= 0) {
                    const line = buffer.slice(0, eolIndex).trim();
                    if (line) {
                      yield line;
                    }
                    buffer = buffer.slice(eolIndex + 1);
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    const handleSendMessage = async (prompt: string) => {
        if (isLoadingRef.current) return;
    
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;
    
        isLoadingRef.current = true;
        setIsLoading(true);
    
        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: prompt };
        const modelMessageId = `model-${Date.now()}`;
        const newModelMessage: ChatMessage = { id: modelMessageId, role: 'model', content: '' };
    
        setMessages(prev => [...prev, userMessage, newModelMessage]);
    
        try {
            const response = await fetch('https://chat-stream-production.up.railway.app/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversation_id: "demo-124", 
                    message: prompt,
                }),
                signal,
            });
    
            if (!response.ok || !response.body) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            let aiResponse = '';
            let currentEvent = '';

            for await (const line of streamAsyncIterator(response.body)) {
                if (signal.aborted) break;
                
                if (line.startsWith('event:')) {
                    currentEvent = line.substring(6).trim();
                    if (currentEvent === 'end') {
                        break;
                    }
                    continue;
                }

                if (line.startsWith('data:')) {
                    if (currentEvent === 'message') {
                        const data = line.substring(5).trim();
                        if (data) {
                            aiResponse += data;
                            setMessages(prev => 
                                prev.map(msg => 
                                    msg.id === modelMessageId ? { ...msg, content: aiResponse } : msg
                                )
                            );
                        }
                    }
                    continue;
                }
                
                if (line.trim() === '') {
                    currentEvent = '';
                }
            }
    
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log("Fetch aborted.");
            } else {
                console.error("Error fetching chat response:", error);
                const errorMessageContent = error instanceof Error ? error.message : 'An unknown error occurred.';
                const errorMessage: ChatMessage = {
                    id: modelMessageId,
                    role: 'model',
                    content: `Sorry, I encountered an error: ${errorMessageContent}`,
                };
                setMessages(prev => prev.map(msg => msg.id === modelMessageId ? errorMessage : msg));
            }
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };
    
    return (
        <div className="h-full flex bg-background font-sans">
             <style>{`
                .typing-indicator { display: flex; align-items: center; gap: 4px; }
                .typing-indicator span { width: 8px; height: 8px; background-color: hsl(var(--muted-foreground)); border-radius: 50%; animation: typing-bounce 1.2s infinite ease-in-out; }
                .typing-indicator span:nth-child(2) { animation-delay: -0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: -0.4s; }
                @keyframes typing-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
                main::-webkit-scrollbar { display: none; }
                main { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            
            <ChatHistorySidebar isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

            <div className="flex-1 flex flex-col relative transition-all duration-300 ease-in-out">
                {!isHistoryOpen && (
                    <button onClick={() => setIsHistoryOpen(true)} className="absolute top-4 left-4 z-20 p-2 rounded-md bg-card/50 backdrop-blur-sm border border-border hover:bg-secondary text-muted-foreground" aria-label="Open chat history">
                        <Icons.HistoryIcon className="h-5 w-5" />
                    </button>
                )}
                <main className="flex-1 flex flex-col items-center relative overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="flex-grow flex items-center justify-center w-full">
                            <WelcomeScreen onSendMessage={handleSendMessage} isLoading={isLoading} />
                        </div>
                    ) : (
                        <ChatView messages={messages} messagesEndRef={messagesEndRef} />
                    )}
                </main>
                 <div className="sticky bottom-0 w-full flex justify-center">
                    <ChatFooter onSendMessage={handleSendMessage} isLoading={isLoading} showStarters={messages.length === 0} />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
