import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { AntDesign } from "@expo/vector-icons";
import Typo from "@/components/Typo";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

interface OnboardingScreen {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: any;
  backgroundColor: string;
}

const onboardingData: OnboardingScreen[] = [
  {
    id: 1,
    title: "Discover New Music",
    subtitle: "Your Journey Starts Here",
    description: "Explore millions of songs, discover new artists, and find your perfect soundtrack for every moment.",
    image: require("@/assets/images/welcome.jpg"),
    backgroundColor: "#1E3A8A",
  },
  {
    id: 2,
    title: "Create Your Vibe",
    subtitle: "Curate Your Sound",
    description: "Build personalized playlists, follow your favorite artists, and let our AI recommend music that matches your taste.",
    image: require("@/assets/images/welcome_2.jpg"),
    backgroundColor: "#7C3AED",
  },
  {
    id: 3,
    title: "Music Everywhere",
    subtitle: "Take It With You",
    description: "Download your favorites for offline listening and enjoy high-quality audio wherever you go.",
    image: require("@/assets/images/undraw_playlist_lwhi.png"),
    backgroundColor: "#059669",
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Mark onboarding as completed
      await SecureStore.setItemAsync("hasCompletedOnboarding", "true");
      router.replace("/(tabs)/(home)");
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as completed even when skipped
    await SecureStore.setItemAsync("hasCompletedOnboarding", "true");
    router.replace("/(tabs)/(home)");
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentScreen = onboardingData[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[currentScreen.backgroundColor, colors.background]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Skip Button */}
        <View style={styles.header}>
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Typo color={colors.white} size={16} fontWeight="600">
              Skip
            </Typo>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image source={currentScreen.image} style={styles.image} />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Typo 
              size={14} 
              color={colors.primary} 
              fontWeight="600" 
              style={styles.subtitle}
            >
              {currentScreen.subtitle}
            </Typo>
            
            <Typo 
              size={32} 
              color={colors.white} 
              fontWeight="800" 
              style={styles.title}
            >
              {currentScreen.title}
            </Typo>
            
            <Typo 
              size={16} 
              color={colors.neutral300} 
              style={styles.description}
            >
              {currentScreen.description}
            </Typo>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomContainer}>
          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: 
                      index === currentIndex ? colors.primary : colors.neutral600,
                    width: index === currentIndex ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            {currentIndex > 0 && (
              <Pressable onPress={handlePrevious} style={styles.navButton}>
                <AntDesign name="left" size={20} color={colors.neutral300} />
                <Typo color={colors.neutral300} size={16} fontWeight="600">
                  Back
                </Typo>
              </Pressable>
            )}

            <View style={styles.spacer} />

            <Pressable onPress={handleNext} style={styles.nextButton}>
              <Typo color={colors.white} size={16} fontWeight="600">
                {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
              </Typo>
              <AntDesign 
                name="right" 
                size={20} 
                color={colors.white} 
                style={{ marginLeft: 8 }}
              />
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._10,
  },
  skipButton: {
    paddingVertical: spacingY._8,
    paddingHorizontal: spacingX._16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY._40,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: spacingX._20,
  },
  subtitle: {
    marginBottom: spacingY._8,
    textAlign: "center",
  },
  title: {
    marginBottom: spacingY._16,
    textAlign: "center",
    lineHeight: 38,
  },
  description: {
    textAlign: "center",
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._30,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY._30,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral600,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._16,
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacingY._16,
    paddingHorizontal: spacingX._25,
    borderRadius: 12,
  },
});