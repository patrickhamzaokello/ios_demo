import React from 'react';
import { StyleSheet, Text, View, Image, Pressable, ScrollView } from 'react-native';
import { Play, Heart, MoreVertical, Clock } from 'lucide-react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import { MwonyaPlaylistDetailsResponse, Playlist, Track } from '@/types/playlist';
import { usePlayer } from '@/providers/PlayerProvider';

interface AlbumDetailsProps {
  playlistResponse: MwonyaPlaylistDetailsResponse | null;
}

const AlbumHeader: React.FC<{ albumData: Playlist }> = ({ albumData }) => {
  return (
    <View style={styles.header}>
      <Image source={{ uri: albumData.cover }} style={styles.coverArt} />
      <View style={styles.headerInfo}>
        <Text style={styles.playlistName}>{albumData.name}</Text>
        <Text style={styles.albumDetails}>
          {albumData.owner} • {albumData.total} songs
        </Text>
        <Text style={styles.description}>{albumData.description}</Text>
      </View>
    </View>
  );
};

const AlbumControls: React.FC<{ onPlayAll: () => void }> = ({ onPlayAll }) => {
  return (
    <View style={styles.controls}>
      <Pressable style={styles.playButton} onPress={onPlayAll}>
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

const TrackItem: React.FC<{ 
  track: Track; 
  index: number;
  onPress: (track: Track,  index: number) => void 
}> = ({ track, index, onPress }) => {
  return (
    <Pressable style={styles.trackItem} onPress={() => onPress(track, index)}>
      <Text style={styles.trackNumber}>{index + 1}</Text>
      <Image source={{ uri: track.artworkPath }} style={styles.trackArtwork} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{track.title}</Text>
        <Text style={styles.trackArtist}>{track.artist}</Text>
      </View>
      <Text style={styles.trackDuration}>{formatDuration(Number(track.duration))}</Text>
      <MoreVertical size={20} color="#666" />
    </Pressable>
  );
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AlbumDetails: React.FC<AlbumDetailsProps> = ({ playlistResponse }) => {
  const { playTrack, addToQueue } = usePlayer();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (playlistResponse) {
      setIsLoading(false);
    }
  }, [playlistResponse]);

  const handlePlayTrack = (track: Track, index: number) => {
    playTrack(track);

    // Add the rest of the tracks to the queue
    if (playlistResponse?.Playlists?.[1]?.Tracks) {
      addToQueue(playlistResponse.Playlists[1].Tracks.slice(index + 1));
    }
    
  };

  const handlePlayAll = () => {
    if (!playlistResponse?.Playlists?.[1]?.Tracks) return;
    
    const tracks = playlistResponse.Playlists[1].Tracks;
    if (tracks.length > 0) {
      playTrack(tracks[0]);
      addToQueue(tracks.slice(1));
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading album...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!playlistResponse || !playlistResponse.Playlists || playlistResponse.Playlists.length < 2) {
    return (
      <ScreenWrapper>
        <Text style={styles.errorText}>No album data available.</Text>
      </ScreenWrapper>
    );
  }

  const albumData = playlistResponse.Playlists[0];
  const tracks = playlistResponse.Playlists[1].Tracks;

  return (
    <ScreenWrapper>
      <ScrollView>
        <AlbumHeader albumData={albumData} />
        <AlbumControls onPlayAll={handlePlayAll} />

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
              onPress={handlePlayTrack}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

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

export default AlbumDetails;