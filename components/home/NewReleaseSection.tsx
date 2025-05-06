import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  FadeInRight,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { Section } from "../../types/home";
import { unknownTrackImageUri } from "@/constants/images";
import FastImage from "@d11/react-native-fast-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { BlurView } from "expo-blur";
import { colors } from "@/constants/theme";
import { usePlayerBackground } from "@/hooks/usePlayerBackground";

interface Props {
  data: Section;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export function NewReleaseSection({ data }: Props) {
  if (!data?.HomeRelease) return null;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>{data.heading}</Text>
        <Pressable>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>

      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={186}
      >
        {data.HomeRelease.map((item, index) => (
          <MusicCard
            key={item.id}
            item={item}
            index={index}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(home)/new_release",
                params: {
                  releaseid: item.id,
                },
              })
            }
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

function MusicCard({
  item,
  index,
  onPress,
}: {
  item: any;
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const elevation = useSharedValue(5);
  const dominantColor = useRef("rgba(20,20,20,0.8)");

  const { imageColors } = usePlayerBackground(
    item?.artworkPath ?? unknownTrackImageUri
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      shadowOpacity: interpolate(scale.value, [0.95, 1], [0.15, 0.25]),
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150 });
    elevation.value = withTiming(2, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
    elevation.value = withTiming(5, { duration: 200 });
  };

  return (
    <AnimatedPressable
      style={[styles.releaseItem, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      entering={FadeInRight.delay(index * 70).springify()}
    >
      <View style={styles.artworkContainer}>
        <LinearGradient
          colors={
            imageColors && imageColors.background && imageColors.primary
              ? [imageColors.background, imageColors.primary]
              : [colors.background, colors.background]
          }
          style={styles.cardBackground}
        />
        <View style={styles.artworkWrapper}>
          <AnimatedFastImage
            source={{
              uri: item.artworkPath ?? unknownTrackImageUri,
              priority: FastImage.priority.normal,
            }}
            style={styles.artwork}
            resizeMode="cover"
          />
          <BlurView intensity={15} style={styles.blurOverlay} tint="dark" />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.artist}>
          {item.artist}
        </Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>NEW RELEASE</Text>
          {item.explicit && (
            <View style={styles.explicitBadge}>
              <Text style={styles.explicitText}>E</Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "System",
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 15,
    color: colors.primary, // Apple Music pink accent
    fontWeight: "500",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  releaseItem: {
    marginRight: 16,
    width: 170,
    height: 280,
  },
  artworkContainer: {
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    height: 220,
    width: 170,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  artworkWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    position: "relative",
  },
  artwork: {
    width: 140,
    height: 140,
    borderRadius: 5,
  },
  blurOverlay: {
    position: "absolute",
    bottom: -60,
    left: 0,
    right: 0,
    height: 60,
    opacity: 0.5,
  },
  artworkOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  textContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
    fontFamily: "System",
  },
  artist: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 6,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  tag: {
    color: colors.primary, // Apple Music pink accent
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginRight: 6,
  },
  explicitBadge: {
    width: 14,
    height: 14,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  explicitText: {
    color: "#000",
    fontSize: 8,
    fontWeight: "700",
  },
});
