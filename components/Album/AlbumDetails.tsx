import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import AlbumHeader from "./AlbumHeader";
import RelatedAlbums from "./RelatedAlbums";
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

const { width } = Dimensions.get("window");
export const ALBUM_ART_SIZE = width * 0.65;

interface AlbumDetailsProps {
  data: any;
  goBack: () => void;
  goMore: () => void;
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({ data, goBack, goMore }) => {
  const albumData = data?.Album?.[0] || {};
  const tracksData = data?.Album?.[1]?.Tracks || [];
  const relatedAlbums = data?.Album?.[2]?.ArtistAlbum || [];
  const credits = data?.Album?.[3] || {};

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
                {albumData.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {albumData.artistName}
              </Text>
            </View>

            <MoreButton />
          </View>

          {/* Album Artwork */}
          <View style={styles.artworkContainer}>
            <FastImage
              source={{
                uri: albumData.artworkPath ?? unknownTrackImageUri,
                priority: FastImage.priority.normal,
              }}
              style={styles.artwork}
              resizeMode="cover"
            />

            {albumData.exclusive && (
              <View style={styles.exculsive}>
                <Text numberOfLines={1}>Exclusive</Text>
              </View>
            )}
          </View>

          {/* Album Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.titleText} numberOfLines={2}>
              {albumData.title}
            </Text>

            <Text style={styles.artistText} numberOfLines={1}>
              {albumData.artistName}
            </Text>
            <Text style={styles.infoText}>
              {albumData.tag}• {albumData.genreName} •{" "}
              {parseInt(albumData.tracks_count) || tracksData.length} Tracks
            </Text>

            {albumData.description && (
              <Text style={styles.description} numberOfLines={3}>
                {albumData.description}
              </Text>
            )}
          </View>
        </View>

        {filteredTracks.length > 0 && (
          <View style={styles.tracksContainer}>
            <TracksList
              id={generateTracksListId(albumData.id, search)}
              tracks={filteredTracks}
              scrollEnabled={false}
            />
          </View>
        )}

        {relatedAlbums.length > 0 && (
          <RelatedAlbums
            title={data?.Album?.[2]?.heading || "More from this artist"}
            albums={relatedAlbums}
          />
        )}

        {credits?.description && (
          <View style={styles.credits}>
            <Typo style={styles.creditsText}>{credits.description}</Typo>
            <Typo style={styles.creditsMwonyaText}>Mwonya Media Uganda</Typo>
          </View>
        )}
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

export default AlbumDetails;
