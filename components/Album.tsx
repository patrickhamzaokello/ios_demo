import React from 'react';
import { StyleSheet, Text, View, Image, Pressable, ScrollView } from 'react-native';
import { Play, Heart, MoreVertical, Clock } from 'lucide-react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { MwonyaPlaylistDetailsResponse, Playlist, Track } from '@/types/playlist';
import { FlatList } from 'react-native';
import { usePlayer } from '@/providers/PlayerProvider';

interface AlbumDetailsProps {
  albumData: Playlist;
}

const AlbumHeader: React.FC<AlbumDetailsProps> = ({ albumData }) => {
  return (
    <View style={styles.header}>
      <Image
        source={{ uri: albumData.cover }}
        style={styles.coverArt}
      />
      <View style={styles.headerInfo}>
        <Typo style={styles.playlistName}>{albumData.name}</Typo>
        <Typo style={styles.albumDetails}>
          {albumData.owner} • {albumData.total} songs
        </Typo>
        <Text style={styles.description}>{albumData.description}</Text>
      </View>
    </View>
  );
};

const AlbumControls = () => {
  return (
    <View style={styles.controls}>
      <Pressable style={styles.playButton}>
        <Play fill="white" size={22} />
        <Text style={styles.playText}>Play</Text>
      </Pressable>
      <View style={styles.actionButtons}>
        <Heart size={28} color="#666" />
        <MoreVertical size={28} color="#666" />
      </View>
    </View>
  );
};

// Move the TrackItem component inside the parent component where usePlayer is already available
const AlbumDetails: React.FC<{ playlistResponse: MwonyaPlaylistDetailsResponse | null }> = ({ playlistResponse }) => {
  // Move the usePlayer hook here, at the top level of the component
  const { setCurrentTrack } = usePlayer();
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Effect to handle initial loading state
  React.useEffect(() => {
    if (playlistResponse) {
      setIsLoading(false);
    }
  }, [playlistResponse]);
  
  // Define TrackItem inside the parent component
  const TrackItem = ({ track, index }: { track: Track; index: number }) => {
    return (
      <Pressable style={styles.trackItem} onPress={() => { setCurrentTrack(track);  }}>
        <Text style={styles.trackNumber}>{index + 1}</Text>
        <Image
          source={{ uri: track.artworkPath }}
          style={styles.trackArtwork}
        />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{track.title}</Text>
          <Text style={styles.trackArtist}>{track.artist}</Text>
        </View>
        <Text style={styles.trackDuration}>
          {track.duration}
        </Text>
        <MoreVertical size={20} color="#666" />
      </Pressable>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading album...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Error state
  if (!playlistResponse || !playlistResponse.Playlists || playlistResponse.Playlists.length < 2) {
    return (
      <ScreenWrapper>
        <Text style={styles.errorText}>No album data available.</Text>
      </ScreenWrapper>
    );
  }

  // Take the first playlist from the response for album details
  const albumData = playlistResponse.Playlists[0];
  // Take the tracks from the second element in the Playlists array
  const tracks = playlistResponse.Playlists[1].Tracks;

  return (
    <ScreenWrapper>
      <ScrollView>
        <AlbumHeader albumData={albumData} />
        <AlbumControls />

        <View style={styles.trackList}>
          <View style={styles.trackListHeader}>
            <Text style={styles.trackListTitle}>Songs</Text>
            <Clock size={16} color="#666" />
          </View>
          {tracks?.map((track, index) => (
            <TrackItem
              key={track.id || index}
              track={track}
              index={index}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default AlbumDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  coverArt: {
    width: 240,
    height: 240,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerInfo: {
    alignItems: 'center',
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  albumDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF2D55',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  playText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  trackList: {
    paddingHorizontal: 20,
    marginBottom: 30
  },
  trackListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  trackListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 0,
  },
  trackNumber: {
    width: 30,
    color: '#666',
  },
  trackArtwork: {
    width: 50,
    height: 50,
    borderRadius: 5,
    aspectRatio: 1,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  trackArtist: {
    color: 'grey',
  },
  trackDuration: {
    color: '#666',
    marginRight: 12,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});