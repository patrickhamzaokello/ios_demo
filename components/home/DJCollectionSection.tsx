import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import type { Section, Release } from '../../types/home';

interface Props {
  data: Section;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DJCollectionSection({ data }: Props) {
  if (!data?.FeaturedDjMixes) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{data.heading}</Text>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {data.FeaturedDjMixes.map((item, index) => (
            <AnimatedPressable 
            key={item.id}
              style={styles.releaseItem}
              entering={FadeInRight.delay(index * 100)}>
              <Image 
                source={{ uri: item.artworkPath }}
                style={styles.artwork}
              />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
              <Text style={styles.tag}>{item.tag}</Text>
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  releaseItem: {
    marginRight: 16,
    width: 100,
  },
  artwork: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  title: {
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '500',
  },
  artist: {
    color: '#CBD5E0',
  },
  tag: {
    color: '#A0AEC0',
    fontSize: 14,
  },
});