import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/authContext";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const index = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const hasCompletedOnboarding = await SecureStore.getItemAsync("hasCompletedOnboarding");
        
        if (accessToken) {
          // User is authenticated
          if (hasCompletedOnboarding) {
            router.replace("/(tabs)/(home)");
          } else {
            router.replace("/(auth)/onboarding");
          }
        } else {
          // User is not authenticated
          router.replace("/(auth)/welcome");
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        router.replace("/(auth)/welcome");
      }
    };

    // Add a small delay to show the logo briefly
    const timer = setTimeout(() => {
      checkAuthAndRedirect();
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require("@/assets/images/mwonya_new_logo.png")}
        />
        <Text style={{ color: "white", fontSize: 20 }}>Mwonya</Text>
      </View>
    </ScreenWrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: {
    height: "20%",
    aspectRatio: 1,
  },
});
