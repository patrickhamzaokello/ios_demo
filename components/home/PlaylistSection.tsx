import { unknownTrackImageUri } from "@/constants/images";
import { colors, fontSize } from "@/constants/theme";
import FastImage from "@d11/react-native-fast-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import type { Section } from "../../types/home";

interface Props {
  data: Section;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PlaylistSection({ data }: Props) {
  if (!data?.featuredPlaylists) return null;
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headingContainer}>
          <LinearGradient
            colors={["#7C3AED", "#4F46E5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headingAccent}
          />
          <Text style={styles.heading}>{data.heading}</Text>
        </View>
      </View>
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
                pathname: "/(tabs)/(home)/playlistDetailsPage",
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
            <Text style={styles.artist} numberOfLines={1}>
              {item.owner}
            </Text>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headingAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
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
