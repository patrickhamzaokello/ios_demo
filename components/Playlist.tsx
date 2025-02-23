import { StyleSheet, Text, View, Image, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { Play, Heart, MoreVertical, Clock } from 'lucide-react-native'

const PlaylistHeader = ({ playlist }) => {
  return (
    <View style={styles.header}>
      <Image
        source={{ uri: playlist.cover }}
        style={styles.coverArt}
      />
      <View style={styles.headerInfo}>
        <Typo style={styles.playlistName}>{playlist.name}</Typo>
        <Typo style={styles.playlistDetails}>
          {playlist.owner} • {playlist.total} songs
        </Typo>
        <Text style={styles.description}>{playlist.description}</Text>
      </View>
    </View>
  )
}

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
  )
}

const TrackItem = ({ track, index }) => {
  return (
    <Pressable style={styles.trackItem}>
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
  )
}

const PlaylistDetails = () => {
  const { id, playlistName } = useLocalSearchParams<{
    id: string
    playlistName: string
  }>()

  // Mock data - replace with your API call
  const playlist = {
    id: "mwP_mobile6b2496c8fe",
    name: "New Music Fridays",
    owner: "Mwonya",
    cover: "https://assets.mwonya.com/RawFiles/Instagram post - 392.png",
    description: "Every Friday, immerse yourself in the latest beats carefully curated for your sonic pleasure. #FreshFridays #WeeklySoundtrack",
    total: 52,
    tracks: [{
      id: "mwT_mobile6b2496c8fe",
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      artworkPath: "https://assets.mwonya.com/RawFiles/Instagram post - 392.png",
      duration: "2:58",
    },{
      id: "mwT_mobile6b2496c8fe",
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      artworkPath: "https://assets.mwonya.com/RawFiles/Instagram post - 392.png",
      duration: "2:58",
    },{
      id: "mwT_mobile6b2496c8fe",
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      artworkPath: "https://assets.mwonya.com/RawFiles/Instagram post - 392.png",
      duration: "2:58",
    }] // Your tracks array
  }

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <PlaylistHeader playlist={playlist} />
        <PlaylistControls />

        <View style={styles.trackList}>
          <View style={styles.trackListHeader}>
            <Text style={styles.trackListTitle}>Songs</Text>
            <Clock size={16} color="#666" />
          </View>

          {playlist.tracks?.map((track, index) => (
            <TrackItem
              key={track.id}
              track={track}
              index={index}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

export default PlaylistDetails

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
  playlistDetails: {
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
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  trackArtist: {
    fontSize: 14,
    color: '#666',
  },
  trackDuration: {
    color: '#666',
    marginRight: 12,
  },
})