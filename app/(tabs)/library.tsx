import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';


const Library = () => {
    const { id, playlistName } = useLocalSearchParams<{ id: string; playlistName: string; }>();
  return (
    <ScreenWrapper>
      <ScrollView>
          {/* <AlbumDetails playlistResponse={data}/> */}
      </ScrollView>
    </ScreenWrapper>
  )
}

export default Library

const styles = StyleSheet.create({})