import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
  PanResponder,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { usePlayer } from '@/providers/PlayerProvider';
import { Audio } from 'expo-av';
import { Track } from '@/types/playlist';
import playlist from '@/app/(details)/playlist';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MINI_PLAYER_HEIGHT = 64;
const GESTURE_THRESHOLD = SCREEN_HEIGHT / 3;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const PlayerScreen = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [shuffledPlaylist, setShuffledPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { currentTrack, setCurrentTrack } = usePlayer();
  const insets = useSafeAreaInsets();
  const [playerState, setPlayerState] = useState({
    isPlaying: false, // Changed to false initially
    isLiked: false,
    isShuffle: false,
    duration: 0,
    repeatMode: 0, // 0: off, 1: all, 2: one
    progress: 0,
    currentTime: 0,
    volume: 0.8,
    isLyricsVisible: false,
    queueVisible: false,
  });

  // Animation refs
  const translateY = useRef(new Animated.Value(0)).current;
  const lastGesture = useRef(new Date().getTime());
  const animationState = useRef({ isMaximized: false }).current;

  // Fix for flickering: use a ref to track the animation state
  // and prevent duplicate animations
  const isAnimating = useRef(false);

  // Derived animation values
  const miniPlayerOpacity = translateY.interpolate({
    inputRange: [-SCREEN_HEIGHT, -SCREEN_HEIGHT / 2, 0],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const fullPlayerOpacity = translateY.interpolate({
    inputRange: [-SCREEN_HEIGHT, -SCREEN_HEIGHT / 2, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const artworkScale = translateY.interpolate({
    inputRange: [-SCREEN_HEIGHT, -SCREEN_HEIGHT + 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  // Gesture Handler
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const now = new Date().getTime();
      const timeDiff = now - lastGesture.current;
      lastGesture.current = now;

      return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
        timeDiff > 200;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(-SCREEN_HEIGHT + gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > GESTURE_THRESHOLD) {
        minimizePlayer();
      } else {
        maximizePlayer();
      }
    },
  })).current;

  // Animation controls
  const minimizePlayer = () => {
    if (isAnimating.current) return;
    
    isAnimating.current = true;
    animationState.isMaximized = false;
    
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      mass: 0.8,
    }).start(() => {
      isAnimating.current = false;
    });
  };

  const maximizePlayer = () => {
    if (isAnimating.current) return;
    
    isAnimating.current = true;
    animationState.isMaximized = true;
    
    Animated.spring(translateY, {
      toValue: -SCREEN_HEIGHT,
      useNativeDriver: true,
      damping: 20,
      mass: 0.8,
    }).start(() => {
      isAnimating.current = false;
    });
  };

  const handleSeek = useCallback(async (value) => {
    if (sound) {
      const position = value * playerState.duration * 1000;
      await sound.setPositionAsync(position);
      setPlayerState((prev) => ({
        ...prev,
        progress: value,
        currentTime: value * playerState.duration,
      }));
    }
  }, [sound, playerState.duration]);


  // Set up audio session at component mount
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Enable audio playback in silent mode (iOS)
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          allowsRecordingIOS: false,
        });
        console.log('Audio mode set successfully');
      } catch (error) {
        console.error('Error setting audio mode:', error);
      }
    };

    setupAudio();
  }, []);

  // Handlers
  const togglePlayPause = useCallback(async () => {
    if (sound) {
      if (playerState.isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setPlayerState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  }, [sound, playerState.isPlaying]);

  const toggleLike = () => {
    setPlayerState(prev => ({ ...prev, isLiked: !prev.isLiked }));
  };

  const toggleRepeatMode = async () => {
    const newRepeatMode = (playerState.repeatMode + 1) % 3;
    setPlayerState(prev => ({ ...prev, repeatMode: newRepeatMode }));

    if (sound) {
      await sound.setIsLoopingAsync(newRepeatMode === 2); // Loop if repeatMode is 2 (repeat one)
    }
  };

  const shufflePlaylist = (playlist: Track[]) => {
    const shuffled = [...playlist];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const toggleShuffle = () => {
    const newShuffleState = !playerState.isShuffle;
    setPlayerState(prev => ({ ...prev, isShuffle: newShuffleState }));
  
    if (newShuffleState) {
      // Shuffle the playlist
      const shuffled = shufflePlaylist(playlist); // Assuming `playlist` is your original playlist
      setShuffledPlaylist(shuffled);
  
      // Find the index of the current track in the shuffled playlist
      const currentIndex = shuffled.findIndex(track => track.id === currentTrack.id);
      setCurrentTrackIndex(currentIndex);
    } else {
      // Revert to the original playlist
      setShuffledPlaylist([]);
  
      // Find the index of the current track in the original playlist
      const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
      setCurrentTrackIndex(currentIndex);
    }
  };

  const playNextTrack = async () => {
    if (playerState.isShuffle && shuffledPlaylist.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % shuffledPlaylist.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(shuffledPlaylist[nextIndex]);
    } else {
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(playlist[nextIndex]);
    }
  };
  
  const playPreviousTrack = async () => {
    if (playerState.isShuffle && shuffledPlaylist.length > 0) {
      const prevIndex = (currentTrackIndex - 1 + shuffledPlaylist.length) % shuffledPlaylist.length;
      setCurrentTrackIndex(prevIndex);
      setCurrentTrack(shuffledPlaylist[prevIndex]);
    } else {
      const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      setCurrentTrackIndex(prevIndex);
      setCurrentTrack(playlist[prevIndex]);
    }
  };

  // Handle track changes and loading
  useEffect(() => {
    if (!currentTrack) return;
  
    const playCurrentTrack = async () => {
      try {
        setIsLoading(true);
        
        if (sound) {
          await sound.unloadAsync(); // Unload previous sound
        }
  
        console.log('Loading audio:', currentTrack.path);
        
        // Create the sound object
        const { sound: newSound, status } = await Audio.Sound.createAsync(
          { uri: currentTrack.path },
          { 
            shouldPlay: true,
            progressUpdateIntervalMillis: 500, // Update progress every 500ms
            positionMillis: 0,
            volume: playerState.volume,
          },
          (status) => {
            // This is the status update callback
            if (status.isLoaded) {
              setPlayerState((prev) => ({
                ...prev,
                progress: status.positionMillis / status.durationMillis,
                currentTime: status.positionMillis / 1000,
                isPlaying: status.isPlaying,
              }));
            }
            
            // Handle playback finished
            if (status.didJustFinish && !status.isLooping) {
              // Play next track based on repeat mode
              if (playerState.repeatMode === 1) { // repeat all
                playNextTrack();
              } else if (playerState.repeatMode === 0 && 
                ((playerState.isShuffle && currentTrackIndex < shuffledPlaylist.length - 1) || 
                (!playerState.isShuffle && currentTrackIndex < playlist.length - 1))) {
                // Only play next if not on last track and repeat is off
                playNextTrack();
              }
            }
          }
        );
  
        console.log('Audio loaded with status:', status);
  
        if (status.isLoaded) {
          const durationInSeconds = status.durationMillis / 1000; // Convert milliseconds to seconds
          console.log('Audio duration:', durationInSeconds);
  
          // Update the state with the duration and indicate that we're playing
          setPlayerState((prev) => ({
            ...prev,
            duration: durationInSeconds,
            isPlaying: true,
            currentTime: 0,
            progress: 0,
          }));
        }
  
        setSound(newSound);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading or playing audio:', error);
        setIsLoading(false);
        // Reset playing state on error
        setPlayerState(prev => ({
          ...prev,
          isPlaying: false
        }));
      }
    };
  
    playCurrentTrack();
  
    return () => {
      if (sound) {
        console.log('unloading sound');
        sound.unloadAsync(); // Cleanup on unmount
      }
    };
  }, [currentTrack]);

  if (!currentTrack) {
    return null;
  }

  // Mini Player Component
  const MiniPlayer = React.memo(() => (
    <Animated.View style={[styles.miniPlayer, { opacity: miniPlayerOpacity }]}>
      <BlurView intensity={80} tint="dark" style={styles.miniPlayerContent}>
        <TouchableOpacity
          onPress={maximizePlayer}
          style={styles.miniPlayerLeft}
          activeOpacity={0.7}
        >
          <Animated.Image
            source={{ uri: currentTrack.artworkPath }}
            style={[styles.miniPlayerArtwork]}
          />
          <View style={styles.miniPlayerInfo}>
            <Text style={styles.miniPlayerTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.miniPlayerArtist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.miniPlayerControls}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FF2D55" />
          ) : (
            <TouchableOpacity
              onPress={togglePlayPause}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={playerState.isPlaying ? "pause-circle" : "play-circle"}
                size={32}
                color="#FF2D55"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.miniPlayerNext}
            onPress={playNextTrack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="play-skip-forward" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </BlurView>
      <View style={styles.miniProgressBar}>
        <Animated.View
          style={[
            styles.miniProgressIndicator,
            { width: `${playerState.progress * 100}%` }
          ]}
        />
      </View>
    </Animated.View>
  ));

  // Main Player Component
  const MainPlayer = React.memo(() => (
    <Animated.View
      style={[
        styles.fullPlayer,
        {
          opacity: fullPlayerOpacity,
          transform: [{ translateY }],
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }
      ]}
      {...panResponder.panHandlers}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={minimizePlayer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-down" size={28} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerMiddle}>
            <Text style={styles.headerTitle}>Playing from</Text>
            <Text style={styles.headerSubtitle}>{currentTrack.album}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setPlayerState(prev => ({
              ...prev,
              queueVisible: !prev.queueVisible
            }))}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="list" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Artwork */}
        <Animated.View
          style={[
            styles.artworkContainer,
            { transform: [{ scale: artworkScale }] }
          ]}
        >
          <Image
            source={{ uri: currentTrack.artworkPath }}
            style={styles.artwork}
          />
          
          {/* Loading indicator over artwork when loading */}
          {isLoading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color="#FF2D55" />
            </View>
          )}
        </Animated.View>

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <View style={styles.titleContainer}>
            <View style={styles.titleText}>
              <Text style={styles.title} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
            <TouchableOpacity
              onPress={toggleLike}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={playerState.isLiked ? "heart" : "heart-outline"}
                size={24}
                color={playerState.isLiked ? "#FF2D55" : "#FFF"}
              />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Slider
              style={styles.progressBar}
              value={playerState.progress}
              onSlidingComplete={handleSeek}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="white"
              maximumTrackTintColor="grey"
              thumbTintColor="white"
              disabled={isLoading}
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatTime(playerState.currentTime)}
              </Text>
              <Text style={styles.timeText}>
                {formatTime(playerState.duration)}
              </Text>
            </View>
          </View>

          {/* Main Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={toggleShuffle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              disabled={isLoading}
            >
              <Ionicons
                name="shuffle"
                size={24}
                color={playerState.isShuffle ? "#FF2D55" : "#FFF"}
                style={isLoading ? styles.disabledControl : {}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={playPreviousTrack}
              disabled={isLoading}
            >
              <Ionicons 
                name="play-skip-back" 
                size={35} 
                color="#FFF" 
                style={isLoading ? styles.disabledControl : {}}
              />
            </TouchableOpacity>

            {isLoading ? (
              <View style={styles.playButton}>
                <ActivityIndicator size="large" color="#FFF" />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.playButton}
                onPress={togglePlayPause}
              >
                <Ionicons
                  name={playerState.isPlaying ? "pause" : "play"}
                  size={40}
                  color="#FFF"
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={playNextTrack}
              disabled={isLoading}
            >
              <Ionicons 
                name="play-skip-forward" 
                size={35} 
                color="#FFF" 
                style={isLoading ? styles.disabledControl : {}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleRepeatMode}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              disabled={isLoading}
            >
              <Ionicons
                name={playerState.repeatMode === 2 ? "repeat-one" : "repeat"}
                size={24}
                color={playerState.repeatMode > 0 ? "#FF2D55" : "#FFF"}
                style={isLoading ? styles.disabledControl : {}}
              />
            </TouchableOpacity>
          </View>



          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => setPlayerState(prev => ({
                ...prev,
                isLyricsVisible: !prev.isLyricsVisible
              }))}
              disabled={isLoading}
            >
              <Ionicons 
                name="text" 
                size={22} 
                color="#FFF" 
                style={isLoading ? styles.disabledControl : {}}
              />
              <Text style={styles.bottomButtonText}>Lyrics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => {/* Handle AirPlay */ }}
              disabled={isLoading}
            >
              <Ionicons
                name="map" // Use "cast" for both iOS and Android
                size={22}
                color="#FFF"
                style={isLoading ? styles.disabledControl : {}}
              />
              <Text style={styles.bottomButtonText}>
                {Platform.OS === 'ios' ? 'AirPlay' : 'Cast'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => {/* Handle Queue */ }}
              disabled={isLoading}
            >
              <Ionicons 
                name="list" 
                size={22} 
                color="#FFF" 
                style={isLoading ? styles.disabledControl : {}}
              />
              <Text style={styles.bottomButtonText}>Queue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  ));

  return (
    <>
      <MiniPlayer />
      <MainPlayer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 84,
    width: SCREEN_WIDTH - 16,
    height: MINI_PLAYER_HEIGHT,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
  },
  miniPlayerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  miniPlayerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniPlayerArtwork: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  miniPlayerInfo: {
    flex: 1,
    marginRight: 12,
  },
  miniPlayerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  miniPlayerArtist: {
    color: '#999',
    fontSize: 14,
    marginTop: 2,
  },
  miniPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniProgressIndicator: {
    height: 2,
    backgroundColor: '#FF2D55', // More visible progress indicator
    width: '0%', // Default width, will be dynamically updated
  },
  miniProgressBar: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  miniPlayerNext: {
    marginLeft: 16,
  },
  fullPlayer: {
    position: 'absolute',
    top: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bottomButtonText: {
    color: colors.neutral600,
    fontSize: 12,
    marginTop: 4,
  },
  headerMiddle: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#999',
    fontSize: 12,
  },
  headerSubtitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  artworkContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
    position: 'relative', // For loading overlay
  },
  artwork: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 24, // Match the padding of the container
    right: 24, // Match the padding of the container
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
  },
  trackInfo: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  artist: {
    color: '#999',
    fontSize: 18,
  },
  progressContainer: {
    marginVertical: 16,
  },
  volumeSlider: {
    width: '100%',
    height: 40,
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -12,
  },
  timeText: {
    color: '#999',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF2D55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 'auto',
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
  },
  disabledControl: {
    opacity: 0.5,
  },
});

export default PlayerScreen;