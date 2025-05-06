import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  FadeInRight,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import type { Section } from "../../types/home";
import { Link, useRouter } from "expo-router";
import FastImage from "@d11/react-native-fast-image";
import { unknownTrackImageUri } from "@/constants/images";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_HEIGHT = CARD_WIDTH * 0.5;
const SPACING = 12;

interface Props {
  data: Section;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SliderSection({ data }: Props) {
  if (!data?.featured_sliderBanners) return null;

  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{data.heading}</Text>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {data.featured_sliderBanners.map((banner, index) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING),
            index * (CARD_WIDTH + SPACING),
            (index + 1) * (CARD_WIDTH + SPACING),
          ];

          const animatedStyle = useAnimatedStyle(() => {
            const scale = interpolate(
              scrollX.value,
              inputRange,
              [0.9, 1, 0.9],
              "clamp"
            );

            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.6, 1, 0.6],
              "clamp"
            );

            return {
              transform: [{ scale }],
              opacity,
            };
          });

          return (
            <AnimatedPressable
              key={banner.id}
              style={[styles.card, animatedStyle]}
              entering={FadeInRight.delay(index * 100)}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/(home)/home_playlist_details",
                  params: { playlist_id: banner.playlistID },
                })
              }
            >
              <FastImage
                source={{
                  uri: banner.imagepath ?? unknownTrackImageUri,
                  priority: FastImage.priority.normal,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            </AnimatedPressable>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: SPACING,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
