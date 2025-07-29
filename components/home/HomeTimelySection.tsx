import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import type { Section } from "../../types/home";
import React, { useMemo, useState } from "react";
import FastImage from "@d11/react-native-fast-image";
import { unknownTrackImageUri } from "@/constants/images";
import { Track, useActiveTrack, useIsPlaying } from "react-native-track-player";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "@/utils/styling";
import { 
  colors, 
  spacingX, 
  spacingY, 
  radius, 
  fontSize 
} from "@/constants/theme";

interface Props {
  data: Section;
  queueID: string;
  onSeeAllPress?: () => void;
  onTrackPress?: (selectedTrack: Track, tracks: Track[], id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HomeWeeklyChartSection({
  data,
  onSeeAllPress,
  onTrackPress,
  queueID,
}: Props) {
  if (!data?.Tracks || data.Tracks.length === 0) return null;

  const trackColumns = useMemo(() => {
    const tracks = (data.Tracks ?? []).filter((item) => item?.title);

    const tracks_fixed = tracks.map((track: any) => ({
      ...track,
      url: track.path,
      artwork: track.artworkPath,
    }));

    // Group tracks into columns of 4
    const columns = [];
    for (let i = 0; i < tracks_fixed.length; i += 4) {
      columns.push(tracks_fixed.slice(i, i + 4));
    }

    return columns.map((columnTracks, columnIndex) => (
      <View key={columnIndex} style={styles.trackColumn}>
        {columnTracks.map((track, index) => (
          <TrackListItem
            key={track.id}
            item={track}
            index={columnIndex * 4 + index}
            onPress={() => onTrackPress?.(track, tracks_fixed, queueID)}
            isLast={index === columnTracks.length - 1}
          />
        ))}
      </View>
    ));
  }, [data.Tracks, onTrackPress]);

  return (
    <View style={styles.container}>
      {/* Header with Top Artist */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.heading}>{data.heading}</Text>
          {data.weekartist && (
            <View style={styles.topArtistContainer}>
              <FastImage
                source={{ uri: data.weekimage }}
                style={styles.topArtistImage}
              />
              <Text style={styles.topArtistText}>Top Artist: {data.weekartist}</Text>
            </View>
          )}
        </View>
        
        <Pressable
          style={({ pressed }) => [
            styles.seeAllButton,
            pressed && styles.seeAllButtonPressed,
          ]}
          onPress={onSeeAllPress}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
        </Pressable>
      </View>

      {/* Horizontal Scrolling Track Grid */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        {trackColumns}
      </ScrollView>
    </View>
  );
}

interface TrackListItemProps {
  item: any;
  index: number;
  onPress: () => void;
  isLast?: boolean;
}

function TrackListItem({
  item,
  index,
  onPress,
  isLast = false,
}: TrackListItemProps) {
  const { playing } = useIsPlaying();
  const isActiveTrack = useActiveTrack()?.url === item.url;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getRankColor = (position: number) => {
    if (position === 0) return colors.primary;
    if (position === 1) return '#6B7280';
    if (position === 2) return '#D97706';
    return colors.textLight;
  };

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        styles.trackItem,
        isActiveTrack && styles.activeTrackItem,
        isLast && styles.lastTrackItem,
      ]}
      entering={FadeInUp.delay(index * 50).springify()}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      {/* Simple Rank */}
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankText,
          { color: getRankColor(index) }
        ]}>
          {index + 1}
        </Text>
      </View>

      {/* Track Image */}
      <View style={styles.imageContainer}>
        <FastImage
          source={{
            uri: item.artwork ?? unknownTrackImageUri,
            priority: FastImage.priority.normal,
          }}
          style={styles.trackImage}
        />
        
        {/* Simple play indicator */}
        {isActiveTrack && (
          <View style={styles.playIndicator}>
            <Ionicons
              name={playing ? "pause" : "play"}
              size={12}
              color="#fff"
            />
          </View>
        )}
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <Text
          style={[
            styles.trackTitle,
            isActiveTrack && styles.activeTrackTitle
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>

      {/* Simple Action Button */}
      <Pressable
        style={styles.actionButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons 
          name="ellipsis-horizontal" 
          size={18} 
          color={colors.textLight} 
        />
      </Pressable>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacingY._24,
    marginHorizontal: spacingX._16,
  },
  
  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacingY._20,
  },
  headerLeft: {
    flex: 1,
  },
  heading: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacingY._8,
  },
  topArtistContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  topArtistImage: {
    width: scale(24),
    height: verticalScale(24),
    borderRadius: radius._12,
    marginRight: spacingX._8,
  },
  topArtistText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    fontWeight: '500',
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacingY._8,
    paddingHorizontal: spacingX._12,
    gap: spacingX._4,
  },
  seeAllButtonPressed: {
    opacity: 0.6,
  },
  seeAllText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    fontWeight: '500',
  },

  // Horizontal Scroll Styles
  scrollView: {
    marginHorizontal: -spacingX._16,
  },
  scrollContainer: {
    paddingHorizontal: spacingX._16,
    gap: spacingX._12,
  },
  trackColumn: {
    width: scale(180),
  },

  // Track List Styles
  trackList: {
    backgroundColor: colors.surface,
    borderRadius: radius._12,
    paddingVertical: spacingY._8,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._8,
    minHeight: verticalScale(48),
    backgroundColor: colors.surface,
    borderRadius: radius._8,
    marginBottom: spacingY._6,
  },
  activeTrackItem: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  lastTrackItem: {
    borderBottomWidth: 0,
  },

  // Rank Styles
  rankContainer: {
    width: scale(20),
    alignItems: "center",
    marginRight: spacingX._8,
  },
  rankText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },

  // Image Styles
  imageContainer: {
    position: 'relative',
    marginRight: spacingX._8,
  },
  trackImage: {
    width: scale(32),
    height: verticalScale(32),
    borderRadius: radius._6,
  },
  playIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: radius._6,
    justifyContent: "center",
    alignItems: "center",
  },

  // Track Info Styles
  trackInfo: {
    flex: 1,
    marginRight: spacingX._8,
  },
  trackTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacingY._1,
  },
  activeTrackTitle: {
    color: colors.primary,
  },
  trackArtist: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '500',
  },

  // Action Button Styles
  actionButton: {
    padding: spacingY._2,
  },
});

export default HomeWeeklyChartSection;