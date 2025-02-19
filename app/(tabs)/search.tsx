import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import SearchScreen from '@/components/search/searchFeed'

const Search = () => {
  return (
    <ScreenWrapper>
      <SearchScreen />
    </ScreenWrapper>
  )
}

export default Search

const styles = StyleSheet.create({})