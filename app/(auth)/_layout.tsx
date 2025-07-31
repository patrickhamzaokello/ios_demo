import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { Stack } from "expo-router"


export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}></Stack>
  )
}
const sytles = StyleSheet.create({})