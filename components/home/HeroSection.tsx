import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import SubtleGradientBackground from '../subtleGradient';

interface Props {
  data: {
    heading: string;
    subheading?: string;
    imageUrl: string;
  };
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

export function HeroSection({ data, onPress }: Props) {
  
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress} 
      style={styles.container}
    >
      {/* Background Spotted Gradients */}
      

      <SubtleGradientBackground />
      
      <View style={styles.content}>
        <Text style={styles.heading} numberOfLines={2}>
          {data.heading}
        </Text>
        {data.subheading && (
          <Text style={styles.subheading} numberOfLines={1}>
            {data.subheading}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    position: 'relative',
    paddingVertical: 10,
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  spotContainer: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
  },
  gradientSpot: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.2 }],
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  heading: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.3,
    fontWeight: '700',
  },

  subheading: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.2,
  },
});