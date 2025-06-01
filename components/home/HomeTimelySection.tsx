import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    Platform,
  } from "react-native";
  import Animated, {
    FadeInUp,
  } from "react-native-reanimated";
  import { LinearGradient } from "expo-linear-gradient";
  import type { Section } from "../../types/home";
  import React, { useMemo, useState } from "react";
  import FastImage from "@d11/react-native-fast-image";
  import { unknownTrackImageUri } from "@/constants/images";
  import { Track, useActiveTrack, useIsPlaying } from "react-native-track-player";
  import { Ionicons } from "@expo/vector-icons";
  import LoaderKit from "react-native-loader-kit";
  import { scale, verticalScale } from "@/utils/styling";
  import { 
    colors, 
    spacingX, 
    spacingY, 
    radius, 
    fontSize, 
    shadow 
  } from "@/constants/theme";
  
  interface Props {
    data: Section;
    queueID: string;
    onSeeAllPress?: () => void;
    onTrackPress?: (selectedTrack: Track, tracks: Track[], id: string) => void;
  }
  
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  
  export function HomeWeeklyChartSection({
    data,
    onSeeAllPress,
    onTrackPress,
    queueID,
  }: Props) {
    if (!data?.Tracks || data.Tracks.length === 0) return null;
  
    const listItems = useMemo(() => {
      const tracks = (data.Tracks ?? []).filter((item) => item?.title);
  
      const tracks_fixed = tracks.map((track: any) => ({
        ...track,
        url: track.path,
        artwork: track.artworkPath,
      }));
  
      // Display top 5 tracks for a cleaner, more focused view
      const displayTracks = tracks_fixed.slice(0, 5);
  
      return displayTracks.map((track, index) => (
        <TrackListItem
          key={track.id}
          item={track}
          index={index}
          onPress={() => onTrackPress?.(track, tracks_fixed, queueID)}
          isLast={index === displayTracks.length - 1}
        />
      ));
    }, [data.Tracks, onTrackPress]);
  
    return (
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View style={styles.headingContainer}>
              <View style={styles.trendingIcon}>
                <Text style={styles.trendingEmoji}>🔥</Text>
              </View>
              <View>
                <Text style={styles.heading}>{data.heading}</Text>
                <Text style={styles.weekDate}>{data.weekdate}</Text>
              </View>
            </View>
  
            <Pressable
              style={({ pressed }) => [
                styles.seeAllButton,
                pressed && styles.seeAllButtonPressed,
              ]}
              onPress={onSeeAllPress}
            >
              <Text style={styles.seeAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </Pressable>
          </View>
  
          {/* Featured Artist Card */}
          {data.weekartist && (
            <View style={styles.featuredCard}>
              <FastImage
                source={{ uri: data.weekimage }}
                style={styles.artistImage}
              />
              <View style={styles.featuredContent}>
                <Text style={styles.featuredLabel}>Week's Top Artist</Text>
                <Text style={styles.featuredArtist}>{data.weekartist}</Text>
                <Text style={styles.featuredDesc} numberOfLines={2}>
                  {data.subheading}
                </Text>
              </View>
            </View>
          )}
        </View>
  
        {/* Chart List */}
        <View style={styles.chartContainer}>
          {listItems}
        </View>
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
    const [pressed, setPressed] = useState(false);
    const { playing } = useIsPlaying();
    const isActiveTrack = useActiveTrack()?.url === item.url;
  
    const getRankStyle = (position: number) => {
      if (position === 0) return styles.goldRank;
      if (position === 1) return styles.silverRank;
      if (position === 2) return styles.bronzeRank;
      return styles.defaultRank;
    };
  
    const getTrendIcon = () => {
      if (item.trend) {
        return <Ionicons name="trending-up" size={12} color={colors.success} />;
      }
      return null;
    };
  
    return (
      <AnimatedPressable
        style={[
          styles.trackItem,
          pressed && styles.trackItemPressed,
          isLast && styles.lastTrackItem,
        ]}
        entering={FadeInUp.delay(index * 100).springify()}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onPress}
      >
        {/* Rank */}
        <View style={[styles.rankContainer, getRankStyle(index)]}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>
  
        {/* Track Info */}
        <View style={styles.trackInfo}>
          <FastImage
            source={{
              uri: item.artwork ?? unknownTrackImageUri,
              priority: FastImage.priority.normal,
            }}
            style={[
              styles.trackImage,
              isActiveTrack && styles.activeTrackImage
            ]}
          />
  
          {isActiveTrack && (
            <View style={styles.playingOverlay}>
              {playing ? (
                <LoaderKit
                  style={styles.playingIndicator}
                  name="LineScaleParty"
                  color={colors.primary}
                  size={16}
                />
              ) : (
                <Ionicons
                  name="play"
                  size={16}
                  color={colors.primary}
                />
              )}
            </View>
          )}
  
          <View style={styles.trackDetails}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.trackTitle,
                  isActiveTrack && styles.activeTrackTitle
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {getTrendIcon()}
            </View>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {item.artist}
            </Text>
          </View>
        </View>
  
        {/* Play Count & Action */}
        <View style={styles.rightSection}>
          <Text style={styles.playCount}>{item.totalplays || 0}</Text>
          <Ionicons 
            name={isActiveTrack && playing ? "pause-circle" : "play-circle-outline"} 
            size={20} 
            color={isActiveTrack ? colors.primary : colors.textLight} 
          />
        </View>
      </AnimatedPressable>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      marginTop: spacingY._25,
      paddingHorizontal: spacingX._15,
      marginBottom: spacingY._20,
    },
    headerSection: {
      marginBottom: spacingY._20,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: spacingY._15,
    },
    headingContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    trendingIcon: {
      width: scale(32),
      height: verticalScale(32),
      backgroundColor: colors.background,
      borderRadius: radius._10,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacingX._10,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    trendingEmoji: {
      fontSize: fontSize.md,
    },
    heading: {
      fontSize: fontSize.xl,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 0.3,
    },
    weekDate: {
      fontSize: fontSize.xs,
      color: colors.textLighter,
      fontWeight: '500',
      marginTop: 2,
    },
    seeAllButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacingY._7,
      paddingHorizontal: spacingX._12,
      backgroundColor: colors.background,
      borderRadius: radius._10,
      borderWidth: 1,
      borderColor: colors.divider,
      gap: spacingX._5,
    },
    seeAllButtonPressed: {
      backgroundColor: colors.divider,
    },
    seeAllText: {
      fontSize: fontSize.sm,
      color: colors.primary,
      fontWeight: '500',
    },
    featuredCard: {
      flexDirection: "row",
      backgroundColor: colors.matteBlack,
      borderRadius: radius._12,
      padding: spacingX._12,
      borderWidth: 1,
      borderColor: colors.divider,
      ...shadow.sm,
    },
    artistImage: {
      width: scale(48),
      height: verticalScale(48),
      borderRadius: radius._10,
      marginRight: spacingX._12,
    },
    featuredContent: {
      flex: 1,
      justifyContent: "center",
    },
    featuredLabel: {
      fontSize: fontSize.xs,
      color: colors.primary,
      fontWeight: '500',
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    featuredArtist: {
      fontSize: fontSize.md,
      color: colors.text,
      fontWeight: '600',
      marginBottom: 2,
    },
    featuredDesc: {
      fontSize: fontSize.xs,
      color: colors.textLighter,
      fontWeight: '400',
      lineHeight: verticalScale(16),
    },
    chartContainer: {
      backgroundColor: colors.background,
      borderRadius: radius._12,
      borderWidth: 1,
      borderColor: colors.divider,
      overflow: "hidden",
      ...shadow.md,
    },
    trackItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacingX._12,
      minHeight: verticalScale(60),
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    lastTrackItem: {
      borderBottomWidth: 0,
    },
    trackItemPressed: {
      backgroundColor: colors.divider,
    },
    rankContainer: {
      width: scale(24),
      height: verticalScale(24),
      borderRadius: radius._12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacingX._12,
    },
    goldRank: {
      backgroundColor: "#FFD700",
    },
    silverRank: {
      backgroundColor: "#C0C0C0",
    },
    bronzeRank: {
      backgroundColor: "#CD7F32",
    },
    defaultRank: {
      backgroundColor: colors.neutral700,
    },
    rankText: {
      fontSize: fontSize.xs,
      fontWeight: '700',
      color: colors.black,
    },
    trackInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    trackImage: {
      width: scale(40),
      height: verticalScale(40),
      borderRadius: radius._6,
      marginRight: spacingX._10,
    },
    activeTrackImage: {
      opacity: 0.7,
    },
    playingOverlay: {
      position: "absolute",
      left: scale(12),
      top: verticalScale(12),
      width: scale(16),
      height: verticalScale(16),
      justifyContent: "center",
      alignItems: "center",
    },
    playingIndicator: {
      width: scale(16),
      height: verticalScale(16),
    },
    trackDetails: {
      flex: 1,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacingX._5,
    },
    trackTitle: {
      fontSize: fontSize.md,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    activeTrackTitle: {
      color: colors.primary,
    },
    trackArtist: {
      fontSize: fontSize.sm,
      color: colors.textLighter,
      fontWeight: '400',
      marginTop: 2,
    },
    rightSection: {
      alignItems: "center",
      gap: spacingY._5,
    },
    playCount: {
      fontSize: fontSize.xs,
      color: colors.textLighter,
      fontWeight: '500',
    },
  });
  
  export default HomeWeeklyChartSection;