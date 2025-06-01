import { StyleSheet } from "react-native";
import { Redirect, Tabs } from "expo-router";
import CustomTabs from "@/components/CustomTabs";
import { PlayerProvider } from "@/providers/PlayerProvider";
import { useAuth } from "@/contexts/authContext";
import { FloatingPlayer } from "@/components/FloatingPlayer";

export default function TabsLayout() {
  // const { user } = useAuth();

  // if (!user) return <Redirect href="/login" />;
  return (
    <>
      <Tabs
        tabBar={(props) => <CustomTabs {...props} />}
        screenOptions={{
          headerShown: false,
          popToTopOnBlur: true,
          tabBarStyle: {
            backgroundColor: "#1F1F1F",
            borderTopColor: "#1F1F1F",
            borderTopWidth: 0,
            elevation: 0,
            paddingBottom: 4,
          },
        }}
      >
        <Tabs.Screen name="(home)" />
        <Tabs.Screen name="(search)" />
        <Tabs.Screen name="(library)" />
        <Tabs.Screen name="(profile)" />
      </Tabs>

      <FloatingPlayer
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          bottom: 95,
        }}
      />
    </>
  );
}
