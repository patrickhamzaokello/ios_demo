import { unknownTrackImageUri } from "@/constants/images";
import { colors, fontSize } from "@/constants/theme";
import FastImage from "@d11/react-native-fast-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { Section } from "../../types/home";

const { width: screenWidth } = Dimensions.get("window");

interface Props {
  data: Section;
}
// image size  asp ratio 8:5 800px by 500px

export function SliderSection({ data }: Props) {
  if (!data?.featured_sliderBanners) return null;

  const router = useRouter();

  const SliderBannerCard = ({
    item,
  }: {
    item: {
      id?: string;
      playlistID?: string;
      imagepath?: string;
      title?: string;
      subtitle?: string;
      description?: string;
    };
  }) => (
    <TouchableOpacity
      style={styles.bannerCard}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/(home)/home_playlist_details",
          params: { playlist_id: item.playlistID || item.id },
        })
      }
    >
      <FastImage
        source={{
          uri: item.imagepath ?? unknownTrackImageUri,
          priority: FastImage.priority.normal,
        }}
        style={styles.bannerArtwork}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.bannerGradient}
      />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>
          {item.title || "Featured Playlist"}
        </Text>
        {item.subtitle && (
          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        )}
        {item.description && (
          <Text style={styles.bannerDescription}>{item.description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

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
      <FlatList
        data={data.featured_sliderBanners}
        renderItem={({ item }) => (
          <SliderBannerCard item={{ ...item, id: item.id?.toString() }} />
        )}
        keyExtractor={(item) =>
          Math.random().toString()
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
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
  horizontalList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  bannerCard: {
    width: screenWidth * 0.8,
    height: 200,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.neutral800,
    position: "relative",
  },
  bannerArtwork: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  bannerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  bannerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  bannerTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: fontSize.md,
    fontWeight: "500",
    color: colors.textLight,
    marginBottom: 2,
  },
  bannerDescription: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    opacity: 0.8,
  },
});
