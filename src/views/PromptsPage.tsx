'use client';



import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Prompt } from '../types';
import { cn } from '../lib/utils';
import { Bot, Save, Undo2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/icons/Loader';
import { Button } from '../components/ui/button';
// Fix: Import the 'Tooltip' component.
import Tooltip from '../components/Tooltip';
import { useAuth } from '../contexts/AuthContext';
import { CHAT_API_BASE } from '../config';

const API_BASE_URL = `${CHAT_API_BASE}/api`;

const PromptsPage: React.FC = () => {
    const { session } = useAuth();
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [editableContent, setEditableContent] = useState('');
    
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [isEditorLoading, setIsEditorLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isReloading, setIsReloading] = useState(false);

    const [listError, setListError] = useState<string | null>(null);
    const [editorError, setEditorError] = useState<string | null>(null);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchPrompts = useCallback(async (selectFirst = false) => {
        if (!session) {
            setListError("Authentication required.");
            setIsLoadingList(false);
            return;
        }

        setIsLoadingList(true);
        setListError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/prompts`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch prompt list.');
            }
            const data = await response.json();
            
            const formattedPrompts: Prompt[] = (data.prompts || []).map((p: { id: string; name: string; category: string; description: string; content_preview?: string }) => ({
                id: p.id,
                title: p.name,
                category: p.category,
                description: p.description,
                prompt: p.content_preview || '',
            }));
            
            setPrompts(formattedPrompts);
            if (selectFirst && formattedPrompts.length > 0) {
                handleSelectPrompt(formattedPrompts[0]);
            } else if (formattedPrompts.length === 0) {
                setSelectedPrompt(null);
                setEditableContent('');
            }
        } catch (err) {
            setListError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoadingList(false);
        }
    }, [session]);

    const handleSelectPrompt = useCallback(async (prompt: Prompt) => {
        if (!session) {
            setEditorError("Authentication required.");
            return;
        }

        setIsEditorLoading(true);
        setEditorError(null);
        setSaveMessage(null);
        setSelectedPrompt(prompt);

        try {
            const response = await fetch(`${API_BASE_URL}/prompts/${prompt.id}`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if (!response.ok) {
                throw new Error(`Failed to load prompt content. Status: ${response.status}`);
            }
            const data = await response.json();
            const fullPrompt: Prompt = {
                ...prompt,
                prompt: data.content,
            };
            setSelectedPrompt(fullPrompt);
            setEditableContent(data.content);
        } catch (err) {
            setEditorError(err instanceof Error ? err.message : 'Could not load prompt.');
        } finally {
            setIsEditorLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchPrompts(true);
    }, [fetchPrompts]);


    const handleSave = async () => {
        if (!selectedPrompt || editableContent === selectedPrompt.prompt || !session) return;

        setIsSaving(true);
        setSaveMessage(null);
        try {
            const response = await fetch(`${API_BASE_URL}/prompts/${selectedPrompt.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ content: editableContent, updated_by: 'A360 Dashboard' }),
            });
            if (!response.ok) {
                throw new Error('Failed to save changes.');
            }
            const updatedPrompt = await response.json();
            
            setSelectedPrompt(prev => prev ? { ...prev, prompt: updatedPrompt.content } : null);
            setEditableContent(updatedPrompt.content);
            setSaveMessage({ type: 'success', text: 'Prompt saved successfully!' });
        } catch (err) {
            setSaveMessage({ type: 'error', text: err instanceof Error ? err.message : 'An unknown error occurred.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(null), 3000);
        }
    };
    
    const handleReload = async () => {
        if (!session) return;
        setIsReloading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/prompts/reload`, { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
             if (!response.ok) {
                throw new Error('Failed to trigger reload.');
            }
            await fetchPrompts(true);
        } catch (err) {
            setListError(err instanceof Error ? err.message : 'Reload failed.');
        } finally {
            setIsReloading(false);
        }
    };

    const hasChanges = selectedPrompt && editableContent !== selectedPrompt.prompt;

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(prompts.map(p => p.category))];
        return uniqueCategories.map(category => ({
            name: category,
            prompts: prompts.filter(p => p.category === category),
        }));
    }, [prompts]);

    const Sidebar = () => (
         <aside className="w-80 flex-shrink-0 bg-card border-r border-border h-full flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center">
                <h2 className="font-bold text-foreground">Prompt Library</h2>
                <Tooltip content="Reload all prompts from the database.">
                    <Button variant="ghost" size="icon" onClick={handleReload} disabled={isReloading || isLoadingList} className="h-8 w-8">
                       <RefreshCw className={cn("h-4 w-4", isReloading && "animate-spin")} />
                    </Button>
                </Tooltip>
            </div>
            <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
                {isLoadingList ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader />
                    </div>
                ) : listError ? (
                    <div className="p-4 text-center text-sm text-destructive">{listError}</div>
                ) : (
                    categories.map(category => (
                        <div key={category.name}>
                            <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{category.name}</h3>
                            <div className="space-y-1">
                                {category.prompts.map(prompt => (
                                    <a
                                        key={prompt.id}
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); handleSelectPrompt(prompt); }}
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
                    ))
                )}
            </nav>
        </aside>
    );

    const renderMainContent = () => {
        if (!selectedPrompt && !listError) {
             return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">Select a prompt to view</p>
                        <p className="text-muted-foreground mt-1">Choose an item from the category list on the left to review its content.</p>
                    </div>
                </div>
            );
        }

        if (isEditorLoading) {
            return (
                 <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-4">
                        <Loader />
                        <p className="text-muted-foreground">Loading Prompt...</p>
                    </div>
                </div>
            )
        }
        
        if (editorError) {
            return (
                 <div className="flex items-center justify-center h-full p-8">
                     <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg">
                        <h2 className="text-lg font-semibold text-destructive">Failed to Load Prompt</h2>
                        <p className="text-destructive/80 mt-1">{editorError}</p>
                    </div>
                </div>
            );
        }

        if (selectedPrompt) {
            return (
                 <div className="max-w-4xl mx-auto">
                    <DashboardCard
                        title={selectedPrompt.title}
                        tooltipText="'System Prompts' are the core instructions that guide the AI's behavior. You can review and edit them here to change how the AI responds across the platform."
                    >
                        <p className="text-muted-foreground -mt-4 mb-4">{selectedPrompt.description}</p>
                        <div>
                            <label htmlFor="prompt-editor" className="text-sm font-semibold text-muted-foreground flex items-center mb-2">
                                <Bot className="h-4 w-4 mr-2"/> System Prompt
                            </label>
                            <textarea
                                id="prompt-editor"
                                value={editableContent}
                                onChange={(e) => setEditableContent(e.target.value)}
                                className="w-full h-96 p-4 bg-secondary/50 border border-border rounded-lg text-sm font-mono leading-relaxed focus:outline-none resize-y focus:ring-1 focus:ring-ring"
                                placeholder="Enter prompt content..."
                            />
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-4">
                            {saveMessage && (
                                <div className={cn("flex items-center gap-2 text-sm", saveMessage.type === 'success' ? 'text-success' : 'text-destructive')}>
                                    {saveMessage.type === 'success' ? <CheckCircle className="h-4 w-4"/> : <AlertCircle className="h-4 w-4"/>}
                                    <span>{saveMessage.text}</span>
                                </div>
                            )}
                            <div className="flex-grow"></div>
                            <Button variant="ghost" onClick={() => setEditableContent(selectedPrompt.prompt)} disabled={!hasChanges || isSaving}>
                                <Undo2 className="h-4 w-4 mr-2"/>
                                Discard Changes
                            </Button>
                             <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader /> <span className="ml-2">Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2"/> Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </DashboardCard>
                </div>
            );
        }
        return null;
    };


    return (
        <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
               {renderMainContent()}
            </main>
        </div>
    );
};

export default PromptsPage;
