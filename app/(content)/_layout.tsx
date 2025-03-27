import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { Stack } from "expo-router"

const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false, headerTitle: '', headerBackTitle: 'Back', headerTintColor: 'white' }}></Stack>
};

export default function ContentLayout() {
  return (
      <StackLayout/>
  )
}
const sytles = StyleSheet.create({})