import { View, Text, Image, StyleSheet, Pressable, Dimensions, Platform } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import type { Section } from "../../types/home";
import { colors } from "@/constants/theme";
import { useMemo } from "react";

interface Props {
  data: Section;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_PADDING = 16;
const GRID_SPACING = 12;
const COLUMNS = 2;
const IMAGE_SIZE = 50;
const ITEM_WIDTH = (SCREEN_WIDTH - (GRID_PADDING * 2) - (GRID_SPACING * (COLUMNS - 1))) / COLUMNS;

export function TrendingSection({ data }: Props) {
  if (!data?.Tracks) return null;

  const gridItems = useMemo(() => {
    return data.Tracks?.map((item: any, index: number) => {
      if (!item?.title) return null;

      return (
        <AnimatedPressable
          key={item.id}
          style={[
            styles.trackItem,
            index % 2 === 1 && { marginLeft: GRID_SPACING }
          ]}
          entering={FadeIn.delay(index * 50)}
          onPress={() => {/* Handle press */}}
        >
          <View style={styles.rankBadge}>
            <Text style={styles.index}>{index + 1}</Text>
          </View>
          
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.artworkPath }}
              style={styles.artwork}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.details}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {item.artist}
            </Text>
          </View>
        </AnimatedPressable>
      );
    });
  }, [data.Tracks]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{data.heading}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.seeAllButton,
            pressed && styles.seeAllButtonPressed
          ]}
        >
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>

      <View style={styles.gridContainer}>
        {gridItems}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: GRID_PADDING,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  seeAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  seeAllButtonPressed: {
    opacity: 0.7,
  },
  seeAll: {
    fontSize: 14,
    color: "#A0AEC0",
    fontWeight: "500",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  trackItem: {
    width: ITEM_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: GRID_SPACING,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      },
    }),
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  rankBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 1,
  },
  index: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  artist: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
});