// Optimized Artist Intro Header
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

const ArtistIntroHeader = ({ artist }: { artist: any }) => {
  return (
    <View style={styles.container}>
      {/* Hero cover image */}
      <Image source={{ uri: artist.profilephoto }} style={styles.profilePhoto} />

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

        {/* Artist main info */}
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

          {/* Short artist intro/tagline - limited to 2 lines */}
          <Text style={styles.artistTagline} numberOfLines={2}>
            {artist.intro}
          </Text>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.playButton}>
              <MaterialCommunityIcons name="play" size={20} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.moreButton}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.circleButton}>
            <FontAwesome name="star" size={18} color="white" />
            <Text style={styles.buttonText}>Artist's Circle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 360,
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
    height: "75%",
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
    bottom: 20,
    left: 20,
    right: 20,
  },
  artistName: {
    color: "#fff",
    fontSize: 34,
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
    marginBottom: 16,
    maxWidth: "90%",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  followButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginRight: 12,
  },
  followButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  playButton: {
    backgroundColor: "#fff",
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  moreButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  circleButton: {
    backgroundColor: "#6200EA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 25,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default ArtistIntroHeader;
