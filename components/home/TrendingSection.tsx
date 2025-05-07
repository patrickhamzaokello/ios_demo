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
import { colors } from "@/constants/theme";
import React, { useMemo, useState } from "react";
import FastImage from "@d11/react-native-fast-image";
import { unknownTrackImageUri } from "@/constants/images";
import { Track, useActiveTrack, useIsPlaying } from "react-native-track-player";
import { Ionicons } from "@expo/vector-icons";
import LoaderKit from "react-native-loader-kit";
import { colors as new_colors } from "@/constants/tokens";

interface Props {
  data: Section;
  queueID: string;
  onSeeAllPress?: () => void;
  onTrackPress?: (selectedTrack: Track, tracks: Track[], id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const LIST_PADDING = 16;
const LIST_ITEM_HEIGHT = 72; // Adjusted for a comfortable list item height

export function TrendingSection({
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

    // Only display the first 6 tracks in the list to encourage "See All" usage
    // You can adjust this number as needed
    const displayTracks = tracks_fixed.slice(0, 6);

    return displayTracks.map((track, index) => (
      <React.Fragment key={track.id}>
        <TrackListItem
          item={track}
          index={index}
          onPress={() => onTrackPress?.(track, tracks_fixed, queueID)}
          isLast={index === displayTracks.length - 1}
        />
        {index < displayTracks.length - 1 && <View style={styles.separator} />}
      </React.Fragment>
    ));
  }, [data.Tracks, onTrackPress]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headingContainer}>
          <LinearGradient
            colors={["#7C3AED", "#4F46E5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headingAccent}
          />
          <Text style={styles.heading}>{data.heading}</Text>
          <Text style={styles.trackCount}>{data.Tracks.length} tracks</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.seeAllButton,
            pressed && styles.seeAllButtonPressed,
          ]}
          onPress={onSeeAllPress}
        >
          <Text style={styles.seeAll}>See All</Text>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.cardContainer} testID="trending-list">
        <LinearGradient
          colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
          style={styles.cardGradient}
        />
        <View style={styles.listContainer}>
          {listItems}
        </View>
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

  return (
    <AnimatedPressable
      style={[
        styles.trackItem,
        pressed && styles.trackItemPressed,
        isLast && styles.lastItem,
      ]}
      entering={FadeInUp.delay(index * 80).springify()}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      {/* Rank badge */}
      <View style={styles.rankContainer}>
        <LinearGradient
          colors={
            index === 0
              ? ["#FFD700", "#FFA500"]
              : index === 1
              ? ["#C0C0C0", "#A9A9A9"]
              : index === 2
              ? ["#CD7F32", "#8B4513"]
              : ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]
          }
          style={styles.rankBadge}
        >
          <Text style={styles.index}>{index + 1}</Text>
        </LinearGradient>
      </View>

      {/* Album artwork */}
      <View style={styles.imageContainer}>
        <FastImage
          source={{
            uri: item.artwork ?? unknownTrackImageUri,
            priority: FastImage.priority.normal,
          }}
          style={{
            ...styles.trackArtworkImage,
            opacity: isActiveTrack ? 0.6 : 1,
          }}
        />

        {isActiveTrack &&
          (playing ? (
            <LoaderKit
              style={styles.trackPlayingIconIndicator}
              name="LineScaleParty"
              color={new_colors.icon}
            />
          ) : (
            <Ionicons
              style={styles.trackPausedIndicator}
              name="play"
              size={24}
              color={new_colors.icon}
            />
          ))}
      </View>

      {/* Track details */}
      <View style={styles.details}>
        <Text
          style={{
            ...styles.title,
            color: isActiveTrack ? colors.primary : colors.text,
          }}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>

      {/* Play indicator */}
      <View style={styles.playIndicator}>
        {isActiveTrack ? (
          <Ionicons 
            name={playing ? "pause-circle" : "play-circle"} 
            size={24} 
            color={colors.primary} 
          />
        ) : (
          <Ionicons name="play-circle-outline" size={24} color="rgba(255,255,255,0.7)" />
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: LIST_PADDING,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headingAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  trackCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  seeAllButtonPressed: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  seeAll: {
    fontSize: 14,
    color: "#A0AEC0",
    fontWeight: "600",
  },
  arrowContainer: {
    marginLeft: 4,
  },
  arrow: {
    fontSize: 16,
    color: "#A0AEC0",
    fontWeight: "600",
  },
  cardContainer: {
    width: SCREEN_WIDTH - LIST_PADDING * 2,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      },
    }),
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  listContainer: {
    flexDirection: "column",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 16,
  },
  trackItem: {
    height: LIST_ITEM_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 16,
  },
  lastItem: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  trackItemPressed: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  rankContainer: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 28,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  index: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    marginRight: 12,
  },
  trackArtworkImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  trackPlayingIconIndicator: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 16,
    height: 16,
  },
  trackPausedIndicator: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  artist: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    fontWeight: "500",
  },
  playIndicator: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});