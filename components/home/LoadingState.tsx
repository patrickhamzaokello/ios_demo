import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  withDelay
} from 'react-native-reanimated';

export function LoadingState() {
  const shimmerStyle = (delay: number) => useAnimatedStyle(() => ({
    opacity: withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(0.5, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        )
      ),
      -1,
      true
    ),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.hero, shimmerStyle(0)]} />
      <View style={styles.section}>
        <Animated.View style={[styles.heading, shimmerStyle(200)]} />
        <View style={styles.row}>
          {[...Array(3)].map((_, i) => (
            <Animated.View 
              key={i} 
              style={[styles.card, shimmerStyle(400 + i * 100)]} 
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  hero: {
    height: 200,
    backgroundColor: '#1A202C',
    marginBottom: 24,
  },
  section: {
    padding: 16,
  },
  heading: {
    height: 24,
    backgroundColor: '#1A202C',
    width: '40%',
    borderRadius: 4,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    width: 150,
    height: 150,
    backgroundColor: '#1A202C',
    borderRadius: 8,
  },
});