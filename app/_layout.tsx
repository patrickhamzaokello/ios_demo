import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { Slot, Stack } from "expo-router"
import { AuthProvider } from "@/contexts/authContext"
import { PlayerProvider } from "@/providers/PlayerProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false }}></Stack>
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <AuthProvider>
        <PlayerProvider>
          <StackLayout />
        </PlayerProvider>
      </AuthProvider>

    </GestureHandlerRootView>
  )
}
const sytles = StyleSheet.create({})