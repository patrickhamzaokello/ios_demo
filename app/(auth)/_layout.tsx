import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { Stack } from "expo-router"
import { AuthProvider } from "@/contexts/authContext"

const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false }}></Stack>
};

export default function RootLayout() {
  return (
      <StackLayout/>
  )
}
const sytles = StyleSheet.create({})