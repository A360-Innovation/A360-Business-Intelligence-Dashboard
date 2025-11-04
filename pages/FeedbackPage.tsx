import React, { useState, useEffect } from 'react';
import { useFeedbackData } from '../hooks/useFeedbackData';
import Loader from '../components/icons/Loader';
import DatePicker from '../components/DatePicker';
import { ChevronDown, MessageCircle, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import { Feedback } from '../types';

const FeedbackCard: React.FC<{ item: Feedback }> = ({ item }) => {
    const sentimentConfig = {
        positive: {
            icon: ThumbsUp,
            badgeClass: 'border-success/50 bg-success/5 text-success',
            iconClass: 'text-success',
            borderColor: 'border-l-success'
        },
        negative: {
            icon: ThumbsDown,
            badgeClass: 'border-destructive/50 bg-destructive/5 text-destructive',
            iconClass: 'text-destructive',
            borderColor: 'border-l-destructive'
        },
        neutral: {
            icon: Meh,
            badgeClass: 'border-amber-500/50 bg-amber-500/5 text-amber-600',
            iconClass: 'text-amber-600',
            borderColor: 'border-l-amber-500'
        },
    };
    
    const config = sentimentConfig[item.label] || sentimentConfig.neutral;
    const Icon = config.icon;

    return (
        <div className={cn("bg-card border border-border border-l-4 rounded-lg p-4 flex flex-col h-full", config.borderColor)}>
            <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className={cn("capitalize", config.badgeClass)}>
                    <Icon className="h-3 w-3 mr-1.5" />
                    {item.label}
                </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex-grow italic">"{item.snippet}"</p>
        </div>
    );
};


const FeedbackPage: React.FC = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const [filters, setFilters] = useState({
        start_date: formatDate(oneMonthAgo),
        end_date: formatDate(today),
        clinic: 'All Clinics',
    });
    
    const [clinics, setClinics] = useState<string[]>([]);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await fetch('https://rag-aesthetic-production.up.railway.app/clinics/');
                if (!response.ok) throw new Error('Failed to fetch clinics');
                const data = await response.json();
                setClinics(['All Clinics', ...(data.clinics || [])]);
            } catch (error) {
                console.error('Error fetching clinics:', error);
                setClinics(['All Clinics']);
            }
        };
        fetchClinics();
    }, []);

    const { feedback, loading, error } = useFeedbackData(filters);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">User Feedback Analysis</h1>
                <p className="text-muted-foreground mt-1">Direct feedback snippets from patient consultations.</p>
            </header>
            
            <div className="p-4 bg-card border border-border rounded-lg flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="w-full sm:w-auto">
                    <label htmlFor="start_date" className="text-xs font-medium text-muted-foreground">From</label>
                    <DatePicker id="start_date" name="start_date" value={filters.start_date} onChange={handleFilterChange} />
                </div>
                <div className="w-full sm:w-auto">
                     <label htmlFor="end_date" className="text-xs font-medium text-muted-foreground">To</label>
                     <DatePicker id="end_date" name="end_date" value={filters.end_date} onChange={handleFilterChange} />
                </div>
                <div className="w-full sm:w-auto">
                    <label htmlFor="clinic" className="text-xs font-medium text-muted-foreground">Clinic</label>
                    <div className="relative mt-1">
                        <select
                            id="clinic"
                            name="clinic"
                            value={filters.clinic}
                            onChange={handleFilterChange}
                            className="appearance-none h-9 w-full sm:w-48 rounded-md border border-input bg-card pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {clinics.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            <main>
                 {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-4">
                            <Loader />
                            <p className="text-muted-foreground">Loading Feedback...</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg">
                            <h2 className="text-lg font-semibold text-destructive">Failed to Load Feedback</h2>
                            <p className="text-destructive/80 mt-1">{error}</p>
                        </div>
                    </div>
                )}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {feedback.length > 0 ? (
                            feedback.map((item, index) => <FeedbackCard key={index} item={item} />)
                        ) : (
                           <div className="col-span-full text-center py-16 bg-card border border-border rounded-xl">
                                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                                <h3 className="text-lg font-semibold text-foreground mt-4">No Feedback Found</h3>
                                <p className="text-muted-foreground mt-1">There is no feedback available for the selected filters.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FeedbackPage;