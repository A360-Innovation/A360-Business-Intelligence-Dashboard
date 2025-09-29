import React, { useState, useMemo, useEffect } from 'react';
import { Prompt } from '../types';
import { promptsData } from '../data/promptsData';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Bot, Tag } from 'lucide-react';

const PromptsPage: React.FC = () => {
    const [prompts, setPrompts] = useState<Prompt[]>(promptsData);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [editedPromptText, setEditedPromptText] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(prompts.map(p => p.category))];
        return uniqueCategories.map(category => ({
            name: category,
            prompts: prompts.filter(p => p.category === category),
        }));
    }, [prompts]);

    useEffect(() => {
        if (selectedPrompt) {
            setEditedPromptText(selectedPrompt.prompt);
        } else {
            setEditedPromptText('');
        }
    }, [selectedPrompt]);
    
    const handleSave = () => {
        if (!selectedPrompt) return;

        // In a real app, this would be an API call.
        // For now, we update the local state.
        const updatedPrompts = prompts.map(p => 
            p.id === selectedPrompt.id ? { ...p, prompt: editedPromptText } : p
        );
        setPrompts(updatedPrompts);
        setSelectedPrompt(prev => prev ? { ...prev, prompt: editedPromptText } : null);
        
        // Show saved confirmation
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="flex h-full">
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
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {selectedPrompt ? (
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-6">
                            <h1 className="text-2xl font-bold text-foreground">{selectedPrompt.title}</h1>
                            <p className="text-muted-foreground mt-1">{selectedPrompt.description}</p>
                        </header>

                        {selectedPrompt.placeholders && selectedPrompt.placeholders.length > 0 && (
                            <div className="mb-4 p-3 bg-secondary rounded-lg">
                                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center"><Tag className="h-4 w-4 mr-2"/>Available Placeholders</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPrompt.placeholders.map(p => (
                                        <code key={p} className="text-xs bg-background border border-border rounded px-2 py-1 font-mono text-primary">{p}</code>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="prompt-editor" className="text-sm font-semibold text-muted-foreground flex items-center mb-2">
                                <Bot className="h-4 w-4 mr-2"/> System Prompt
                            </label>
                            <textarea
                                id="prompt-editor"
                                value={editedPromptText}
                                onChange={(e) => setEditedPromptText(e.target.value)}
                                className="w-full h-96 p-4 bg-secondary/50 border border-border rounded-lg text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                                placeholder="Enter the system prompt..."
                            />
                        </div>

                        <footer className="mt-4 flex justify-end">
                            <Button onClick={handleSave} disabled={isSaved || editedPromptText === selectedPrompt.prompt}>
                                {isSaved ? 'Saved!' : 'Save Changes'}
                            </Button>
                        </footer>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">Select a prompt to view</p>
                            <p className="text-muted-foreground mt-1">Choose an item from the category list on the left to edit its content.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PromptsPage;
