
import React, { useContext, useMemo } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const floorSeconds = Math.floor(seconds);
    const min = Math.floor(floorSeconds / 60);
    const sec = floorSeconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const ExpandedPlayer: React.FC = () => {
    const { 
        currentPodcast, 
        isPlaying, 
        progress, 
        duration, 
        togglePlayPause,
        seek,
        setVolume,
        volume,
        isExpanded,
        toggleExpanded
    } = useContext(PlayerContext);

    const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

    if (!isExpanded || !currentPodcast) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-[100] bg-background flex flex-col transition-opacity duration-300",
            isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            {/* Blurred Background */}
            <div 
                className="absolute inset-0 w-full h-full object-cover blur-3xl scale-125 opacity-30"
                style={{ backgroundImage: `url(${currentPodcast.imageUrl})`, backgroundSize: 'cover' }}
            ></div>

            <div className="relative flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
                {/* Header with Close Button */}
                <header className="flex-shrink-0">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleExpanded}>
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
                    {/* Artwork */}
                    <div className="w-full max-w-sm aspect-square rounded-xl shadow-2xl overflow-hidden">
                        <img src={currentPodcast.imageUrl} alt={currentPodcast.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Title & Info */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground">{currentPodcast.title}</h1>
                        <p className="text-base text-muted-foreground mt-1">{currentPodcast.date}</p>
                    </div>

                    {/* Seek Bar */}
                    <div className="w-full max-w-lg">
                        <div className="relative w-full h-1.5 bg-secondary rounded-full group cursor-pointer" onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            seek(duration * (clickX / rect.width));
                        }}>
                            <div className="absolute h-1.5 bg-primary rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                            <div 
                                className="absolute w-4 h-4 bg-primary rounded-full -translate-y-1/2 top-1/2 transition-opacity opacity-0 group-hover:opacity-100" 
                                style={{ left: `calc(${progressPercentage}% - 8px)` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Main Controls */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" disabled>
                            <SkipBack className="h-6 w-6" />
                        </Button>
                        <Button 
                            variant="default" 
                            size="icon" 
                            className="h-16 w-16 rounded-full shadow-lg"
                            onClick={togglePlayPause}
                        >
                            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 fill-current" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" disabled>
                            <SkipForward className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-3 w-full max-w-xs">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setVolume(volume > 0 ? 0 : 1)}>
                            {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-1 accent-primary bg-secondary rounded-full appearance-none cursor-pointer"
                        />
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ExpandedPlayer;
