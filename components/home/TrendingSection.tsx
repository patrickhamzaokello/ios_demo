import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import Animated, {
  FadeInUp,
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import type { Section } from "../../types/home";
import { colors } from "@/constants/theme";
import React, { useMemo, useState } from "react";
import { BlurView } from "expo-blur";
import FastImage from "@d11/react-native-fast-image";
import { unknownTrackImageUri } from "@/constants/images";
import { Track, useActiveTrack, useIsPlaying } from "react-native-track-player";
import { Ionicons } from "@expo/vector-icons";
import LoaderKit from "react-native-loader-kit";
import { colors as new_colors, fontSize } from "@/constants/tokens";

interface Props {
  data: Section;
  queueID: string;
  onSeeAllPress?: () => void;
  onTrackPress?: (selectedTrack: Track, tracks: Track[], id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_PADDING = 16;
const GRID_SPACING = 12;
const COLUMNS = 2;
const IMAGE_SIZE = 60;
const ITEM_WIDTH =
  (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_SPACING * (COLUMNS - 1)) / COLUMNS;

export function TrendingSection({
  data,
  onSeeAllPress,
  onTrackPress,
  queueID,
}: Props) {
  if (!data?.Tracks || data.Tracks.length === 0) return null;

  const gridItems = useMemo(() => {
    // Create rows of 2 items each to properly handle odd numbers
    const rows = [];
    const tracks = (data.Tracks ?? []).filter((item) => item?.title);

    const tracks_fixed = tracks.map((track: any) => ({
      ...track,
      url: track.path,
      artwork: track.artworkPath,
    }));

    for (let i = 0; i < tracks_fixed.length; i += COLUMNS) {
      const rowItems = [];

      // Process up to COLUMNS items per row
      for (let j = 0; j < COLUMNS; j++) {
        const index = i + j;
        if (index < tracks_fixed.length) {
          rowItems.push(
            <TrackItem
              key={tracks_fixed[index].id}
              item={tracks_fixed[index]}
              index={index}
              onPress={() =>
                onTrackPress?.(tracks_fixed[index], tracks_fixed, queueID)
              }
              isLeftItem={j === 0}
              isRightItem={j === COLUMNS - 1}
            />
          );
        } else {
          // Add an empty placeholder to maintain grid structure when odd number of items
          rowItems.push(
            <View
              key={`empty-${index}`}
              style={{
                width: ITEM_WIDTH,
                marginLeft: j > 0 ? GRID_SPACING : 0,
                marginBottom: GRID_SPACING,
              }}
            />
          );
        }
      }

      // Add the row with proper flex layout
      rows.push(
        <View key={`row-${i}`} style={styles.gridRow}>
          {rowItems}
        </View>
      );
    }

    return rows;
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

      <View style={styles.gridContainer} testID="trending-grid">
        {gridItems}
      </View>
    </View>
  );
}

interface TrackItemProps {
  item: any;
  index: number;
  onPress: () => void;
  isLeftItem?: boolean;
  isRightItem?: boolean;
}

function TrackItem({
  item,
  index,
  onPress,
  isLeftItem = false,
  isRightItem = false,
}: TrackItemProps) {
  const [pressed, setPressed] = useState(false);

  const { playing } = useIsPlaying();

  const isActiveTrack = useActiveTrack()?.url === item.url;

  return (
    <AnimatedPressable
      style={[
        styles.trackItem,
        isLeftItem ? styles.leftItem : null,
        isRightItem ? styles.rightItem : null,
        !isLeftItem && !isRightItem ? null : null,
        pressed && styles.trackItemPressed,
      ]}
      entering={FadeInUp.delay(index * 80).springify()}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        style={styles.trackItemGradient}
      />

      <View style={styles.rankBadgeContainer}>
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

      <View style={styles.imageContainer}>
        <View>
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
      </View>

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
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: GRID_PADDING,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  gridContainer: {
    flexDirection: "column",
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 0, // We're handling margins in the items themselves
  },
  leftItem: {
    marginRight: GRID_SPACING / 2,
  },
  rightItem: {
    marginLeft: GRID_SPACING / 2,
  },
  trackItem: {
    width: ITEM_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: GRID_SPACING,
    borderRadius: 16,
    position: "relative",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
      },
    }),
  },
  trackItemGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  trackItemPressed: {
    transform: [{ scale: 0.98 }],
  },

  trackPlayingIconIndicator: {
    position: "absolute",
    top: 18,
    left: 16,
    width: 16,
    height: 16,
  },
  trackPausedIndicator: {
    position: "absolute",
    top: 14,
    left: 14,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    marginRight: 8,
    alignItems: "center",
    position: "relative",
  },
  trackArtworkImage: {
    borderRadius: 8,
    width: 50,
    height: 50,
  },
  playIconOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
  },
  playIcon: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 12,
    borderRightWidth: 0,
    borderBottomWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "white",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginLeft: 4,
  },
  rankBadgeContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
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
  details: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  artist: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    fontWeight: "500",
  },
});
