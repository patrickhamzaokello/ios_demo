import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import FastImage from "@d11/react-native-fast-image";
import { unknownTrackImageUri } from "@/constants/images";

const ArtistIntroHeader = ({ artist }: { artist: any }) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.container}>
        {/* Hero cover image */}

        <FastImage
          source={{
            uri: artist.profilephoto ?? unknownTrackImageUri,
            priority: FastImage.priority.normal,
          }}
          style={styles.profilePhoto}
          resizeMode="cover"
        />

        {/* Gradient overlay for better text visibility */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
        />

        {/* Content overlay */}
        <View style={styles.contentContainer}>
          {/* Verified badge (top-right) */}
          {artist.verified && (
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={16}
                color="#fff"
              />
              <Text style={styles.verifiedText}>Verified Artist</Text>
            </View>
          )}

          {/* Artist main info - positioned lower on the image */}
          <View style={styles.artistInfo}>
            <Text style={styles.artistName}>{artist.name}</Text>

            {/* Monthly listeners with icon */}
            <View style={styles.listenerWrapper}>
              <MaterialCommunityIcons
                name="headphones"
                size={16}
                color="#bbb"
                style={styles.icon}
              />
              <Text style={styles.listenerCount}>{artist.monthly}</Text>
            </View>

            {/* Reorganized action buttons */}
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        {/* Short artist intro/tagline - limited to 2 lines */}
        <Text style={styles.artistTagline} numberOfLines={2}>
          {artist.intro}
        </Text>
        {/* Primary actions row */}

        <TouchableOpacity style={styles.circleButton}>
          <FontAwesome name="plus" size={16} color="white" />
          <Text style={styles.buttonText}>Join Artist's Circle</Text>
        </TouchableOpacity>

        {/* Secondary actions row */}
        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.playButton}>
            <MaterialCommunityIcons name="play" size={20} color="#000" />
            <Text style={styles.playButtonText}>Play All</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shuffleButton}>
            <MaterialCommunityIcons name="share" size={20} color="#fff" />
            <Text style={styles.shuffleButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 380, // Slightly taller to accommodate reorganized buttons
    width: "100%",
    overflow: "hidden",
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "80%", // Increased gradient height
    zIndex: 1,
  },
  contentContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    zIndex: 2,
  },
  verifiedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  verifiedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  artistInfo: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    // Artist name starts from more than halfway down the image
    height: "60%", // This controls how far down the content starts
    justifyContent: "flex-end",
  },
  artistName: {
    color: "#fff",
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  listenerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 6,
  },
  listenerCount: {
    color: "#ddd",
    fontSize: 14,
    fontWeight: "500",
  },
  artistTagline: {
    color: "#ddd",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 20, // Increased spacing before buttons
    maxWidth: "90%",
  },
  buttonsContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  primaryActions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12, // Space between button rows
  },
  secondaryActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  circleButton: {
    backgroundColor: "#6200EA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1, // Takes remaining space
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 14,
  },
  playButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  playButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  shuffleButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  shuffleButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});

export default ArtistIntroHeader;
