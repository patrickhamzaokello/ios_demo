import { View, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';
import { useCallback, useRef, useEffect } from "react";
import { colors, spacingX, spacingY, radius, borderRadius } from '@/constants/theme';

export function LoadingState() {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const createShimmerStyle = (delay: number = 0) => {
    const localValue = useSharedValue(0);
  
    useEffect(() => {
      localValue.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1200 }),
            withTiming(0, { duration: 1200 })
          ),
          -1,
          true
        )
      );
    }, []);
  
    return useAnimatedStyle(() => {
      const opacity = interpolate(
        localValue.value,
        [0, 0.5, 1],
        [0.3, 0.7, 0.3]
      );
      return {
        opacity,
      };
    });
  };
  

  const ShimmerBox = ({ 
    style, 
    delay = 0 
  }: { 
    style: any; 
    delay?: number; 
  }) => (
    <Animated.View 
      style={[
        { backgroundColor: colors.neutral800 },
        style,
        createShimmerStyle(delay)
      ]} 
    />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <ShimmerBox 
          style={styles.heroImage} 
          delay={0}
        />
        <View style={styles.heroContent}>
          <ShimmerBox 
            style={styles.heroTitle} 
            delay={100}
          />
          <ShimmerBox 
            style={styles.heroSubtitle} 
            delay={200}
          />
          <ShimmerBox 
            style={styles.heroButton} 
            delay={300}
          />
        </View>
      </View>

      {/* Section 1 - New Releases */}
      <View style={styles.section}>
        <ShimmerBox 
          style={styles.sectionTitle} 
          delay={400}
        />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {[...Array(4)].map((_, i) => (
            <View key={i} style={styles.albumCard}>
              <ShimmerBox 
                style={styles.albumImage} 
                delay={500 + i * 100}
              />
              <ShimmerBox 
                style={styles.albumTitle} 
                delay={600 + i * 100}
              />
              <ShimmerBox 
                style={styles.albumArtist} 
                delay={700 + i * 100}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Section 2 - Trending Tracks */}
      <View style={styles.section}>
        <ShimmerBox 
          style={styles.sectionTitle} 
          delay={800}
        />
        {[...Array(5)].map((_, i) => (
          <View key={i} style={styles.trackRow}>
            <ShimmerBox 
              style={styles.trackImage} 
              delay={900 + i * 50}
            />
            <View style={styles.trackInfo}>
              <ShimmerBox 
                style={styles.trackTitle} 
                delay={950 + i * 50}
              />
              <ShimmerBox 
                style={styles.trackArtist} 
                delay={1000 + i * 50}
              />
            </View>
            <ShimmerBox 
              style={styles.trackDuration} 
              delay={1050 + i * 50}
            />
          </View>
        ))}
      </View>

      {/* Section 3 - Featured Artists */}
      <View style={styles.section}>
        <ShimmerBox 
          style={styles.sectionTitle} 
          delay={1300}
        />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {[...Array(4)].map((_, i) => (
            <View key={i} style={styles.artistCard}>
              <ShimmerBox 
                style={styles.artistImage} 
                delay={1400 + i * 100}
              />
              <ShimmerBox 
                style={styles.artistName} 
                delay={1500 + i * 100}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Section 4 - Playlists */}
      <View style={styles.section}>
        <ShimmerBox 
          style={styles.sectionTitle} 
          delay={1700}
        />
        <View style={styles.playlistGrid}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={styles.playlistCard}>
              <ShimmerBox 
                style={styles.playlistImage} 
                delay={1800 + i * 100}
              />
              <ShimmerBox 
                style={styles.playlistTitle} 
                delay={1900 + i * 100}
              />
              <ShimmerBox 
                style={styles.playlistSubtitle} 
                delay={2000 + i * 100}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Bottom spacing */}
      <View style={{ height: spacingY._80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  
  // Hero Section
  heroContainer: {
    height: 280,
    position: 'relative',
    marginBottom: spacingY._25,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  heroContent: {
    position: 'absolute',
    bottom: spacingY._20,
    left: spacingX._20,
    right: spacingX._20,
  },
  heroTitle: {
    height: 32,
    width: '70%',
    borderRadius: radius._6,
    marginBottom: spacingY._10,
  },
  heroSubtitle: {
    height: 20,
    width: '50%',
    borderRadius: radius._3,
    marginBottom: spacingY._15,
  },
  heroButton: {
    height: 44,
    width: 120,
    borderRadius: borderRadius.full,
  },

  // Section Styles
  section: {
    marginBottom: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  sectionTitle: {
    height: 24,
    width: '45%',
    borderRadius: radius._6,
    marginBottom: spacingY._15,
  },

  // Horizontal Scroll
  horizontalScroll: {
    marginHorizontal: -spacingX._20,
    paddingHorizontal: spacingX._20,
  },

  // Album Cards
  albumCard: {
    width: 160,
    marginRight: spacingX._15,
  },
  albumImage: {
    width: 160,
    height: 160,
    borderRadius: borderRadius.sm,
    marginBottom: spacingY._10,
  },
  albumTitle: {
    height: 18,
    width: '85%',
    borderRadius: radius._3,
    marginBottom: spacingY._5,
  },
  albumArtist: {
    height: 14,
    width: '65%',
    borderRadius: radius._3,
  },

  // Track Rows
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingY._10,
    marginBottom: spacingY._5,
  },
  trackImage: {
    width: 48,
    height: 48,
    borderRadius: radius._6,
    marginRight: spacingX._15,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    height: 16,
    width: '70%',
    borderRadius: radius._3,
    marginBottom: spacingY._5,
  },
  trackArtist: {
    height: 14,
    width: '50%',
    borderRadius: radius._3,
  },
  trackDuration: {
    height: 14,
    width: 40,
    borderRadius: radius._3,
  },

  // Artist Cards
  artistCard: {
    width: 120,
    marginRight: spacingX._15,
    alignItems: 'center',
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    marginBottom: spacingY._10,
  },
  artistName: {
    height: 16,
    width: '80%',
    borderRadius: radius._3,
  },

  // Playlist Grid
  playlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  playlistCard: {
    width: '48%',
    marginBottom: spacingY._20,
  },
  playlistImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.sm,
    marginBottom: spacingY._10,
  },
  playlistTitle: {
    height: 16,
    width: '85%',
    borderRadius: radius._3,
    marginBottom: spacingY._5,
  },
  playlistSubtitle: {
    height: 12,
    width: '60%',
    borderRadius: radius._3,
  },
});