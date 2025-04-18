import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler,
  useAnimatedRef
} from 'react-native-reanimated';
import { colors, spacingY } from '@/constants/theme';

import AlbumHeader from './AlbumHeader';
import TrackList from './TrackList';
import RelatedAlbums from './RelatedAlbums';

interface AlbumDetailsProps {
  data: any; // API response type
  goBack: () => void;
}

// Get dynamic dimensions
const { width } = Dimensions.get('window');
const ALBUM_ART_MAX_SIZE = width * 0.65;
const HEADER_MAX_HEIGHT = ALBUM_ART_MAX_SIZE + 200; // Same as in AlbumHeader
const HEADER_MIN_HEIGHT = 90;

const Album: React.FC<AlbumDetailsProps> = ({ data, goBack }) => {
  const albumData = data?.Album?.[0] || {};
  const tracksData = data?.Album?.[1]?.Tracks || [];
  const relatedAlbums = data?.Album?.[2]?.ArtistAlbum || [];
  const credits = data?.Album?.[3] || {};

  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Empty View with height equal to HEADER_MAX_HEIGHT acts as spacing */}
        <View style={{ height: HEADER_MAX_HEIGHT }} />
        
        {/* Content always starts after the header */}
        <View style={styles.contentContainer}>
          <TrackList tracks={tracksData} />
          
          {relatedAlbums.length > 0 && (
            <RelatedAlbums 
              title={data?.Album?.[2]?.heading || "More from this artist"} 
              albums={relatedAlbums}
            />
          )}

          {credits?.description && (
            <View style={styles.credits}>
              <Animated.Text style={styles.creditsText}>
                {credits.description}
              </Animated.Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Header is placed above the ScrollView in the component tree but appears visually on top due to zIndex */}
      <AlbumHeader
        artwork={albumData.artworkPath}
        title={albumData.title}
        artist={albumData.artistName}
        releaseDate={albumData.datecreated}
        trackCount={albumData.tracks_count}
        totalPlays={albumData.totaltrackplays}
        description={albumData.description}
        scrollY={scrollY}
        onBack={goBack}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacingY._40,
  },
  contentContainer: {
    paddingTop: spacingY._17,
  },
  credits: {
    paddingHorizontal: 20,
    marginVertical: spacingY._30,
    alignItems: 'center',
  },
  creditsText: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default Album;