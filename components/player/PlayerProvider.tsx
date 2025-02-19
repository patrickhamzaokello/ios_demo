import React, { createContext, useContext, useState } from 'react';
import { PlayerScreen } from './PlayerScreen'; // Import the PlayerScreen component we created earlier
import { View, StyleSheet } from 'react-native';

interface PlayerContextType {
  showPlayer: () => void;
  hidePlayer: () => void;
  isPlayerVisible: boolean;
  currentTrack: any; // Define proper track type
  setCurrentTrack: (track: any) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const showPlayer = () => setIsPlayerVisible(true);
  const hidePlayer = () => setIsPlayerVisible(false);

  return (
    <PlayerContext.Provider 
      value={{ 
        showPlayer, 
        hidePlayer, 
        isPlayerVisible, 
        currentTrack, 
        setCurrentTrack 
      }}
    >
      <View style={styles.container}>
        {children}
        {/* Player is always rendered but visibility is controlled by state */}
        <PlayerScreen />
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
  },
});