import { unknownTrackImageUri } from "@/constants/images";
import FastImage from "@d11/react-native-fast-image";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ALBUM_ART_SIZE } from "./AlbumDetails";

interface AlbumHeaderProps {
  artwork: string;
  title: string;
  artist: string;
  releaseDate: string;
  trackCount: number;
  description: string;
  onBack?: () => void;
  onMore?: () => void;
}

const AlbumHeader: React.FC<AlbumHeaderProps> = ({
  artwork,
  title,
  artist,
  releaseDate,
  trackCount,
  description,
  onBack,
  onMore,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onBack} style={styles.navButton}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {artist}
          </Text>
        </View>

        <TouchableOpacity onPress={onMore} style={styles.navButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Album Artwork */}
      <View style={styles.artworkContainer}>
        <FastImage
          source={{
            uri: artwork ?? unknownTrackImageUri,
            priority: FastImage.priority.normal,
          }}
          style={styles.artwork}
          resizeMode="cover"
        />
      </View>

      {/* Album Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.titleText} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.artistText} numberOfLines={1}>
          {artist}
        </Text>
        <Text style={styles.infoText}>
          {releaseDate} • {trackCount} songs
        </Text>

        {description && (
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 20,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 0 : 16,
    paddingHorizontal: 16,
    height: 60,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  artist: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  artworkContainer: {
    width: ALBUM_ART_SIZE,
    height: ALBUM_ART_SIZE,
    alignSelf: "center",
    marginTop: 20,
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
  artwork: {
    width: "100%",
    borderRadius: 8,
    height: undefined, // Allow height to scale automatically
    aspectRatio: 1
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  artistText: {
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
    paddingHorizontal: 20,
  },
});

export default AlbumHeader;
