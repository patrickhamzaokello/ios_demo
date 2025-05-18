import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import FastImage from "@d11/react-native-fast-image";
import { unknownTrackImageUri } from "@/constants/images";

interface Artist {
  name?: string;
  bio?: string;
  coverimage?: string;
  monthly?: number;
  genre?: string;
  RecordLable?: string;
  twitterurl?: string;
  instagramurl?: string;
  facebookurl?: string;
}

const ArtistBioFooter = ({ artist }: { artist: Artist }) => {
  const [expanded, setExpanded] = useState(false);

  // Helper functions
  const formatNumber = (num: any) => {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const cleanBio = (bio: any) => {
    if (!bio) return "No biography available";
    return bio.replace(/\\n/g, '\n'); // Convert escaped newlines
  };

  return (
    <View style={styles.container}>
      {/* Bio Section (Always shown) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About {artist?.name || "Artist"}</Text>
        <View style={styles.bioRow}>
        
          <FastImage
          source={{
            uri: artist.coverimage ?? unknownTrackImageUri,
            priority: FastImage.priority.normal,
          }}
          style={styles.artistImage}
          resizeMode="cover"
        />
          <View style={styles.bioContent}>
            <Text style={styles.bioText} numberOfLines={expanded ? undefined : 3}>
              {cleanBio(artist?.bio)}
            </Text>
            {artist?.bio && artist.bio.length > 120 && (
              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={styles.readMore}>
                  {expanded ? "Show less" : "Read more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {(artist?.monthly ) && <View style={styles.divider} />}

      {/* Stats Section (Conditional) */}
      {(artist?.monthly ) && (
        <View style={styles.statsRow}>
          {artist?.monthly && (
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {formatNumber(artist.monthly.toString().replace(/\D/g, ''))}
              </Text>
              <Text style={styles.statLabel}>Monthly Listeners</Text>
            </View>
          )}
          
         
        </View>
      )}

      {(artist?.genre || artist?.RecordLable) && <View style={styles.divider} />}

      {/* Genre & Label (Conditional) */}
      {(artist?.genre || artist?.RecordLable) && (
        <View style={styles.metaRow}>
         
          
          {artist?.RecordLable && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Label</Text>
              <Text style={styles.metaValue}>{artist.RecordLable}</Text>
            </View>
          )}

{artist?.genre && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Genre</Text>
              <Text style={styles.metaValue}>{artist.genre}</Text>
            </View>
          )}
        </View>
      )}

      {(artist?.twitterurl || artist?.instagramurl || artist?.facebookurl) && (
        <View style={styles.divider} />
      )}

      {/* Social Links (Conditional) */}
      {(artist?.twitterurl || artist?.instagramurl || artist?.facebookurl) && (
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Connect</Text>
          <View style={styles.socialRow}>
            {artist?.twitterurl && (
              <TouchableOpacity 
                style={styles.socialIcon}
                onPress={() => artist.twitterurl && Linking.openURL(artist.twitterurl)}>
                <FontAwesome name="twitter" size={18} color="white" />
              </TouchableOpacity>
            )}
            
            {artist?.instagramurl && (
              <TouchableOpacity 
                style={styles.socialIcon}
                onPress={() => artist.instagramurl && Linking.openURL(artist.instagramurl)}>
                <FontAwesome name="instagram" size={18} color="white" />
              </TouchableOpacity>
            )}
            
            {artist?.facebookurl && (
              <TouchableOpacity 
                style={styles.socialIcon}
                onPress={() => artist.facebookurl && Linking.openURL(artist.facebookurl)}>
                <FontAwesome name="facebook" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Footer (Always shown but minimal) */}
      <View style={styles.divider} />
      <Text style={styles.footerText}>
        ℗ {new Date().getFullYear()} {artist?.RecordLable || "Independent"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    borderRadius: 8,
    margin: 16,
    paddingBottom: 100
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  bioRow: {
    flexDirection: "row",
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 16,
  },
  bioContent: {
    flex: 1,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#B3B3B3",
    marginBottom: 8,
  },
  readMore: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#ffffff0f",
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: "row",
    marginVertical: 8,
  },
  stat: {
    paddingHorizontal: 12,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#A7A7A7",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  metaItem: {
    flex: 1,
    paddingHorizontal: 8,
  },
  metaLabel: {
    fontSize: 12,
    color: "#A7A7A7",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
  socialSection: {
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#777",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
});

export default ArtistBioFooter;