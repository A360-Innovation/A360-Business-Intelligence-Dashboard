

import React, { useContext } from 'react';
import { Podcast } from '../types';
import { PlayerContext } from '../contexts/PlayerContext';
import { Play, Pause, Music, ListMusic, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

const podcasts: Podcast[] = [
  {
    id: 5,
    title: "Decoding the $847 Question: Turning Objections into Opportunities",
    date: "September 9, 2024",
    duration: "9:55",
    summary: "A deep dive into handling specific, high-stakes cost objections. Learn how to reframe value and guide patients toward a confident 'yes'.",
    audioUrl: "https://gjnumzwkahtlvaliwljm.supabase.co/storage/v1/object/public/podcasts/objection_handling/20251001_181305_25dab26d.mp3",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80"
  },
  {
    id: 1,
    title: "Week 35: Mastering Objection Handling",
    date: "September 2, 2024",
    duration: "8:45",
    summary: "Dive deep into the 'Feel-Felt-Found' technique and analyze real examples from last week's consultations to masterfully handle patient concerns.",
    audioUrl: "https://storage.googleapis.com/aai-web-samples/5_ways_to_work_smarter.mp3",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
  },
  {
    id: 2,
    title: "Week 34: Unlocking Upselling Opportunities",
    date: "August 26, 2024",
    duration: "10:12",
    summary: "Discover missed opportunities for suggesting complementary treatments like CO2 lasers and how to introduce them naturally into conversation.",
    audioUrl: "https://storage.googleapis.com/aai-web-samples/aai-analytics-demo-1.mp3",
    imageUrl: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=800&q=80"
  },
  {
    id: 3,
    title: "Week 33: Perfecting Patient Education",
    date: "August 19, 2024",
    duration: "7:30",
    summary: "Learn to explain 'full' vs. 'natural' results using visual aids and clear analogies to set correct patient expectations.",
    audioUrl: "https://storage.googleapis.com/aai-web-samples/aai-analytics-demo-2.mp3",
    imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&q=80"
  },
    {
    id: 4,
    title: "Week 32: Building Instant Rapport",
    date: "August 12, 2024",
    duration: "9:21",
    summary: "Master the first three minutes of your consultation. We cover verbal and non-verbal cues to build trust and make patients feel heard.",
    audioUrl: "https://storage.googleapis.com/aai-web-samples/aai-analytics-demo-3.mp3",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
  },
];


// --- New Component: FeaturedPodcastCard ---
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
                    <span className="text-xs font-mono tracking-widest">{podcast.duration}</span>
                </div>
            </div>
        </div>
    );
};


// --- New Component: PodcastListItem ---
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
                    <span className="text-xs font-mono">{podcast.duration}</span>
                )}
                
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); alert('Download started!'); }}>
                    <Download className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};


// --- Updated Main Page Component ---
const PodcastsPage: React.FC = () => {
    const { currentPodcast, isPlaying, playPodcast, togglePlayPause } = useContext(PlayerContext);
    
    const handlePlayClick = (podcast: Podcast) => {
        if (currentPodcast?.id === podcast.id) {
            togglePlayPause();
        } else {
            playPodcast(podcast);
        }
    };
    
    const featuredPodcast = podcasts[0];
    const otherPodcasts = podcasts.slice(1);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <main className="space-y-8">
                {featuredPodcast && (
                    <FeaturedPodcastCard 
                        podcast={featuredPodcast}
                        onPlayClick={handlePlayClick}
                        isActive={currentPodcast?.id === featuredPodcast.id}
                        isPlaying={currentPodcast?.id === featuredPodcast.id && isPlaying}
                    />
                )}
                
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
            </main>
        </div>
    );
};

export default PodcastsPage;