import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';

import { useAlbumDetailsData } from '@/hooks/albumDetailsData';
import AlbumDetails from '@/components/Album';

const album = () => {
    const { id, playlistName } = useLocalSearchParams<{ id: string; playlistName: string; }>();
   const { data, loading, error, refetch } = useAlbumDetailsData(id);
  return (
    <ScreenWrapper>
      <ScrollView>
          <AlbumDetails playlistResponse={data}/>
      </ScrollView>
    </ScreenWrapper>
  )
}

export default album

const styles = StyleSheet.create({})