import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import Animated, { FadeInRight } from "react-native-reanimated";
import type { Section, Release } from "../../types/home";
import FastImage from "@d11/react-native-fast-image";
import { unknownTrackImageUri } from "@/constants/images";
import { colors, fontSize } from "@/constants/theme";

interface Props {
  data: Section;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PlaylistSection({ data }: Props) {
  if (!data?.featuredPlaylists) return null;
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{data.heading}</Text>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.featuredPlaylists.map((item, index) => (
          <AnimatedPressable
            key={item.id}
            style={styles.releaseItem}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(home)/home_playlist_details",
                params: { playlist_id: item.id },
              })
            }
            entering={FadeInRight.delay(index * 100)}
          >
            <FastImage
              source={{
                uri: item.coverurl ?? unknownTrackImageUri,
                priority: FastImage.priority.normal,
              }}
              style={styles.artwork}
              resizeMode="cover"
            />
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>{item.owner}</Text>
          </AnimatedPressable>
        ))}
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
  },
  releaseItem: {
    marginRight: 16,
    width: 160,
  },
  artwork: {
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: fontSize.lg,
    marginTop: 10,
    fontWeight: "500",
  },
  artist: {
    marginTop: 5,
    fontSize: fontSize.md,
    color: colors.neutral500,
  },
  tag: {
    color: "#A0AEC0",
    fontSize: 14,
  },
});
