
import React, { useContext, useMemo } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const floorSeconds = Math.floor(seconds);
    const min = Math.floor(floorSeconds / 60);
    const sec = floorSeconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const Player: React.FC = () => {
    const { 
        currentPodcast, 
        isPlaying, 
        progress, 
        duration, 
        togglePlayPause,
        seek,
        setVolume,
        volume,
    } = useContext(PlayerContext);
    
    const progressPercentage = useMemo(() => (duration > 0 ? (progress / duration) * 100 : 0), [progress, duration]);

    if (!currentPodcast) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-sm border-t border-border z-50">
            <div className="flex items-center justify-between h-full px-4 sm:px-6">
                {/* Podcast Info */}
                <div className="flex items-center gap-3 w-1/4">
                    <img src={currentPodcast.imageUrl} alt={currentPodcast.title} className="h-12 w-12 rounded-md object-cover" />
                    <div>
                        <p className="font-semibold text-foreground truncate">{currentPodcast.title}</p>
                        <p className="text-xs text-muted-foreground">{currentPodcast.date}</p>
                    </div>
                </div>

                {/* Player Controls */}
                <div className="flex flex-col items-center justify-center gap-1 flex-grow">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled>
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="default" 
                            size="icon" 
                            className="h-10 w-10 rounded-full"
                            onClick={togglePlayPause}
                        >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled>
                            <SkipForward className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 w-full max-w-lg">
                        <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
                        <div className="relative w-full h-1 bg-secondary rounded-full group cursor-pointer" onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const percentage = clickX / rect.width;
                            seek(duration * percentage);
                        }}>
                            <div className="absolute h-1 bg-primary rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                            <div 
                                className="absolute w-3 h-3 bg-primary rounded-full -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity" 
                                style={{ left: `calc(${progressPercentage}% - 6px)` }}
                            ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 w-1/4 justify-end">
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
                      className="w-24 h-1 accent-primary bg-secondary rounded-full appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};

export default Player;
