import React from 'react'
import { Slot, Stack } from "expo-router"

const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false }}></Stack>
};

function ProfileLayout() {
  return (
    <StackLayout />
  )
}

export default ProfileLayout