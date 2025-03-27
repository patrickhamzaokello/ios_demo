import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import PlaylistDetails from '@/components/Playlist';

import { usePlaylistDetailsData } from '@/hooks/playlistDetailsData';

const playlist = () => {
    const { id, playlistName } = useLocalSearchParams<{ id: string; playlistName: string; }>();
    const { data, loading, error, refetch } = usePlaylistDetailsData(id);

  return (
    <ScreenWrapper>
      <ScrollView>
          {/* <Playlist playlistName={playlistName} id={id} /> */}
          <PlaylistDetails  playlistResponse={data} />

      </ScrollView>
    </ScreenWrapper>
  )
}

export default playlist

const styles = StyleSheet.create({})