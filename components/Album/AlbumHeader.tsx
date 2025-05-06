// AlbumHeader.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Platform, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withTiming,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { unknownTrackImageUri } from "@/constants/images";
import { utilsStyles } from "@/styles";

// Import shared constants from Album.js
import {
  ALBUM_ART_MAX_SIZE,
  ALBUM_ART_MIN_SIZE,
  HEADER_MAX_HEIGHT,
  HEADER_MIN_HEIGHT,
  SCROLL_THRESHOLD,
} from "./index";
import FastImage from "@d11/react-native-fast-image";

interface AlbumHeaderProps {
  artwork: string;
  title: string;
  artist: string;
  releaseDate: string;
  trackCount: number;
  description: string;
  scrollY: Animated.SharedValue<number>;
  onBack?: () => void;
  onMore?: () => void;
  onHeaderHeight?: (height: number) => void;
}

const AlbumHeader: React.FC<AlbumHeaderProps> = ({
  artwork,
  title,
  artist,
  releaseDate,
  trackCount,
  description,
  scrollY,
  onBack,
  onMore,
  onHeaderHeight,
}) => {
  // Animation states
  const titleOpacity = useSharedValue(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    onHeaderHeight?.(event.nativeEvent.layout.height);
  };

  // Show title animation after initial render
  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 400 });
  }, []);

  // Animated styles for parallax and fade effects
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, SCROLL_THRESHOLD],
        [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        Extrapolation.CLAMP
      ),
      // Use position absolute to avoid layout issues with the scrollview content
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    };
  });

  const artworkAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [1, 0.5],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [0, -ALBUM_ART_MAX_SIZE * 0.3],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.8, SCROLL_THRESHOLD],
      [1, 0.8, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  const detailsAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.7, SCROLL_THRESHOLD],
      [1, 0.3, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [0, -50],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const collapsedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_THRESHOLD * 0.7, SCROLL_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  // Animated text opacity based on scroll
  const titleFadeStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, headerAnimatedStyle]} onLayout={handleLayout}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onBack} style={styles.navButton}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Compact title for scrolled state */}
        <Animated.View style={[styles.collapsedTitle, collapsedHeaderStyle]}>
          <Text style={styles.collapsedTitleText} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.collapsedArtistText} numberOfLines={1}>
            {artist}
          </Text>
        </Animated.View>

        <TouchableOpacity onPress={onMore} style={styles.navButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Album artwork with shadow */}
      <Animated.View style={[styles.artworkContainer, artworkAnimatedStyle]}>
        <FastImage
          source={{
            uri: artwork ?? unknownTrackImageUri,
            priority: FastImage.priority.normal,
          }}
          style={{
            ...styles.artwork_style,
          }}
        />
      </Animated.View>

      {/* Album details */}
      <Animated.View
        style={[styles.detailsContainer, detailsAnimatedStyle, titleFadeStyle]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {artist}
          </Text>
          <Text style={styles.infoText}>
            {releaseDate} • {trackCount} songs
          </Text>
        </View>

        {description ? (
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        ) : null}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "red"
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 0 : 16,
    paddingHorizontal: 16,
    height: 90, // Same as HEADER_MIN_HEIGHT
    zIndex: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  collapsedTitle: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  collapsedTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  collapsedArtistText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  artworkContainer: {
    width: ALBUM_ART_MAX_SIZE,
    height: ALBUM_ART_MAX_SIZE,
    alignSelf: "center",
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  artwork_style: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  artist: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 16,
  },
});

export default AlbumHeader;
