import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link, useRouter } from "expo-router";
import Animated, { FadeInRight } from 'react-native-reanimated';
import type { Section, Release } from '../../types/home';
import FastImage from '@d11/react-native-fast-image';
import { unknownTrackImageUri } from '@/constants/images';
import { colors, fontSize } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  data: Section;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DJCollectionSection({ data }: Props) {
   const router = useRouter();
  if (!data?.FeaturedDjMixes) return null;

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
        contentContainerStyle={styles.scrollContent}>
        {data.FeaturedDjMixes.map((item, index) => (
             <AnimatedPressable
             key={item.id}
             style={styles.releaseItem}
             onPress={() =>
               router.push({
                 pathname: "/(tabs)/(home)/albumDetailsPage",
                 params: { releaseid: item.id },
               })
             }
             entering={FadeInRight.delay(index * 100)}
           >
             <FastImage
               source={{
                 uri: item.artworkPath ?? unknownTrackImageUri,
                 priority: FastImage.priority.normal,
               }}
               style={styles.artwork}
               resizeMode="cover"
             />
             <Text style={styles.title} numberOfLines={1}>
               {item.title}
             </Text>
             <Text style={styles.artist}>{item.artist}</Text>
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
    marginRight: 24,
    width: 150,
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