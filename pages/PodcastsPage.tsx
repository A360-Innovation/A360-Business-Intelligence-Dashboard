
import React, { useContext } from 'react';
import { Podcast } from '../types';
import { PlayerContext } from '../contexts/PlayerContext';
import { Play, Pause, Music } from 'lucide-react';

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
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Weekly Improvement Podcasts</h1>
                <p className="text-muted-foreground mt-1">AI-generated audio summaries to help you refine your skills.</p>
            </header>
            <main>
                <div className="border border-border rounded-lg overflow-hidden">
                    <div className="flex flex-col">
                        <div className="grid grid-cols-[50px_4fr_6fr_1fr] items-center gap-4 px-4 py-2 border-b border-border bg-secondary text-xs text-muted-foreground font-semibold uppercase">
                            <div className="text-center">#</div>
                            <div>Title</div>
                            <div>Summary</div>
                            <div className="text-right">Duration</div>
                        </div>
                        {podcasts.map((podcast, index) => {
                            const isActive = currentPodcast?.id === podcast.id;
                            return (
                                <div 
                                    key={podcast.id} 
                                    className="grid grid-cols-[50px_4fr_6fr_1fr] items-center gap-4 px-4 h-20 group hover:bg-accent transition-colors border-b border-border last:border-b-0"
                                >
                                    <div className="flex items-center justify-center relative">
                                        <button 
                                            onClick={() => handlePlayClick(podcast)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity z-10"
                                        >
                                            {isActive && isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
                                        </button>
                                        
                                        {isActive ? (
                                             <div className="flex items-center justify-center h-10 w-10">
                                                <Music className="h-5 w-5 text-primary animate-pulse" />
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground group-hover:opacity-0">{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img src={podcast.imageUrl} alt={podcast.title} className="h-10 w-10 rounded-md object-cover" />
                                        <div>
                                            <p className={`font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>{podcast.title}</p>
                                            <p className="text-xs text-muted-foreground">{podcast.date}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{podcast.summary}</p>
                                    <p className="text-sm text-muted-foreground text-right">{podcast.duration}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PodcastsPage;
