
import React, { createContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { Podcast } from '../types';

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
  const audioRef = useRef<HTMLAudioElement>(null);

  // This effect is the single source of truth for imperatively controlling the audio element.
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // play() returns a promise which should be handled.
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback failed", error);
            // If playback fails (e.g., autoplay blocked, invalid source),
            // reset the state to reflect that it's not playing.
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentPodcast]); // Re-run when play state or podcast changes.

  const playPodcast = useCallback((podcast: Podcast) => {
    if (currentPodcast?.id !== podcast.id) {
        setCurrentPodcast(podcast);
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

  return (
    <PlayerContext.Provider value={{ currentPodcast, isPlaying, progress, duration, playPodcast, togglePlayPause, seek, setVolume, volume }}>
      {children}
      {currentPodcast && (
        <audio 
          ref={audioRef} 
          src={currentPodcast.audioUrl} 
          // The key forces the element to re-mount when the src changes, ensuring a clean state.
          key={currentPodcast.audioUrl}
          preload="auto" 
          // Declaratively handle events instead of a faulty useEffect for listeners.
          onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
          onTimeUpdate={() => audioRef.current && setProgress(audioRef.current.currentTime)}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </PlayerContext.Provider>
  );
};
