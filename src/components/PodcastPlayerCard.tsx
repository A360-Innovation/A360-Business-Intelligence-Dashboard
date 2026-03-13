'use client';

import React, { useContext, useMemo } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const floorSeconds = Math.floor(seconds);
    const min = Math.floor(floorSeconds / 60);
    const sec = floorSeconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const PodcastPlayerCard: React.FC = () => {
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

    if (!currentPodcast) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-secondary/50 rounded-lg p-8 text-center">
                <p className="text-lg font-semibold text-foreground">Select a podcast to play</p>
                <p className="text-muted-foreground mt-1">Choose an episode from the list to begin listening.</p>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col justify-between shadow-lg">
            <div>
                <img src={currentPodcast.imageUrl} alt={currentPodcast.title} className="w-full h-48 rounded-lg object-cover mb-4" />
                <h2 className="text-xl font-bold text-foreground">{currentPodcast.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{currentPodcast.summary}</p>
            </div>
            
            <div className="mt-6">
                {/* Progress Bar */}
                <div className="relative w-full h-1.5 bg-secondary rounded-full group cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = clickX / rect.width;
                    seek(duration * percentage);
                }}>
                    <div className="absolute h-1.5 bg-primary rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    <div 
                        className="absolute w-3 h-3 bg-primary rounded-full -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity" 
                        style={{ left: `calc(${progressPercentage}% - 6px)` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mt-4">
                     <div className="flex items-center gap-2 w-28">
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

                    <Button 
                        variant="default" 
                        size="icon" 
                        className="h-12 w-12 rounded-full"
                        onClick={togglePlayPause}
                    >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    
                    <div className="w-28"></div> {/* Spacer */}
                </div>
            </div>
        </div>
    );
};

export default PodcastPlayerCard;
