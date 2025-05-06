import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { Section } from '../../types/home';
import { useState } from 'react';
import { unknownTrackImageUri } from '@/constants/images';
import FastImage from '@d11/react-native-fast-image';

interface Props {
  data: Section;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FeaturedArtistsSection({ data }: Props) {
  if (!data?.featuredArtists) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>{data.heading}</Text>
        <Pressable>
          <Text style={styles.viewAll}>View all</Text>
        </Pressable>
      </View>
      
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {data.featuredArtists.map((item, index) => (
          <ArtistCard key={item.id} item={item} index={index} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

// Extracted to a separate component for better organization
function ArtistCard({ item, index }: { item: any; index: number }) {
  const scale = useSharedValue(1);
  
  // Animation styles when pressing the card
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  // Handle press animations
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable 
      style={[styles.artistItem, animatedStyle]}
      entering={FadeInUp.delay(index * 100).springify()}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View style={styles.imageContainer}>
       
         <FastImage
              source={{
                uri: item.profilephoto ?? unknownTrackImageUri,
                priority: FastImage.priority.normal,
              }}
              style={styles.profilePhoto}
              resizeMode="cover"
            />
        {item.verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
      <Text style={styles.artistType}>{item.artistType || 'Artist'}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewAll: {
    fontSize: 14,
    color: '#63B3ED',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  artistItem: {
    alignItems: 'center',
    marginRight: 24,
    width: 130,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profilePhoto: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: 'rgba(99, 179, 237, 0.3)',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: '#63B3ED',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  verifiedIcon: {
    color: '#FFFFFF',
  },
  name: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    width: '100%',
  },
  artistType: {
    color: '#9CA3AF',
    fontSize: 13,
  },
});