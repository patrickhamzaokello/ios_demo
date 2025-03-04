import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const SubtleGradientBackground = () => {
  return (
    <View style={styles.gradientContainer}>
      {/* Top left subtle gradient spot */}
      <View style={[styles.spotContainer, styles.topLeftSpot]}>
        <LinearGradient
          colors={['rgba(29, 149, 75, 0.05)', 'transparent']}
          style={styles.gradientSpot}
          start={{ x: 0.3, y: 0.3 }}
          end={{ x: 1, y: 1 }}
        />
        <BlurView 
          intensity={30} 
          tint="light" 
          style={styles.blurOverlay} 
        />
      </View>

      {/* Bottom right subtle gradient spot */}
      <View style={[styles.spotContainer, styles.bottomRightSpot]}>
        <LinearGradient
          colors={['rgba(37, 99, 235, 0.03)', 'transparent']}
          style={styles.gradientSpot}
          start={{ x: 0.3, y: 0.3 }}
          end={{ x: 1, y: 1 }}
        />
        <BlurView 
          intensity={20} 
          tint="light" 
          style={styles.blurOverlay} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  spotContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  topLeftSpot: {
    top: -50,
    left: -50,
  },
  bottomRightSpot: {
    bottom: -100,
    right: -100,
  },
  gradientSpot: {
    flex: 1,
    borderRadius: 100,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
  },
});

export default SubtleGradientBackground;