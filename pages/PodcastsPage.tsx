

import React, { useContext, useState, useEffect } from 'react';
import { Podcast } from '../types';
import { PlayerContext } from '../contexts/PlayerContext';
import { Play, Pause, Music, ListMusic, Download, Plus, X, ChevronsUpDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import Loader from '../components/icons/Loader';

const topicDetails: { [key: string]: { summary: string; imageUrl: string } } = {
    objection_handling: {
        summary: "A deep dive into handling specific, high-stakes cost objections. Learn how to reframe value and guide patients toward a confident 'yes'.",
        imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80"
    },
    upselling_opportunities: {
        summary: "Discover missed opportunities for suggesting complementary treatments like CO2 lasers and how to introduce them naturally into conversation.",
        imageUrl: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=800&q=80"
    },
    patient_education: {
        summary: "Learn to explain 'full' vs. 'natural' results using visual aids and clear analogies to set correct patient expectations.",
        imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&q=80"
    },
    rapport_building: {
        summary: "Master the first three minutes of your consultation. We cover verbal and non-verbal cues to build trust and make patients feel heard.",
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
    },
    default: {
        summary: 'An AI-generated podcast to help you improve your consultation skills.',
        imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
    }
};

const podcastTopics = [
    { value: 'patient_education', label: 'Patient Education' },
    { value: 'upselling_opportunities', label: 'Upselling Opportunities' },
    { value: 'objection_handling', label: 'Objection Handling' },
];

const formatApiPodcast = (apiPodcast: any): Podcast => {
    const details = topicDetails[apiPodcast.topic] || topicDetails.default;
    const durationSeconds = apiPodcast.file_size ? (apiPodcast.file_size * 8) / 128000 : 0;
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = Math.floor(durationSeconds % 60);

    return {
        id: apiPodcast.id,
        title: apiPodcast.title,
        date: new Date(apiPodcast.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        duration: durationSeconds > 0 ? `${minutes}:${seconds < 10 ? '0' : ''}${seconds}` : undefined,
        summary: details.summary,
        audioUrl: apiPodcast.audio_url,
        imageUrl: details.imageUrl,
        topic: apiPodcast.topic,
    };
};


// --- Component: FeaturedPodcastCard ---
const FeaturedPodcastCard: React.FC<{
    podcast: Podcast;
    onPlayClick: (podcast: Podcast) => void;
    isActive: boolean;
    isPlaying: boolean;
}> = ({ podcast, onPlayClick, isActive, isPlaying }) => {
    return (
        <div className="relative w-full h-80 rounded-xl overflow-hidden group shadow-lg">
            <img src={podcast.imageUrl} alt={podcast.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <h2 className="text-3xl font-bold tracking-tight">{podcast.title}</h2>
                <p className="mt-2 text-sm text-white/80 max-w-2xl line-clamp-2">{podcast.summary}</p>
                <div className="mt-6 flex items-center gap-4">
                    <Button 
                        size="lg" 
                        onClick={() => onPlayClick(podcast)} 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-3 font-bold shadow-lg"
                    >
                        {isActive && isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                        {isActive && isPlaying ? 'Pause' : 'Play Episode'}
                    </Button>
                    {podcast.duration && <span className="text-xs font-mono tracking-widest">{podcast.duration}</span>}
                </div>
            </div>
        </div>
    );
};


// --- Component: PodcastListItem ---
const PodcastListItem: React.FC<{
    podcast: Podcast;
    onPlayClick: (podcast: Podcast) => void;
    isActive: boolean;
    isPlaying: boolean;
}> = ({ podcast, onPlayClick, isActive, isPlaying }) => {
    return (
        <div 
            onClick={() => onPlayClick(podcast)}
            className={cn(
                "flex items-center gap-4 p-3 group hover:bg-secondary rounded-lg transition-colors cursor-pointer",
                isActive && "bg-secondary"
            )}
        >
            <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                <img src={podcast.imageUrl} alt={podcast.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {isActive && isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
                </div>
            </div>

            <div className="flex-1">
                <p className={cn("font-semibold text-sm", isActive ? 'text-primary' : 'text-foreground')}>{podcast.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{podcast.date}</p>
            </div>
            
            <div className="flex items-center gap-4 text-muted-foreground">
                {isActive ? (
                    <div className="flex items-center justify-center h-10 w-10">
                        <Music className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                ) : (
                    <span className="text-xs font-mono w-12 text-right">{podcast.duration || ''}</span>
                )}
                
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); alert('Download started!'); }}>
                    <Download className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

// --- Component: GeneratePodcastModal ---
const GeneratePodcastModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (topic: string) => Promise<void>;
}> = ({ isOpen, onClose, onGenerate }) => {
    const [selectedTopic, setSelectedTopic] = useState(podcastTopics[0].value);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            await onGenerate(selectedTopic);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg bg-card rounded-xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-foreground">Generate New Podcast</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-muted-foreground text-sm mb-4">Select a key topic from recent consultations to generate a new, personalized AI training podcast. This may take a few moments.</p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="topic-select" className="text-sm font-medium text-muted-foreground">Topic</label>
                         <div className="relative mt-1">
                            <select
                                id="topic-select"
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                disabled={isGenerating}
                                className="appearance-none w-full bg-secondary border border-transparent rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                {podcastTopics.map(topic => (
                                    <option key={topic.value} value={topic.value}>{topic.label}</option>
                                ))}
                            </select>
                            <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={onClose} disabled={isGenerating}>Cancel</Button>
                        <Button onClick={handleGenerate} disabled={isGenerating}>
                            {isGenerating ? (
                                <>
                                    <Loader /> <span className="ml-2">Generating...</span>
                                </>
                            ) : (
                                'Generate Podcast'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const PodcastsPage: React.FC = () => {
    const { currentPodcast, isPlaying, playPodcast, togglePlayPause } = useContext(PlayerContext);
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchPodcasts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('https://chat-stream-production.up.railway.app/podcast/list');
            if (!response.ok) {
                throw new Error(`Failed to fetch podcasts. Status: ${response.status}`);
            }
            const data = await response.json();
            const formatted = data.podcasts.map(formatApiPodcast);
            setPodcasts(formatted);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPodcasts();
    }, []);
    
    const handlePlayClick = (podcast: Podcast) => {
        if (currentPodcast?.id === podcast.id) {
            togglePlayPause();
        } else {
            playPodcast(podcast);
        }
    };

    const handleGeneratePodcast = async (topic: string) => {
        try {
            const response = await fetch(`https://chat-stream-production.up.railway.app/podcast/generate-audio?topic=${topic}&output_format=link&months=4`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate podcast.');
            }
            // Success
            setIsModalOpen(false);
            await fetchPodcasts(); // Refresh list
        } catch (error) {
            console.error("Generation failed:", error);
            throw error; // Re-throw to be caught by modal's error handler
        }
    };
    
    const featuredPodcast = podcasts.length > 0 ? podcasts[0] : null;
    const otherPodcasts = podcasts.slice(1);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-6">
                 <div>
                    <h1 className="text-3xl font-bold text-foreground">Weekly Podcasts</h1>
                    <p className="text-muted-foreground mt-1">AI-generated audio summaries of key weekly insights.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New Podcast
                </Button>
            </header>
            
            {isLoading && (
                <div className="flex items-center justify-center h-96">
                    <Loader />
                </div>
            )}
            
            {error && (
                 <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg">
                    <h2 className="text-lg font-semibold text-destructive">Failed to Load Podcasts</h2>
                    <p className="text-destructive/80 mt-1">{error}</p>
                 </div>
            )}
            
            {!isLoading && !error && (
                <main className="space-y-8">
                    {featuredPodcast ? (
                        <FeaturedPodcastCard 
                            podcast={featuredPodcast}
                            onPlayClick={handlePlayClick}
                            isActive={currentPodcast?.id === featuredPodcast.id}
                            isPlaying={currentPodcast?.id === featuredPodcast.id && isPlaying}
                        />
                    ) : (
                        <div className="text-center py-16 bg-card border border-border rounded-xl">
                            <h3 className="text-lg font-semibold text-foreground">No Podcasts Yet</h3>
                            <p className="text-muted-foreground mt-1">Generate your first podcast to get started!</p>
                        </div>
                    )}
                    
                    {otherPodcasts.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                                <ListMusic className="h-5 w-5 mr-3 text-primary"/>
                                Previous Episodes
                            </h2>
                            <div className="space-y-2">
                                {otherPodcasts.map((podcast) => (
                                     <PodcastListItem 
                                        key={podcast.id}
                                        podcast={podcast}
                                        onPlayClick={handlePlayClick}
                                        isActive={currentPodcast?.id === podcast.id}
                                        isPlaying={currentPodcast?.id === podcast.id && isPlaying}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            )}

            <GeneratePodcastModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGenerate={handleGeneratePodcast}
            />
        </div>
    );
};

export default PodcastsPage;