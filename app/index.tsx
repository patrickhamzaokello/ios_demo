import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'

const index = () => {
  return (
    <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20 }}>Welcome to the Mwonya!</Text>
        </View>
    </ScreenWrapper>
  )
}

export default index

const styles = StyleSheet.create({})