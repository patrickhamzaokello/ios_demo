import React, { useEffect, useMemo } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

import AlbumHeader from "./AlbumHeader";
import RelatedAlbums from "./RelatedAlbums";
import { Track } from "@/types/playlist";
import { TracksList } from "../TracksList";
import { generateTracksListId } from "@/helpers/miscellaneous";
import { trackTitleFilter } from "@/helpers/filter";
import { useNavigationSearch } from "@/hooks/useNavigationSearch";
import { colors, fontSize, fontWeight, spacingX, spacingY, borderRadius } from '@/constants/theme';

// Constants from AlbumHeader to keep in sync
const { width } = Dimensions.get('window');
const ALBUM_ART_MAX_SIZE = width * 0.65;
const HEADER_MAX_HEIGHT = ALBUM_ART_MAX_SIZE + 180;
const HEADER_MIN_HEIGHT = 90;

interface AlbumDetailsProps {
  data: any; // API response type
  goBack: () => void;
  goMore: () => void;
}

const Album: React.FC<AlbumDetailsProps> = ({ 
  data, 
  goBack, 
  goMore,
}) => {
  const albumData = data?.Album?.[0] || {};
  const tracksData = data?.Album?.[1]?.Tracks || [];
  const relatedAlbums = data?.Album?.[2]?.ArtistAlbum || [];
  const credits = data?.Album?.[3] || {};

  const scrollY = useSharedValue(0);
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
    url: track.path, // Rename 'path' to 'url'
    artwork: track.artworkPath, // Rename 'artworkPath' to 'artwork'
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

  // Animation for content container to maintain proper spacing
  const contentContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY: -HEADER_MAX_HEIGHT + translateY }],
    };
  });

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
        onBack={goBack}
        onMore={goMore}
      />

      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_MAX_HEIGHT } // Add padding equal to header height
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.contentContainer, contentContainerStyle]}>
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
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Match with header background
  },
  scrollContent: {
    // Padding bottom accounts for tab bar or player
    paddingBottom: spacingY._40 + (Platform.OS === 'ios' ? 80 : 60),
  },
  contentContainer: {
    backgroundColor: '#121212', // Apple Music-like dark background
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: spacingY._20,
    // Move content up to overlap with header
    marginTop: -20,
    // Add shadow to create depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  tracksContainer: {
    marginBottom: spacingY._25,
  },
  tracksList: {
    paddingHorizontal: spacingX._15,
  },
  credits: {
    paddingHorizontal: spacingX._20,
    marginVertical: spacingY._30,
    alignItems: "center",
  },
  creditsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: "center",
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
});

export default Album;