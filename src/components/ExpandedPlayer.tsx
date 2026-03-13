'use client';

import React, { useContext, useMemo, useRef, useEffect } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
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
        toggleExpanded,
        subtitles,
    } = useContext(PlayerContext);

    const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;
    
    const activeSubtitleIndex = useMemo(() => {
        if (!subtitles) return -1;
        return subtitles.findIndex(sub => progress >= sub.startTime && progress < sub.endTime);
    }, [subtitles, progress]);

    const activeSubtitleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeSubtitleRef.current) {
            activeSubtitleRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [activeSubtitleIndex]);

    if (!isExpanded || !currentPodcast) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-[100] bg-background flex flex-col transition-opacity duration-500",
            isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            {/* Atmospheric Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center blur-3xl opacity-40 scale-110 transition-all duration-1000"
                    style={{ backgroundImage: `url(${currentPodcast.imageUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-center p-6 w-full max-w-7xl mx-auto">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-background/20 hover:bg-background/40 backdrop-blur-md text-foreground" 
                    onClick={toggleExpanded}
                >
                    <ChevronDown className="h-6 w-6" />
                </Button>
                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground/80">Now Playing</span>
                <div className="w-10"></div> {/* Spacer for alignment */}
            </div>

            {/* Main Layout */}
            <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-6 pb-8 gap-12 overflow-hidden">
                
                {/* Left Column: Player Visuals & Controls */}
                <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start justify-center gap-8 max-w-md lg:max-w-none">
                    
                    {/* Album Art */}
                    <div className="relative w-full aspect-square max-w-[350px] lg:max-w-[450px] rounded-3xl shadow-2xl overflow-hidden group ring-1 ring-white/10 mx-auto lg:mx-0">
                        <img 
                            src={currentPodcast.imageUrl} 
                            alt={currentPodcast.title} 
                            className={cn(
                                "w-full h-full object-cover transition-transform duration-700 ease-out",
                                isPlaying ? "scale-105" : "scale-100"
                            )} 
                        />
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>

                    {/* Meta & Controls */}
                    <div className="w-full space-y-6">
                        <div className="text-center lg:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-foreground leading-tight">{currentPodcast.title}</h2>
                            <p className="text-lg text-muted-foreground font-medium">{currentPodcast.date} • {currentPodcast.topic ? currentPodcast.topic.replace(/_/g, ' ') : 'Podcast'}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full space-y-2">
                             <div 
                                className="relative w-full h-2 bg-secondary/50 rounded-full cursor-pointer group overflow-hidden" 
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const clickX = e.clientX - rect.left;
                                    seek(duration * (clickX / rect.width));
                                }}
                            >
                                <div 
                                    className="absolute h-full bg-primary rounded-full transition-all duration-100 ease-linear" 
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                <span>{formatTime(progress)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Main Buttons */}
                        <div className="flex items-center justify-center lg:justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-secondary/50 hover:text-primary transition-colors" onClick={() => seek(Math.max(0, progress - 15))}>
                                    <SkipBack className="h-6 w-6" />
                                    <span className="sr-only">Rewind 15s</span>
                                </Button>
                                <Button 
                                    variant="default" 
                                    size="icon" 
                                    className="h-20 w-20 rounded-full shadow-xl bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                                    onClick={togglePlayPause}
                                >
                                    {isPlaying ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current ml-1" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-secondary/50 hover:text-primary transition-colors" onClick={() => seek(Math.min(duration, progress + 15))}>
                                    <SkipForward className="h-6 w-6" />
                                    <span className="sr-only">Skip 15s</span>
                                </Button>
                            </div>
                            
                             {/* Volume (Desktop only typically, but visible here) */}
                            <div className="hidden sm:flex items-center gap-3 bg-secondary/30 backdrop-blur-md rounded-full px-4 py-2">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => setVolume(volume > 0 ? 0 : 1)}>
                                    {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                </Button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-20 h-1 accent-primary bg-white/20 rounded-full appearance-none cursor-pointer hover:accent-primary/80"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Transcript */}
                <div className="w-full lg:w-6/12 h-full flex flex-col relative">
                    <div className="absolute inset-0 bg-card/30 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-sm flex justify-between items-center z-20">
                            <h3 className="text-xl font-bold text-foreground">Transcript</h3>
                            {subtitles && subtitles.length > 0 && (
                                <span className="text-xs font-medium px-2 py-1 bg-primary/20 text-primary rounded-full animate-pulse">Live Sync</span>
                            )}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth relative">
                            {subtitles && subtitles.length > 0 ? (
                                subtitles.map((sub, index) => {
                                    const isActive = index === activeSubtitleIndex;
                                    return (
                                        <div 
                                            key={index} 
                                            ref={isActive ? activeSubtitleRef : null}
                                            className={cn(
                                                "transition-all duration-500 ease-in-out p-4 rounded-2xl border",
                                                isActive 
                                                    ? "bg-primary/10 border-primary/20 shadow-lg scale-100 opacity-100" 
                                                    : "bg-transparent border-transparent opacity-50 hover:opacity-80 scale-95"
                                            )}
                                        >
                                            <p className={cn(
                                                "text-xs font-bold mb-2 uppercase tracking-wider",
                                                isActive ? "text-primary" : "text-muted-foreground"
                                            )}>
                                                {sub.speaker}
                                            </p>
                                            <p className={cn(
                                                "text-lg leading-relaxed",
                                                isActive ? "text-foreground font-medium" : "text-muted-foreground"
                                            )}>
                                                {sub.text}
                                            </p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
                                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                                        <Maximize2 className="h-6 w-6 opacity-50" />
                                    </div>
                                    <p>Transcript not available for this episode.</p>
                                </div>
                            )}
                            {/* Bottom spacer for scrolling */}
                            <div className="h-20"></div>
                        </div>
                        
                        {/* Gradient fade at bottom of transcript */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/80 to-transparent pointer-events-none z-10"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExpandedPlayer;
