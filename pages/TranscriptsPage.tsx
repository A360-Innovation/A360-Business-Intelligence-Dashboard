
import React, { useState, useEffect, useRef } from 'react';
import { useTranscripts, useTranscriptDetail, useTranscriptChat } from '../hooks/useTranscripts';
import { useClinicsList } from '../hooks/useClinicsList';
import { useAuth } from '../contexts/AuthContext';
import DateRangePicker from '../components/DateRangePicker';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import Loader from '../components/icons/Loader';
import { Search, ChevronDown, X, MessageSquare, FileText, Info, Send, User, Bot, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import DashboardCard from '../components/DashboardCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Filter Component ---
const TranscriptFilters = ({ 
    filters, 
    setFilters, 
    clinics, 
    isSuperAdmin 
}: { 
    filters: any, 
    setFilters: React.Dispatch<React.SetStateAction<any>>, 
    clinics: string[], 
    isSuperAdmin: boolean 
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Reset offset to 0 when filters change
        setFilters((prev: any) => ({ ...prev, [name]: value, offset: 0 }));
    };

    const handleDateRangeChange = ({ from, to }: { from: string; to: string }) => {
        // Reset offset to 0 when date range changes
        setFilters((prev: any) => ({ ...prev, date_from: from, date_to: to, offset: 0 }));
    };

    return (
        <div className="bg-card border border-border rounded-lg p-4 flex flex-col lg:flex-row gap-4 items-end lg:items-center">
            <div className="w-full sm:w-auto">
                <label className="text-xs font-medium text-muted-foreground block mb-1">Date Range</label>
                <DateRangePicker
                    value={{ from: filters.date_from, to: filters.date_to }}
                    onChange={handleDateRangeChange}
                />
            </div>
            
            {isSuperAdmin && (
                <div className="w-full sm:w-auto">
                    <label htmlFor="clinic" className="text-xs font-medium text-muted-foreground block mb-1">Clinic</label>
                    <div className="relative">
                        <select
                            id="clinic"
                            name="clinic"
                            value={filters.clinic}
                            onChange={handleInputChange}
                            className="appearance-none h-9 w-full sm:w-48 rounded-md border border-input bg-secondary/50 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {clinics.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            )}

            <div className="w-full sm:w-auto">
                <label htmlFor="satisfaction_min" className="text-xs font-medium text-muted-foreground block mb-1">Min Satisfaction</label>
                <select
                    id="satisfaction_min"
                    name="satisfaction_min"
                    value={filters.satisfaction_min}
                    onChange={handleInputChange}
                    className="h-9 w-full sm:w-32 rounded-md border border-input bg-secondary/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5 (Excellent)</option>
                </select>
            </div>

            <div className="w-full flex-1">
                <label htmlFor="procedure" className="text-xs font-medium text-muted-foreground block mb-1">Procedure Filter</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        name="procedure"
                        placeholder="Search by procedure (e.g. Botox)" 
                        value={filters.procedure}
                        onChange={handleInputChange}
                        className="pl-9 h-9 bg-secondary/50"
                    />
                </div>
            </div>
        </div>
    );
};

// --- Chat Component for Detail View ---
const TranscriptChat = ({ transcriptId }: { transcriptId: string }) => {
    const { messages, loading, sendMessage, clearChat } = useTranscriptChat(transcriptId);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Reset chat when transcript ID changes
    useEffect(() => {
        clearChat();
    }, [transcriptId]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (input.trim() && !loading) {
            sendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full border rounded-lg bg-background overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground p-4 text-sm">
                        <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Ask specific questions about this consultation.</p>
                        <p className="text-xs mt-1">Example: "Did the patient mention any allergies?"</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", msg.role === 'user' ? "bg-primary/10" : "bg-secondary")}>
                            {msg.role === 'user' ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div className={cn("rounded-lg p-3 max-w-[80%] text-sm", msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-card border border-border")}>
                            <ReactMarkdown className="prose-sm max-w-none">{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"><Bot className="h-4 w-4 text-muted-foreground" /></div>
                        <div className="bg-card border border-border rounded-lg p-3"><Loader /></div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex gap-2">
                <Input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    placeholder="Ask about this transcript..." 
                    className="flex-1"
                    disabled={loading}
                />
                <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
};

// --- Detail Drawer Component ---
const TranscriptDetailDrawer = ({ 
    transcriptId, 
    isOpen, 
    onClose 
}: { 
    transcriptId: string | null, 
    isOpen: boolean, 
    onClose: () => void 
}) => {
    const { detail, loading, error } = useTranscriptDetail(transcriptId);
    const [activeTab, setActiveTab] = useState<'text' | 'chat'>('text');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            {/* Drawer */}
            <div className="relative w-full max-w-2xl bg-background h-full shadow-2xl border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                    <h2 className="font-bold text-lg">Transcript Details</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center"><Loader /></div>
                ) : error ? (
                    <div className="p-8 text-center text-destructive">{error}</div>
                ) : detail ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Header Info */}
                        <div className="p-4 bg-secondary/20 border-b border-border grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{detail.id.slice(0, 8)}...</span></div>
                            <div><span className="text-muted-foreground">Date:</span> {detail.day}</div>
                            <div><span className="text-muted-foreground">Clinic:</span> {detail.clinic}</div>
                            <div><span className="text-muted-foreground">Duration:</span> {detail.duration_min.toFixed(1)} min</div>
                            <div className="col-span-2 flex gap-2 mt-2">
                                <Badge variant="outline" className={detail.satisfaction_score && detail.satisfaction_score >= 0.8 ? "text-success border-success/50 bg-success/5" : "text-warning border-warning/50 bg-warning/5"}>
                                    Satisfaction: {detail.satisfaction_score ? Math.round(detail.satisfaction_score * 100) + '%' : 'N/A'}
                                </Badge>
                                <Badge variant="outline" className="text-primary border-primary/50 bg-primary/5">
                                    Education: {detail.education_effectiveness_score ? Math.round(detail.education_effectiveness_score * 100) + '%' : 'N/A'}
                                </Badge>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-border">
                            <button 
                                onClick={() => setActiveTab('text')}
                                className={cn("flex-1 p-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'text' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                            >
                                Full Transcript
                            </button>
                            <button 
                                onClick={() => setActiveTab('chat')}
                                className={cn("flex-1 p-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'chat' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                            >
                                Chat with AI
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden p-4 bg-secondary/10">
                            {activeTab === 'text' ? (
                                <div className="h-full overflow-y-auto rounded-lg border border-border bg-card p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                                    {detail.raw_text}
                                </div>
                            ) : (
                                <TranscriptChat transcriptId={detail.id} />
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

// --- Main Page ---
const TranscriptsPage: React.FC = () => {
    const { isSuperAdmin } = useAuth();
    const { clinics } = useClinicsList();
    const [filters, setFilters] = useState({
        date_from: '2025-06-01',
        date_to: '2025-10-31',
        clinic: 'All Clinics',
        satisfaction_min: '',
        procedure: '',
        limit: 20, // Pagination page size
        offset: 0
    });

    const [selectedTranscriptId, setSelectedTranscriptId] = useState<string | null>(null);
    
    const { transcripts, loading, error, total, refetch } = useTranscripts({
        ...filters,
        satisfaction_min: filters.satisfaction_min ? Number(filters.satisfaction_min) : undefined,
    });

    const handlePageChange = (newOffset: number) => {
        setFilters(prev => ({ ...prev, offset: newOffset }));
    };

    const startRecord = filters.offset + 1;
    const endRecord = Math.min(filters.offset + filters.limit, total);
    const hasNext = filters.offset + filters.limit < total;
    const hasPrev = filters.offset > 0;

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Transcripts Explorer</h1>
                    <p className="text-muted-foreground mt-1">Search, filter, and analyze individual consultation transcripts.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
                    <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                    Refresh
                </Button>
            </div>

            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
                <TranscriptFilters 
                    filters={filters} 
                    setFilters={setFilters} 
                    clinics={clinics} 
                    isSuperAdmin={isSuperAdmin} 
                />

                <DashboardCard title={`Transcripts (${total})`} tooltipText="List of processed consultation transcripts matching your filters." className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex flex-col h-full">
                        {loading && transcripts.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center"><Loader /></div>
                        ) : error ? (
                            <div className="flex-1 flex items-center justify-center text-destructive">{error}</div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-auto -mx-6 px-6">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-muted-foreground font-medium border-b border-border sticky top-0 bg-card z-10">
                                            <tr>
                                                <th className="py-3 pr-4">Date</th>
                                                <th className="py-3 px-4">Clinic</th>
                                                <th className="py-3 px-4">Duration</th>
                                                <th className="py-3 px-4">Satisfaction</th>
                                                <th className="py-3 px-4">Top Procedures</th>
                                                <th className="py-3 px-4">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {transcripts.map((t) => (
                                                <tr key={t.id} className="group hover:bg-accent/50 transition-colors">
                                                    <td className="py-3 pr-4 font-medium text-foreground whitespace-nowrap">{t.day}</td>
                                                    <td className="py-3 px-4 text-muted-foreground">{t.clinic}</td>
                                                    <td className="py-3 px-4 text-foreground">{t.duration_min.toFixed(1)}m</td>
                                                    <td className="py-3 px-4">
                                                        {t.satisfaction_score !== null ? (
                                                            <Badge variant="outline" className={cn(
                                                                t.satisfaction_score >= 0.8 ? "border-success/30 text-success bg-success/5" : 
                                                                t.satisfaction_score < 0.6 ? "border-destructive/30 text-destructive bg-destructive/5" : 
                                                                "border-warning/30 text-warning bg-warning/5"
                                                            )}>
                                                                {Math.round(t.satisfaction_score * 100)}%
                                                            </Badge>
                                                        ) : <span className="text-muted-foreground">-</span>}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {t.top_procedures.slice(0, 2).map((p, i) => (
                                                                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                                                                    {p}
                                                                </span>
                                                            ))}
                                                            {t.top_procedures.length > 2 && (
                                                                <span className="text-xs text-muted-foreground">+{t.top_procedures.length - 2}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Button variant="ghost" size="sm" onClick={() => setSelectedTranscriptId(t.id)} className="text-primary hover:text-primary/80 hover:bg-primary/10">
                                                            View <Info className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {transcripts.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">No transcripts found matching your filters.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {transcripts.length > 0 && (
                                    <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Showing <span className="font-medium text-foreground">{startRecord}</span> to <span className="font-medium text-foreground">{endRecord}</span> of <span className="font-medium text-foreground">{total}</span> results
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handlePageChange(Math.max(0, filters.offset - filters.limit))}
                                                disabled={!hasPrev}
                                            >
                                                <ChevronLeft className="h-4 w-4 mr-2" />
                                                Previous
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handlePageChange(filters.offset + filters.limit)}
                                                disabled={!hasNext}
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </DashboardCard>
            </div>

            <TranscriptDetailDrawer 
                transcriptId={selectedTranscriptId} 
                isOpen={!!selectedTranscriptId} 
                onClose={() => setSelectedTranscriptId(null)} 
            />
        </div>
    );
};

export default TranscriptsPage;
