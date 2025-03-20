import React from 'react';
import { StyleSheet, Text, View, Image, Pressable, ScrollView } from 'react-native';
import { Play, Heart, MoreVertical, Clock } from 'lucide-react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { MwonyaPlaylistDetailsResponse, Playlist, Track } from '@/types/playlist';

interface PlaylistDetailsProps {
  playlistData: Playlist;
}

const PlaylistHeader: React.FC<PlaylistDetailsProps> = ({ playlistData }) => {
  return (
    <View style={styles.header}>
      <Image
        source={{ uri: playlistData.cover }}
        style={styles.coverArt}
      />
      <View style={styles.headerInfo}>
        <Typo style={styles.playlistName}>{playlistData.name}</Typo>
        <Typo style={styles.albumDetails}>
          {playlistData.owner} • {playlistData.total} songs
        </Typo>
        <Text style={styles.description}>{playlistData.description}</Text>
      </View>
    </View>
  );
};

const PlaylistControls = () => {
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

const TrackItem: React.FC<{ track: Track; index: number }> = ({ track, index }) => {
  return (
    <Pressable style={styles.trackItem} onPress={() => console.log('Track pressed')}>
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

const PlaylistDetails: React.FC<{ playlistResponse: MwonyaPlaylistDetailsResponse | null }> = ({ playlistResponse }) => {
  if (!playlistResponse || !playlistResponse.Playlists || playlistResponse.Playlists.length < 2) {
    return (
      <ScreenWrapper>
        <Text style={styles.errorText}>No PlaylistDetails data available.</Text>
      </ScreenWrapper>
    );
  }

  // Take the first playlist from the response for PlaylistDetails details
  const playlistData = playlistResponse.Playlists[0];
  // Take the tracks from the second element in the Playlists array
  const tracks = playlistResponse.Playlists[1].Tracks;

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <PlaylistHeader playlistData={playlistData} />
        <PlaylistControls />

        <View style={styles.trackList}>
          <View style={styles.trackListHeader}>
            <Text style={styles.trackListTitle}>Songs</Text>
            <Clock size={16} color="#666" />
          </View>

          {tracks?.map((track, index) => (
            <TrackItem
              key={track.id}
              track={track}
              index={index}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default PlaylistDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    gap: 12,
  },
  trackNumber: {
    width: 30,
    color: '#666',
  },
  trackArtwork: {
    width: 45,
    height: 45,
    borderRadius: 4,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  trackArtist: {
    fontSize: 14,
    color: '#666',
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