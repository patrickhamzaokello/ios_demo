import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import CustomTabs from '@/components/CustomTabs';
import { PlayerProvider } from '@/components/player/PlayerProvider';

export default function Layout() {
  return (
    <PlayerProvider>
      <Tabs 
        tabBar={props => <CustomTabs {...props} />} 
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="wallet" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </PlayerProvider>
  );
}