import React, { useState } from 'react';
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
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MINI_PLAYER_HEIGHT = 64;

export const PlayerScreen = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
  const [progress, setProgress] = useState(0.3);
  
  // Animation values
  const translateY = new Animated.Value(0);
  const miniPlayerOpacity = translateY.interpolate({
    inputRange: [-SCREEN_HEIGHT, -SCREEN_HEIGHT/2, 0],
    outputRange: [0, 0.5, 1],
  });
  
  const fullPlayerOpacity = translateY.interpolate({
    inputRange: [-SCREEN_HEIGHT, -SCREEN_HEIGHT/2, 0],
    outputRange: [1, 0.5, 0],
  });

  // PanResponder setup for drag gesture
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) { // Dragging down
        translateY.setValue(-SCREEN_HEIGHT + gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > SCREEN_HEIGHT / 4) {
        // Close player
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      } else {
        // Keep player open
        Animated.spring(translateY, {
          toValue: -SCREEN_HEIGHT,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const openFullPlayer = () => {
    Animated.spring(translateY, {
      toValue: -SCREEN_HEIGHT,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      {/* Mini Player */}
      <Animated.View 
        style={[
          styles.miniPlayer,
          { opacity: miniPlayerOpacity, transform: [{ translateY }] }
        ]}
      >
        <BlurView intensity={80} tint="dark" style={styles.miniPlayerContent}>
          <TouchableOpacity onPress={openFullPlayer} style={styles.miniPlayerLeft}>
            <Image
              source={{ uri: 'https://via.placeholder.com/400' }}
              style={styles.miniPlayerArtwork}
            />
            <View style={styles.miniPlayerInfo}>
              <Text style={styles.miniPlayerTitle}>Anti-Hero</Text>
              <Text style={styles.miniPlayerArtist}>Taylor Swift</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.miniPlayerControls}>
            <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
              <Ionicons 
                name={isPlaying ? "pause-circle" : "play-circle"} 
                size={32} 
                color="#FF2D55"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.miniPlayerNext}>
              <Ionicons name="play-skip-forward" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>

      {/* Full Screen Player */}
      <Animated.View 
        style={[
          styles.fullPlayer,
          { opacity: fullPlayerOpacity, transform: [{ translateY }] }
        ]}
        {...panResponder.panHandlers}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons name="chevron-down" size={28} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerMiddle}>
              <Text style={styles.headerTitle}>Playing from</Text>
              <Text style={styles.headerSubtitle}>Midnights</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Album Artwork */}
          <View style={styles.artworkContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/400' }}
              style={styles.artwork}
            />
          </View>

          {/* Track Info */}
          <View style={styles.trackInfo}>
            <View style={styles.titleContainer}>
              <View style={styles.titleText}>
                <Text style={styles.title}>Anti-Hero</Text>
                <Text style={styles.artist}>Taylor Swift</Text>
              </View>
              <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isLiked ? "#FF2D55" : "#FFF"} 
                />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Slider
                style={styles.progressBar}
                value={progress}
                onValueChange={setProgress}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FF2D55"
                maximumTrackTintColor="#4D4D4D"
                thumbTintColor="#FF2D55"
              />
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>1:23</Text>
                <Text style={styles.timeText}>3:45</Text>
              </View>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity onPress={() => setIsShuffle(!isShuffle)}>
                <Ionicons 
                  name="shuffle" 
                  size={24} 
                  color={isShuffle ? "#FF2D55" : "#FFF"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Ionicons name="play-skip-back" size={35} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.playButton}
                onPress={() => setIsPlaying(!isPlaying)}
              >
                <Ionicons 
                  name={isPlaying ? "pause" : "play"} 
                  size={40} 
                  color="#FFF" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Ionicons name="play-skip-forward" size={35} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setRepeatMode((repeatMode + 1) % 3)}>
                <Ionicons 
                  name={repeatMode === 2 ? "repeat" : "repeat"} 
                  size={24} 
                  color={repeatMode > 0 ? "#FF2D55" : "#FFF"} 
                />
              </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <TouchableOpacity style={styles.bottomButton}>
                <Ionicons name="radio" size={22} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.bottomButton}>
                <Ionicons name="list" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
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
    borderRadius: 10,
    borderCurve: "continuous",
    marginLeft: 8,
    marginRight: 8,
    width: SCREEN_WIDTH,
    height: MINI_PLAYER_HEIGHT,
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
    borderRadius: 6,
    marginRight: 12,
  },
  miniPlayerInfo: {
    flex: 1,
  },
  miniPlayerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  miniPlayerArtist: {
    color: '#999',
    fontSize: 14,
  },
  miniPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
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