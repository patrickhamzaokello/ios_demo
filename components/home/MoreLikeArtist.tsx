import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { Section } from '../../types/home';

interface Props {
  data: Section;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MoreLikeArtistSection({ data }: Props) {
  if (!data?.featuredArtists) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{data.heading} {data.subheading}</Text>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {data.featuredArtists.map((item, index) => (
            <AnimatedPressable 
            key={item.id} 
              style={styles.artistItem}
              entering={FadeInUp.delay(index * 100)}>
              <Image 
                source={{ uri: item.profilephoto }}
                style={styles.profilePhoto}
              />
              <Text style={styles.name}>{item.name}</Text>
              {item.verified && (
                <Text style={styles.verified}>✓ Verified</Text>
              )}
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
  artistItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 96,
  },
  profilePhoto: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  name: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  verified: {
    color: '#63B3ED',
    fontSize: 12,
  },
});