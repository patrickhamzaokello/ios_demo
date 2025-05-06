// Album.js
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from "react-native-reanimated";
import { debounce } from "lodash";

import AlbumHeader from "./AlbumHeader";
import RelatedAlbums from "./RelatedAlbums";
import { TracksList } from "../TracksList";
import { generateTracksListId } from "@/helpers/miscellaneous";
import { trackTitleFilter } from "@/helpers/filter";
import { useNavigationSearch } from "@/hooks/useNavigationSearch";

// Shared constants - moved to a single location to ensure consistency
const { width } = Dimensions.get("window");
export const ALBUM_ART_MAX_SIZE = width * 0.65;
export const ALBUM_ART_MIN_SIZE = 45;
export const HEADER_MIN_HEIGHT = 70;

interface AlbumDetailsProps {
  data: any; // API response type
  goBack: () => void;
  goMore: () => void;
}

const Album: React.FC<AlbumDetailsProps> = ({ data, goBack, goMore }) => {
  const albumData = data?.Album?.[0] || {};
  const tracksData = data?.Album?.[1]?.Tracks || [];
  const relatedAlbums = data?.Album?.[2]?.ArtistAlbum || [];
  const credits = data?.Album?.[3] || {};

  // Shared animated values for the header and scroll view
  const scrollY = useSharedValue(0);
  const headerMaxHeight = useSharedValue(0);
  const scrollThreshold = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const search = useNavigationSearch({
    searchBarOptions: {
      placeholder: "Find in songs",
    },
  });

  // Format tracks data
  const tracks = tracksData.map((track: any) => ({
    ...track,
    url: track.path,
    artwork: track.artworkPath,
  }));

  const filteredTracks = useMemo(() => {
    if (!search) return tracks;
    return tracks.filter(trackTitleFilter(search));
  }, [search, tracks]);

  // Calculate proper release date format
  const formattedReleaseDate = useMemo(() => {
    if (!albumData.datecreated) return "";

    try {
      const date = new Date(albumData.datecreated);
      return date.getFullYear().toString();
    } catch (error) {
      return albumData.datecreated;
    }
  }, [albumData.datecreated]);

  // Debounce header height updates
  const handleHeaderHeight = useMemo(
    () => debounce((height: number) => {
      // No need to keep a separate state since we're using a shared value
      console.log("Header height updated:", height);
    }, 50),
    []
  );

  return (
    <View style={styles.container}>
      <AlbumHeader
        artwork={albumData.artworkPath}
        title={albumData.title}
        artist={albumData.artistName}
        releaseDate={formattedReleaseDate}
        trackCount={parseInt(albumData.tracks_count) || tracksData.length}
        description={albumData.description}
        scrollY={scrollY}
        headerMaxHeight={headerMaxHeight}
        scrollThreshold={scrollThreshold}
        onBack={goBack}
        onMore={goMore}
        onHeaderHeight={handleHeaderHeight}
      />

      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* We're adding this spacer with exact header max height for content positioning */}
        <Animated.View 
          style={{
            height: headerMaxHeight,
          }}
        />

        <View style={styles.contentContainer}>
          {/* Tracks List */}
          {filteredTracks.length > 0 && (
            <View style={styles.tracksContainer}>
              <TracksList
                id={generateTracksListId("songs", search)}
                tracks={filteredTracks}
                scrollEnabled={false}
                style={styles.tracksList}
              />
            </View>
          )}

          {/* Related Albums */}
          {relatedAlbums.length > 0 && (
            <RelatedAlbums
              title={data?.Album?.[2]?.heading || "More from this artist"}
              albums={relatedAlbums}
            />
          )}

          {/* Credits */}
          {credits?.description && (
            <View style={styles.credits}>
              <Animated.Text style={styles.creditsText}>
                {credits.description}
              </Animated.Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Match with header background
  },
  scrollContent: {
    // No paddingTop needed anymore - we use a spacer view instead
    paddingBottom: Platform.OS === "ios" ? 80 : 60,
  },
  contentContainer: {
    backgroundColor: "#121212", // Apple Music-like dark background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    // Position the content container to create a nice overlap effect
    marginTop: -25,
    paddingBottom: 40,
    // Add shadow to create depth
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  tracksContainer: {
    marginBottom: 25,
  },
  tracksList: {
    paddingHorizontal: 15,
  },
  credits: {
    paddingHorizontal: 20,
    marginVertical: 30,
    alignItems: "center",
  },
  creditsText: {
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 18,
  },
});

export default Album;