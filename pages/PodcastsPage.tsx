
import React, { useContext } from 'react';
import { Podcast } from '../types';
import { PlayerContext } from '../contexts/PlayerContext';
import { Play, Pause, Music } from 'lucide-react';
import PodcastPlayerCard from '../components/PodcastPlayerCard';
import { cn } from '../lib/utils';
import DashboardCard from '../components/DashboardCard';

const podcasts: Podcast[] = [
  {
    id: 1,
    title: "Week 35: Mastering Objection Handling",
    date: "September 2, 2024",
    duration: "8:45",
    summary: "Dive deep into the 'Feel-Felt-Found' technique and analyze real examples.",
    audioUrl: "https://storage.googleapis.com/aai-web-samples/5_ways_to_work_smarter.mp3",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
  },
  {
    id: 2,
    title: "Week 34: Unlocking Upselling Opportunities",
    date: "August 26, 2024",
    duration: "10:12",
    summary: "Discover missed opportunities for suggesting complementary treatments like CO2 lasers.",
    audioUrl: "https://storage.googleapis.com/aai-web-samples/aai-analytics-demo-1.mp3",
    imageUrl: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400&q=80"
  },
  {
    id: 3,
    title: "Week 33: Perfecting Patient Education",
    date: "August 19, 2024",
    duration: "7:30",
    summary: "Learn to explain 'full' vs. 'natural' results using visual aids and clear analogies.",
    audioUrl: "https://storage.googleapis.com/aai-web-samples/aai-analytics-demo-2.mp3",
    imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&q=80"
  },
    {
    id: 4,
    title: "Week 32: Building Instant Rapport",
    date: "August 12, 2024",
    duration: "9:21",
    summary: "Learn verbal and non-verbal cues to build trust in the first few minutes.",
    audioUrl: "https://storage.googleapis.com/aai-web-samples/aai-analytics-demo-3.mp3",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"
  },
];


const PodcastsPage: React.FC = () => {
    const { currentPodcast, isPlaying, playPodcast, togglePlayPause } = useContext(PlayerContext);
    
    const handlePlayClick = (podcast: Podcast) => {
        if (currentPodcast?.id === podcast.id) {
            togglePlayPause();
        } else {
            playPodcast(podcast);
        }
    };
    
    return (
        <div className="flex h-full">
            {/* Left Column: Podcast List */}
            <div className="w-1/2 flex-shrink-0 border-r border-border h-full flex flex-col">
                <DashboardCard
                    title="Weekly Improvement Podcasts"
                    tooltipText="Listen to AI-generated weekly audio summaries that distill key learnings from consultations to help you continuously improve."
                    className="h-full flex flex-col !rounded-none !border-0"
                >
                    <p className="text-muted-foreground mt-1 text-sm -mt-4 mb-4">AI-generated audio summaries to refine your skills.</p>
                     <div className="flex-1 overflow-y-auto -mx-6">
                        <div className="flex flex-col">
                            {podcasts.map((podcast) => {
                                const isActive = currentPodcast?.id === podcast.id;
                                return (
                                    <div 
                                        key={podcast.id} 
                                        onClick={() => handlePlayClick(podcast)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 group hover:bg-accent transition-colors border-b border-border last:border-b-0 cursor-pointer",
                                            isActive && "bg-secondary"
                                        )}
                                    >
                                        <div className="relative h-12 w-12 flex-shrink-0">
                                            <img src={podcast.imageUrl} alt={podcast.title} className="h-full w-full rounded-md object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                {isActive && isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <p className={cn("font-semibold text-sm", isActive ? 'text-primary' : 'text-foreground')}>{podcast.title}</p>
                                            <p className="text-xs text-muted-foreground">{podcast.date} &middot; {podcast.duration}</p>
                                        </div>
                                        
                                        {isActive && (
                                            <div className="flex items-center justify-center h-10 w-10">
                                                <Music className="h-5 w-5 text-primary animate-pulse" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </DashboardCard>
            </div>
            
            {/* Right Column: Player Card */}
            <div className="w-1/2 p-4 sm:p-6 lg:p-8">
                 <PodcastPlayerCard />
            </div>
        </div>
    );
};

export default PodcastsPage;
