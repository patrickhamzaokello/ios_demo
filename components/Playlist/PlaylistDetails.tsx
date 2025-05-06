import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";

import { TracksList } from "../TracksList";
import { generateTracksListId } from "@/helpers/miscellaneous";
import { trackTitleFilter } from "@/helpers/filter";
import { useNavigationSearch } from "@/hooks/useNavigationSearch";
import Typo from "../Typo";
import FastImage from "@d11/react-native-fast-image";
import { unknownTrackImageUri } from "@/constants/images";
import { colors } from "@/constants/theme";
import BackButton from "../BackButton";
import MoreButton from "../MoreButton";
import { MwonyaPlaylistDetailsResponse } from "@/types/playlist";

const { width } = Dimensions.get("window");
export const ALBUM_ART_SIZE = width * 0.65;

interface PlaylistDetailsProps {
  data: MwonyaPlaylistDetailsResponse;
  goBack: () => void;
  goMore: () => void;
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({ data, goBack, goMore }) => {
  const playlistData = data?.Playlists?.[0] || {};
  const tracksData = data?.Playlists?.[1]?.Tracks || [];

  const search = useNavigationSearch({
    searchBarOptions: {
      placeholder: "Find in songs",
    },
  });

  const tracks = tracksData.map((track: any) => ({
    ...track,
    url: track.path,
    artwork: track.artworkPath,
  }));

  const filteredTracks = useMemo(() => {
    if (!search) return tracks;
    return tracks.filter(trackTitleFilter(search));
  }, [search, tracks]);


  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          {/* Navigation Bar */}
          <View style={styles.navBar}>

            <BackButton />

            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {playlistData.name}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {playlistData.owner}
              </Text>
            </View>

            <MoreButton />
          </View>

          {/* Album Artwork */}
          <View style={styles.artworkContainer}>
            <FastImage
              source={{
                uri: playlistData.cover ?? unknownTrackImageUri,
                priority: FastImage.priority.normal,
              }}
              style={styles.artwork}
              resizeMode="cover"
            />

        
          </View>

          {/* Album Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.titleText} numberOfLines={2}>
              {playlistData.name}
            </Text>

            <Text style={styles.artistText} numberOfLines={3}>
              {playlistData.description}
            </Text>
            <Text style={styles.infoText}>
              {'Playlist'} • {" "}
              {playlistData.total || tracksData.length} Tracks
            </Text>

            {playlistData.owner && (
              <Text style={styles.description} numberOfLines={3}>
                {playlistData.owner}
              </Text>
            )}
          </View>
        </View>

        {filteredTracks.length > 0 && (
          <View style={styles.tracksContainer}>
            <TracksList
              id={generateTracksListId("songs", search)}
              tracks={filteredTracks}
              scrollEnabled={false}
            />
          </View>
        )}


          <View style={styles.credits}>
            <Typo style={styles.creditsMwonyaText}>Mwonya Media Uganda</Typo>
          </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === "ios" ? 80 : 60,
  },
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
    backgroundColor: "rgba(12, 12, 12, 0.14)",

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
  exculsive: {
    fontSize: 14,
    color: "#000",
    backgroundColor: "#FFFF00",
    textAlign: "center",
    paddingHorizontal: 4,
    borderRadius: 5,
    position: "absolute",
    top: 5,
    left: 5,
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
    height: "100%",
    borderRadius: 8,
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
    color: "rgba(255, 255, 255, 0.37)",
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 20,
  },
  contentContainer: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  tracksContainer: {
    marginBottom: 25,
  },

  credits: {
    paddingHorizontal: 20,
    marginVertical: 50,
  },
  creditsText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    lineHeight: 18,
  },
  creditsMwonyaText:{
    color: "rgba(255, 255, 255, 0.32)",
    fontSize: 14,
    lineHeight: 18,
    marginTop: 10
  },
});

export default PlaylistDetails;
