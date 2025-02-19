import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import type { Section, Release } from '../../types/home';

interface Props {
  data: Section;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PlaylistSection({ data }: Props) {
  if (!data?.featuredPlaylists) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{data.heading}</Text>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {data.featuredPlaylists.map((item, index) => (
            <AnimatedPressable 
            key={item.id}
              style={styles.releaseItem}
              entering={FadeInRight.delay(index * 100)}>
              <Image 
                source={{ uri: item.coverurl }}
                style={styles.artwork}
              />
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.artist}>{item.owner}</Text>
              <Text style={styles.tag}>{item.exclusive}</Text>
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
    width: 192,
  },
  artwork: {
    width: 192,
    height: 192,
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