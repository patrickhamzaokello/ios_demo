import React from 'react'
import { Slot, Stack } from "expo-router"
import { AuthProvider } from '@/contexts/authContext' // Adjust path as needed

const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false }}></Stack>
};

function ProfileLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  )
}

export default ProfileLayout