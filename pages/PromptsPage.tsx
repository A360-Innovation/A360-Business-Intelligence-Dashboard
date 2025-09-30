

import React, { useState, useMemo, useEffect } from 'react';
import { Prompt } from '../types';
import { cn } from '../lib/utils';
import { Bot } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/icons/Loader';

const promptMetadata: { [key: string]: Omit<Prompt, 'id' | 'prompt'> } = {
    total_transcripts: {
      category: 'Dashboard Analysis',
      title: 'Consultation Volume Analysis',
      description: 'Analyzes consultation volume trends for the dashboard reports.',
    },
    overall_satisfaction: {
      category: 'Dashboard Analysis',
      title: 'Overall Satisfaction Analysis',
      description: 'Analyzes drivers of patient satisfaction for the dashboard reports.',
    },
    education_effectiveness: {
      category: 'Dashboard Analysis',
      title: 'Education Effectiveness Analysis',
      description: 'Analyzes the quality of patient education for the dashboard reports.',
    },
    top_procedures: {
      category: 'Dashboard Analysis',
      title: 'Top Procedures Analysis',
      description: 'Analyzes the procedure mix and trends for the dashboard reports.',
    },
    chat_system: {
      category: 'A360 Chat',
      title: 'A360 Chat System Prompt',
      description: 'The core system prompt for the AI chat assistant, defining its persona and capabilities.',
    },
};


const PromptsPage: React.FC = () => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('https://chat-stream-production.up.railway.app/prompts');
                if (!response.ok) {
                    throw new Error('Failed to fetch prompts.');
                }
                const data = await response.json();
                
                const formattedPrompts: Prompt[] = Object.keys(data)
                  .filter(key => promptMetadata[key]) // Filter out prompts not in our metadata
                  .map(key => {
                    const metadata = promptMetadata[key];
                    return {
                        id: key,
                        ...metadata,
                        prompt: data[key],
                    };
                });
                
                setPrompts(formattedPrompts);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrompts();
    }, []);

    const categories = useMemo(() => {
        if (isLoading) return [];
        const uniqueCategories = [...new Set(prompts.map(p => p.category))];
        return uniqueCategories.map(category => ({
            name: category,
            prompts: prompts.filter(p => p.category === category),
        }));
    }, [prompts, isLoading]);
    
    const Sidebar = () => (
         <aside className="w-80 flex-shrink-0 bg-card border-r border-border h-full flex flex-col">
            <div className="p-4 border-b border-border">
                <h2 className="font-bold text-foreground">Prompt Categories</h2>
            </div>
            <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
                {categories.map(category => (
                    <div key={category.name}>
                        <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{category.name}</h3>
                        <div className="space-y-1">
                            {category.prompts.map(prompt => (
                                <a
                                    key={prompt.id}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setSelectedPrompt(prompt); }}
                                    className={cn(
                                        'block px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                        selectedPrompt?.id === prompt.id
                                            ? 'bg-secondary text-foreground'
                                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                    )}
                                >
                                    {prompt.title}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );

    if (isLoading) {
        return (
            <div className="flex h-full">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader />
                        <p className="text-muted-foreground">Loading Prompts...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
       return (
            <div className="flex h-full">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center p-8">
                     <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg">
                        <h2 className="text-lg font-semibold text-destructive">Failed to Load Prompts</h2>
                        <p className="text-destructive/80 mt-1">{error}</p>
                    </div>
                </main>
            </div>
       );
    }

    return (
        <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {selectedPrompt ? (
                    <div className="max-w-4xl mx-auto">
                        <DashboardCard
                            title={selectedPrompt.title}
                            tooltipText="'System Prompts' are the core instructions that guide the AI's behavior. You can review them here to understand how the AI will respond across the platform."
                        >
                             <p className="text-muted-foreground mt-1 -mt-4 mb-4">{selectedPrompt.description}</p>
                            <div>
                                <label htmlFor="prompt-editor" className="text-sm font-semibold text-muted-foreground flex items-center mb-2">
                                    <Bot className="h-4 w-4 mr-2"/> System Prompt
                                </label>
                                <textarea
                                    id="prompt-editor"
                                    value={selectedPrompt.prompt}
                                    readOnly
                                    className="w-full h-96 p-4 bg-secondary/50 border border-border rounded-lg text-sm font-mono leading-relaxed focus:outline-none resize-y cursor-default"
                                    placeholder="Prompt content..."
                                />
                            </div>
                        </DashboardCard>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">Select a prompt to view</p>
                            <p className="text-muted-foreground mt-1">Choose an item from the category list on the left to review its content.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PromptsPage;