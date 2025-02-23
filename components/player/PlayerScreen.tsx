import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINI_PLAYER_HEIGHT = 64;
const GESTURE_THRESHOLD = SCREEN_HEIGHT / 3;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const PlayerScreen = ({
  currentTrack = {
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    artwork: 'https://via.placeholder.com/400',
    duration: 225, // 3:45 in seconds
  }
}) => {
  const insets = useSafeAreaInsets();
  const [playerState, setPlayerState] = useState({
    isPlaying: true,
    isLiked: false,
    isShuffle: false,
    repeatMode: 0, // 0: off, 1: all, 2: one
    progress: 0.3,
    currentTime: 67, // 1:07 in seconds
    volume: 0.8,
    isLyricsVisible: false,
    queueVisible: false,
  });

  // Animation refs
  const translateY = useRef(new Animated.Value(0)).current;
  const lastGesture = useRef(new Date().getTime());

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
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      mass: 0.8,
    }).start();
  };

  const maximizePlayer = () => {
    Animated.spring(translateY, {
      toValue: -SCREEN_HEIGHT,
      useNativeDriver: true,
      damping: 20,
      mass: 0.8,
    }).start();
  };

  // Handlers
  const togglePlayPause = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const toggleLike = () => {
    setPlayerState(prev => ({ ...prev, isLiked: !prev.isLiked }));
  };

  const toggleRepeatMode = () => {
    setPlayerState(prev => ({
      ...prev,
      repeatMode: (prev.repeatMode + 1) % 3
    }));
  };

  const toggleShuffle = () => {
    setPlayerState(prev => ({ ...prev, isShuffle: !prev.isShuffle }));
  };

  // Mini Player Component
  const MiniPlayer = () => (
    <Animated.View style={[styles.miniPlayer, { opacity: miniPlayerOpacity }]}>
      <BlurView intensity={80} tint="dark" style={styles.miniPlayerContent}>
        <TouchableOpacity
          onPress={maximizePlayer}
          style={styles.miniPlayerLeft}
          activeOpacity={0.7}
        >
          <Animated.Image
            source={{ uri: currentTrack.artwork }}
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
          <TouchableOpacity
            style={styles.miniPlayerNext}
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
  );

  // Main Player Component
  const MainPlayer = () => (
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
            source={{ uri: currentTrack.artwork }}
            style={styles.artwork}
          />
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
              onValueChange={(value) => setPlayerState(prev => ({
                ...prev,
                progress: value,
                currentTime: value * currentTrack.duration
              }))}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FF2D55"
              maximumTrackTintColor="#4D4D4D"
              thumbTintColor="#FF2D55"
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatTime(playerState.currentTime)}
              </Text>
              <Text style={styles.timeText}>
                {formatTime(currentTrack.duration)}
              </Text>
            </View>
          </View>

          {/* Main Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={toggleShuffle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="shuffle"
                size={24}
                color={playerState.isShuffle ? "#FF2D55" : "#FFF"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="play-skip-back" size={35} color="#FFF" />
            </TouchableOpacity>

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

            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="play-skip-forward" size={35} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleRepeatMode}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={playerState.repeatMode === 2 ? "repeat-one" : "repeat"}
                size={24}
                color={playerState.repeatMode > 0 ? "#FF2D55" : "#FFF"}
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
            >
              <Ionicons name="text" size={22} color="#FFF" />
              <Text style={styles.bottomButtonText}>Lyrics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => {/* Handle AirPlay */ }}
            >
              <Ionicons
                name={Platform.OS === 'ios' ? "airplay" : "cast"}
                size={22}
                color="#FFF"
              />
              <Text style={styles.bottomButtonText}>
                {Platform.OS === 'ios' ? 'AirPlay' : 'Cast'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => {/* Handle Queue */ }}
            >
              <Ionicons name="list" size={22} color="#FFF" />
              <Text style={styles.bottomButtonText}>Queue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );

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

  miniProgressIndicator: {},
  miniProgressBar: {
    height: 2,
    backgroundColor: 'rgba(255, 45, 85, 0.5)',
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
  },
  artwork: {
    width: '100%',
    aspectRatio: 1,
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
});

export default PlayerScreen;