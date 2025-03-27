import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';
import { usePlayer } from '@/providers/PlayerProvider';
import { Track } from '@/types/playlist';
import ScreenWrapper from '../ScreenWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import ColorThief from '../../node_modules/colorthief/dist/color-thief.mjs'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINI_PLAYER_HEIGHT = 64;
const GESTURE_THRESHOLD = SCREEN_HEIGHT / 3;

// Helper components
const TimeDisplay = memo(({ time }: { time: number }) => (
  <Text style={styles.timeText}>{formatTime(time)}</Text>
));

// Format time helper
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ControlButton = memo(({
  icon,
  onPress,
  active = false,
  disabled = false,
  size = 24,
}: {
  icon: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  size?: number;
}) => (
  <TouchableOpacity
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    disabled={disabled}
  >
    <Ionicons
      name={icon as any}
      size={size}
      color={active ? colors.primary : colors.white}
      style={disabled ? styles.disabledControl : {}}
    />
  </TouchableOpacity>
));

// Main component
const PlayerScreen = () => {
  const { currentTrack, setCurrentTrack, playlist } = usePlayer();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    isLiked: false,
    isShuffle: false,
    duration: 0,
    repeatMode: 0, // 0: off, 1: all, 2: one
    progress: 0,
    currentTime: 0,
    isFullscreen: false,
  });
  

  const [backgroundColors, setBackgroundColors] = useState<readonly [string, string, ...string[]]>(['#333333', '#000000']);

  const extractDominantColors = async (imageUri: string) => {
    try {
      // Create an Image object to work with ColorThief
      const image = new window.Image();
      image.src = imageUri;

      image.onload = () => {
        const colorThief = new ColorThief();

        // Extract the dominant color and color palette
        const dominantColor = colorThief.getColor(image);
        const palette = colorThief.getPalette(image, 5);

        // Convert RGB colors to hex
        const dominantHex = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);
        const paletteHex: string[] = palette.map((color: [number, number, number]) => rgbToHex(...color));

        // Create gradient colors based on the dominant color
        const gradientColors: [string, string] = [
          darkenColor(dominantHex, 0.2),  // Darker variant
          darkenColor(dominantHex, 0.5)   // Even darker variant
        ];

        setBackgroundColors(gradientColors);
      };
    } catch (error) {
      console.error('Error extracting colors:', error);
    }
  };

  // Utility function to convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Utility function to darken a hex color
  interface DarkenColor {
    (hex: string, factor: number): string;
  }

  const darkenColor: DarkenColor = (hex, factor) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return rgbToHex(
      Math.max(0, Math.round(r * (1 - factor))),
      Math.max(0, Math.round(g * (1 - factor))),
      Math.max(0, Math.round(b * (1 - factor)))
    );
  };

  const toggleFullscreen = useCallback((show: boolean) => {
    if (show) {
      translationY.value = withSpring(-SCREEN_HEIGHT, { damping: 20 });
    } else {
      translationY.value = withSpring(0, { damping: 20 });
    }
    setPlayerState(prev => ({ ...prev, isFullscreen: show }));
  }, []);

  // Reanimated values
  const translationY = useSharedValue(0);
  const isInteracting = useSharedValue(false);

  // Derived values
  const currentTrackIndex = playlist.findIndex(track => track.id === currentTrack?.id);

  // Audio management
  const loadSound = useCallback(async () => {
    if (!currentTrack) return;

    try {
      setIsLoading(true);

      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentTrack.path },
        { shouldPlay: true, progressUpdateIntervalMillis: 500 },
        (status) => {
          if (status.isLoaded) {
            setPlayerState(prev => ({
              ...prev,
              progress: status.durationMillis ? status.positionMillis / status.durationMillis : 0,
              currentTime: status.positionMillis / 1000,
              isPlaying: status.isPlaying,
              duration: status.durationMillis ? status.durationMillis / 1000 : 0,
            }));

            if (status.didJustFinish) {
              handleTrackEnd();
            }
          }
        }
      );

      setSound(newSound);
    } catch (error) {
      console.error('Failed to load sound', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentTrack]);

  const handleTrackEnd = useCallback(() => {
    if (playerState.repeatMode === 2) {
      sound?.replayAsync();
    } else {
      playNextTrack();
    }
  }, [playerState.repeatMode, sound]);

  const togglePlayPause = useCallback(async () => {
    if (!sound) return;

    if (playerState.isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }

    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [sound, playerState.isPlaying]);

  const playNextTrack = useCallback(() => {
    console.log('playNextTrack', playlist.length, currentTrackIndex);
    if (!playlist.length) return;

    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
  }, [currentTrackIndex, playlist]);

  const playPreviousTrack = useCallback(() => {
    if (!playlist.length) return;

    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrack(playlist[prevIndex]);
  }, [currentTrackIndex, playlist]);

  const handleSeek = useCallback(async (value: number) => {
    if (!sound) return;

    const position = value * playerState.duration * 1000;
    await sound.setPositionAsync(position);
  }, [sound, playerState.duration]);

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isShuffle: !prev.isShuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    const nextMode = (playerState.repeatMode + 1) % 3;
    setPlayerState(prev => ({ ...prev, repeatMode: nextMode }));

    if (sound) {
      sound.setIsLoopingAsync(nextMode === 2);
    }
  }, [playerState.repeatMode, sound]);

  // Gesture handlers
  const panGesture = Gesture.Pan()
    .onStart(() => {
      isInteracting.value = true;
    })
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translationY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > GESTURE_THRESHOLD) {
        runOnJS(toggleFullscreen)(false);
      } else {
        runOnJS(toggleFullscreen)(true);
      }
      isInteracting.value = false;
    });

  // Animation styles
  const fullPlayerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(playerState.isFullscreen ? 0 : SCREEN_HEIGHT) }],
    opacity: playerState.isFullscreen ? 1 : 0,
  }));

  const miniPlayerStyle = useAnimatedStyle(() => ({
    opacity: playerState.isFullscreen ? 0 : 1,
    transform: [{ translateY: playerState.isFullscreen ? 20 : 0 }],
  }));

  // Effects
  useEffect(() => {
    loadSound();

    return () => {
      sound?.unloadAsync();
    };
  }, [currentTrack]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
  }, []);

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      {/* Mini Player */}
      <Animated.View style={[styles.miniPlayerContainer, miniPlayerStyle]}>
        <MiniPlayer
          track={currentTrack}
          isPlaying={playerState.isPlaying}
          progress={playerState.progress}
          isLoading={isLoading}
          onPress={() => toggleFullscreen(true)}
          onPlayPause={togglePlayPause}
          onNext={playNextTrack}
        />
      </Animated.View>

      {/* Full Player */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.fullPlayerContainer, fullPlayerStyle]}>
          <FullPlayer
            track={currentTrack}
            playerState={playerState}
            isLoading={isLoading}
            onSeek={handleSeek}
            onPlayPause={togglePlayPause}
            onNext={playNextTrack}
            onPrevious={playPreviousTrack}
            onShuffle={toggleShuffle}
            onRepeat={toggleRepeat}
            backgroundColors={backgroundColors}
            onMinimize={() => setPlayerState(prev => ({ ...prev, isFullscreen: false }))}
          />
        </Animated.View>
      </GestureDetector>
    </>
  );
};

// Mini Player Component
const MiniPlayer = memo(({
  track,
  isPlaying,
  progress,
  isLoading,
  onPress,
  onPlayPause,
  onNext,
}: {
  track: Track;
  isPlaying: boolean;
  progress: number;
  isLoading: boolean;
  onPress: () => void;
  onPlayPause: () => void;
  onNext: () => void;
}) => (
  <BlurView intensity={80} tint="dark" style={styles.miniPlayer}>
    <TouchableOpacity onPress={onPress} style={styles.miniPlayerContent}>
      <Image source={{ uri: track.artworkPath }} style={styles.miniPlayerArtwork} />
      <View style={styles.miniPlayerInfo}>
        <Text style={styles.miniPlayerTitle} numberOfLines={1}>{track.title}</Text>
        <Text style={styles.miniPlayerArtist} numberOfLines={1}>{track.artist}</Text>
      </View>
    </TouchableOpacity>

    <View style={styles.miniPlayerControls}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <>
          <ControlButton
            icon={isPlaying ? 'pause' : 'play'}
            onPress={onPlayPause}
            size={28}
          />
          <ControlButton icon="play-skip-forward" onPress={onNext} />
        </>
      )}
    </View>

    <View style={styles.miniProgressBar}>
      <View style={[styles.miniProgressIndicator, { width: `${progress * 100}%` }]} />
    </View>
  </BlurView>
));

// Full Player Component
const FullPlayer = memo(({
  track,
  playerState,
  isLoading,
  onSeek,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffle,
  onRepeat,
  backgroundColors,
  onMinimize,
}: {
  track: Track;
  playerState: {
    isPlaying: boolean;
    isShuffle: boolean;
    repeatMode: number;
    progress: number;
    isLiked: boolean;
    currentTime: number;
    duration: number;
  };
  isLoading: boolean;
  backgroundColors: readonly [string, string, ...string[]];
  onSeek: (value: number) => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  onMinimize: () => void;
}) => (
  <ScreenWrapper style={styles.fullPlayer}>

    <LinearGradient colors={backgroundColors} style={styles.lineargradientContainer}>
      {/* Header */}
      <View style={styles.header}>
        <ControlButton icon="chevron-down" onPress={onMinimize} />
        <View style={styles.headerMiddle}>
          <Text style={styles.headerSubtitle}>Now Playing</Text>
        </View>
        <ControlButton icon="ellipsis-horizontal" onPress={() => { }} />
      </View>

      {/* Artwork */}
      <View style={styles.artworkContainer}>
        <Image source={{ uri: track.artworkPath }} style={styles.artwork} />
        {isLoading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <View style={styles.titleContainer}>
          <View style={styles.titleText}>
            <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
          </View>
          <ControlButton
            icon={playerState.isLiked ? 'heart' : 'heart-outline'}
            onPress={() => { }}
            active={playerState.isLiked}
          />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Slider
            value={playerState.progress}
            onSlidingComplete={onSeek}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={colors.white}
            maximumTrackTintColor={colors.green}
            thumbTintColor={colors.white}
            disabled={isLoading}
          />
          <View style={styles.timeContainer}>
            <TimeDisplay time={playerState.currentTime} />
            <TimeDisplay time={playerState.duration} />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <ControlButton
            icon="shuffle"
            onPress={onShuffle}
            active={playerState.isShuffle}
            disabled={isLoading}
          />
          <ControlButton
            icon="play-skip-back"
            onPress={onPrevious}
            disabled={isLoading}
            size={32}
          />
          <TouchableOpacity
            style={styles.playButton}
            onPress={onPlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Ionicons
                name={playerState.isPlaying ? 'pause' : 'play'}
                size={36}
                color={colors.white}
              />
            )}
          </TouchableOpacity>
          <ControlButton
            icon="play-skip-forward"
            onPress={onNext}
            disabled={isLoading}
            size={32}
          />
          <ControlButton
            icon={playerState.repeatMode === 2 ? 'repeat-one' : 'repeat'}
            onPress={onRepeat}
            active={playerState.repeatMode > 0}
            disabled={isLoading}
          />
        </View>
      </View>
    </LinearGradient>
  </ScreenWrapper>

));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 80,
    left: 8,
    right: 8,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 1000,
  },
  miniPlayer: {
    width: '100%',
    height: MINI_PLAYER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  fullPlayerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
    zIndex: 999,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledControl: {
    opacity: 0.5,
  },
  miniPlayerContent: {
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
  },
  miniPlayerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  miniPlayerArtist: {
    color: colors.green,
    fontSize: 14,
    marginTop: 2,
  },
  miniPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  miniProgressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  miniProgressIndicator: {
    height: 2,
    backgroundColor: colors.primary,
  },
  lineargradientContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    top: 0,
    left: 0,
    opacity: 0.8  // Slightly transparent for depth
  },
  fullPlayer: {
    flex: 1,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerMiddle: {
    alignItems: 'center',
  },
  headerSubtitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  artworkContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
    position: 'relative',
  },
  artwork: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
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
    color: colors.white,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  artist: {
    color: colors.green,
    fontSize: 18,
  },
  progressContainer: {
    marginVertical: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -12,
  },
  timeText: {
    color: colors.green,
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
});

export default PlayerScreen;