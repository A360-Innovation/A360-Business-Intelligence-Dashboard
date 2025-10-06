

import React, { createContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { Podcast, Subtitle } from '../types';

interface PlayerContextType {
  currentPodcast: Podcast | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playPodcast: (podcast: Podcast) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  volume: number;
  isExpanded: boolean;
  toggleExpanded: () => void;
  subtitles: Subtitle[];
}

export const PlayerContext = createContext<PlayerContextType>({
  currentPodcast: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  playPodcast: () => {},
  togglePlayPause: () => {},
  seek: () => {},
  setVolume: () => {},
  volume: 1,
  isExpanded: false,
  toggleExpanded: () => {},
  subtitles: [],
});

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback failed", error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentPodcast]);

  const playPodcast = useCallback(async (podcast: Podcast) => {
    if (currentPodcast?.id !== podcast.id) {
        setCurrentPodcast(podcast);
        setSubtitles([]); 
        
        try {
            const response = await fetch(`https://chat-stream-production.up.railway.app/podcast/${podcast.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch podcast details');
            }
            const detailedData = await response.json();
            
            const rawSubtitles = detailedData.subtitles || [];
            const totalDuration = (detailedData.file_size * 8) / 128000;
            
            if (rawSubtitles.length > 0 && totalDuration > 0) {
                const totalChars = rawSubtitles.reduce((acc: number, sub: { text: string }) => acc + sub.text.length, 0);
                if (totalChars > 0) {
                  let accumulatedTime = 0;
                  const calculatedSubtitles: Subtitle[] = rawSubtitles.map((sub: { text: string; speaker: string }) => {
                      const durationForSubtitle = (sub.text.length / totalChars) * totalDuration;
                      const startTime = accumulatedTime;
                      const endTime = accumulatedTime + durationForSubtitle;
                      accumulatedTime = endTime;
                      return { ...sub, startTime, endTime };
                  });
                  setSubtitles(calculatedSubtitles);
                }
            }
        } catch (error) {
            console.error("Error fetching subtitles:", error);
            setSubtitles([]);
        }
    }
    setIsPlaying(true);
  }, [currentPodcast]);

  const togglePlayPause = useCallback(() => {
    if (!currentPodcast) return;
    setIsPlaying(prev => !prev);
  }, [currentPodcast]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);
  
  const setVolume = useCallback((vol: number) => {
    if (audioRef.current) {
        audioRef.current.volume = vol;
        setVolumeState(vol);
    }
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);


  return (
    <PlayerContext.Provider value={{ currentPodcast, isPlaying, progress, duration, playPodcast, togglePlayPause, seek, setVolume, volume, isExpanded, toggleExpanded, subtitles }}>
      {children}
      {currentPodcast && (
        <audio 
          ref={audioRef} 
          src={currentPodcast.audioUrl} 
          key={currentPodcast.audioUrl}
          preload="auto" 
          onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
          onTimeUpdate={() => audioRef.current && setProgress(audioRef.current.currentTime)}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </PlayerContext.Provider>
  );
};