import React, { createContext, PropsWithChildren, useContext, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import PlayerScreen from '../app/player';
import { Track } from '@/types/playlist';
// import { Track } from '../types'; // Define your Track type

interface PlayerContextType {
  showPlayer: () => void;
  hidePlayer: () => void;
  isPlayerVisible: boolean;
  currentTrack: Track | null;
  setCurrentTrack: (track: Track) => void;
  playTrack: (track: Track) => void;
  playlist: Track[];
  addToQueue: (tracks: Track | Track[]) => void;
  clearQueue: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: PropsWithChildren) {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);

  const showPlayer = useCallback((track?: Track) => {
    if (track) setCurrentTrack(track);
    setIsPlayerVisible(true);
  }, []);
  
  const hidePlayer = useCallback(() => {
    setIsPlayerVisible(false);
    // Optionally pause playback when hiding
    // sound?.pauseAsync();
  }, []);
  
  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    showPlayer();
  }, [showPlayer]);

  const addToQueue = useCallback((tracks: Track | Track[]) => {
    setPlaylist(prev => [
      ...prev,
      ...(Array.isArray(tracks) ? tracks : [tracks])
    ]);
  }, []);

  const clearQueue = useCallback(() => {
    setPlaylist([]);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        showPlayer,
        hidePlayer,
        isPlayerVisible,
        currentTrack,
        setCurrentTrack,
        playTrack,
        playlist,
        addToQueue,
        clearQueue
      }}
    >
      <View style={styles.container}>
        {children}
        {isPlayerVisible && <PlayerScreen />}
      </View>
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

