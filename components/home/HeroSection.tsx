import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Nunito_800ExtraBold, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import type { Section } from '../../types/home';

interface Props {
  data: Section;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

export function HeroSection({ data, onPress }: Props) {
  const [fontsLoaded] = useFonts({
    Nunito_800ExtraBold,
    Nunito_600SemiBold,
  });

  if (!data || !fontsLoaded) return null;
  
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.container}>
      <Image
        source={{ uri: 'https://assets.mwonya.com/RawFiles/photo_2024-11-23_16-56-47.jpg'  }}
        style={styles.backgroundImage}
      />
      
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(0,0,0,0.6)']}
        style={styles.gradient}
      >
        <BlurView intensity={Platform.OS === 'ios' ? 10 : 0} tint="dark" style={styles.blurContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.heading}>{data.heading}</Text>
            {data.subheading && (
              <Text style={styles.subheading}>{data.subheading}</Text>
            )}
            
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play-circle" size={24} color="#FF2D55" />
                <Text style={styles.playText}>Play</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.shuffleButton}>
                <Ionicons name="shuffle" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 280,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '75%',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 20,
  },
  heading: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 30,
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subheading: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#EEEEEE',
    opacity: 0.9,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  playText: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  shuffleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});