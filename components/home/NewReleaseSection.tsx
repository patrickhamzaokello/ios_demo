import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  FadeIn,
  ZoomIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { unknownTrackImageUri } from "@/constants/images";
import FastImage from "@d11/react-native-fast-image";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerBackground } from "@/hooks/usePlayerBackground";
import { colors } from "@/constants/theme";

interface Props {
  data: any;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export function NewReleaseSection({ data }: Props) {
  if (!data?.HomeRelease) return null;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
                <View style={styles.headingContainer}>
                  <LinearGradient
                    colors={["#7C3AED", "#4F46E5"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headingAccent}
                  />
                  <Text style={styles.heading}>{data.heading}</Text>
                </View>
        <Pressable style={styles.seeAllButton}>
          <Text style={styles.seeAll}>See All</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>

      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={210}
        pagingEnabled={false}
      >
        {data.HomeRelease.map((item: any, index: number) => (
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
  const rotation = useSharedValue(0);
  
  const { imageColors } = usePlayerBackground(
    item?.artworkPath ?? unknownTrackImageUri
  );
  
  const primaryColor = imageColors?.primary || colors.primary;
  const backgroundColor = imageColors?.background || colors.background;
  const textColor = "#FFFFFF"; // Default text color since 'text' property is not available

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotation.value}deg` }
      ],
      shadowOpacity: interpolate(scale.value, [0.95, 1], [0.2, 0.4]),
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { 
      duration: 150,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    rotation.value = withTiming(-1, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { 
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    rotation.value = withTiming(0, { duration: 250 });
  };

  return (
    <AnimatedPressable
      style={[styles.releaseItem, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      entering={ZoomIn.delay(index * 100).springify()}
    >
      <LinearGradient
        colors={[backgroundColor, 'rgba(0,0,0,0.8)']}
        style={styles.cardContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.artworkContainer}>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 500, delay: index * 100 }}
            style={styles.imageWrapper}
          >
            <AnimatedFastImage
              source={{
                uri: item.artworkPath ?? unknownTrackImageUri,
                priority: FastImage.priority.high,
              }}
              style={styles.artwork}
              resizeMode="cover"
            />
          </MotiView>
          
          {item.explicit && (
            <View style={[styles.explicitBadge, { backgroundColor: primaryColor }]}>
              <Text style={styles.explicitText}>E</Text>
            </View>
          )}
        </View>

        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.23)', 'rgba(0, 0, 0, 0.17)']}
          style={styles.textGradient}
        >
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={[styles.title, { color: textColor }]}>
              {item.title}
            </Text>
            <Text numberOfLines={1} style={styles.artist}>
              {item.artist}
            </Text>
            
            <View style={styles.tagContainer}>
              <View style={[styles.releaseTag, { backgroundColor: primaryColor }]}>
                <Text style={styles.tagText}>NEW</Text>
              </View>
              <Ionicons name="play-circle" size={18} color={primaryColor} style={styles.playIcon} />
            </View>
          </View>
        </LinearGradient>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
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
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAll: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "600",
    marginRight: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  releaseItem: {
    marginRight: 20,
    width: 190,
    height: 260,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  cardContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  artworkContainer: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    paddingTop: 10,
  },
  imageWrapper: {
    width: 160,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  artwork: {
    width: "100%",
    height: "100%",
  },
  textGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    justifyContent: "flex-end",
  },
  textContainer: {
    padding: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: "System",
  },
  artist: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  releaseTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  tagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.5,
  },
  explicitBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 18,
    height: 18,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  explicitText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "800",
  },
  playIcon: {
    marginLeft: 4,
  },
});