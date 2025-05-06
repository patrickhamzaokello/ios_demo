import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors, fontSize, spacingX, spacingY } from "@/constants/theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";

interface AlbumHeaderProps {
  artwork: string;
  title: string;
  artist: string;
  releaseDate: string;
  trackCount: number;
  description: string;
}

const AlbumHeader: React.FC<AlbumHeaderProps> = ({
  artwork,
  title,
  artist,
  releaseDate,
  trackCount,
  description,
}) => {
  return (
    <Animated.View style={[styles.container]}>
      {/* Background Image (Blurred) */}

      {/* Dark overlay */}

      {/* Navigation Bar */}
      <Animated.View style={[styles.navBar]}>
        {/* Compact title for scrolled state */}
        <Animated.View style={[styles.collapsedTitle]}>
          <Text style={styles.collapsedTitleText} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.collapsedArtistText} numberOfLines={1}>
            {artist}
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Album artwork */}
      <Animated.Image
        source={{ uri: artwork }}
        style={[styles.artwork]}
        resizeMode="cover"
      />

      {/* Album details */}
      <View style={styles.detailsContainer}>
        <Animated.View style={[styles.titleContainer]}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {artist}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.infoContainer]}>
          <Text style={styles.infoText}>
            {releaseDate} • {trackCount} songs
          </Text>
          {description ? (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 10,
  },
  backgroundImage: {
    zIndex: -2,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: -1,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight || 40,
    paddingHorizontal: spacingX._15,
    height: 90,
  } as ViewStyle,
  navButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  collapsedTitle: {
    flex: 1,
    marginHorizontal: spacingX._12,
  },
  collapsedTitleText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: "600",
    textAlign: "center",
  },
  collapsedArtistText: {
    color: colors.neutral100,
    fontSize: fontSize.sm,
    textAlign: "center",
  },
  artwork: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  detailsContainer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    paddingHorizontal: spacingX._25,
  },
  titleContainer: {
    marginBottom: spacingY._10,
  },
  title: {
    color: colors.primary,
    fontSize: fontSize.xxl,
    fontWeight: "700",
    marginBottom: spacingY._7,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  artist: {
    color: colors.neutral100,
    fontSize: fontSize.lg,
    fontWeight: "500",
  },
  infoContainer: {
    marginTop: spacingY._17,
  },
  infoText: {
    color: colors.neutral100,
    fontSize: fontSize.sm,
    marginBottom: spacingY._4,
  },
  description: {
    color: colors.neutral100,
    fontSize: fontSize.sm,
    marginTop: spacingY._12,
    lineHeight: 20,
    opacity: 0.9,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: spacingY._25,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._25,
    borderRadius: 24,
    marginRight: spacingX._15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  playButtonText: {
    color: colors.black,
    fontWeight: "600",
    marginLeft: spacingX._10,
  },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._25,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  shuffleButtonText: {
    color: colors.primary,
    fontWeight: "600",
    marginLeft: spacingX._10,
  },
});

export default AlbumHeader;
