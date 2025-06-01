import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { scale, verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { 
  colors, 
  spacingX, 
  spacingY, 
  radius, 
  fontSize, 
  shadow 
} from "@/constants/theme";

const { width: screenWidth } = Dimensions.get('window');

const HomeImageAdSection = ({ data }: { data: any }) => {
    const router = useRouter();
  const handleAdPress = () => {
    if (data.ad_type === 'playlist') {
      router.push({
        pathname: "/(tabs)/(home)/playlistDetailsPage",
        params: { playlist_id: data.ad_link },
      })
    }
    // Add other ad type handlers here if needed
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleAdPress}
      activeOpacity={0.85}
    >
      <ImageBackground
        source={{ uri: data.ad_image }}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        {/* Dark Gradient Overlay */}
        <View style={styles.gradientOverlay} />
        
        {/* Content Overlay */}
        <View style={styles.contentOverlay}>
          {/* Top Badges */}
          <View style={styles.topSection}>
            <View style={styles.adBadge}>
              <Text style={styles.adBadgeText}>AD</Text>
            </View>
            
            {data.ad_type === 'playlist' && (
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>♪</Text>
              </View>
            )}
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.adTitle} numberOfLines={1}>
              {data.ad_title}
            </Text>
            
            <Text style={styles.adDescription} numberOfLines={1}>
              {data.ad_description}
            </Text>

            {/* Minimalist Action Indicator */}
            <View style={styles.actionIndicator}>
              <View style={styles.actionDot} />
              <Text style={styles.actionText}>
                {data.ad_type === 'playlist' ? 'Tap to Play' : 'Tap to View'}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacingX._15,
    marginVertical: spacingY._7,
    borderRadius: radius._15,
    overflow: 'hidden',
    ...shadow.lg,
  },
  imageBackground: {
    width: screenWidth - scale(30),
    height: verticalScale(160),
    justifyContent: 'space-between',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacingX._15,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  adBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacingX._7,
    paddingVertical: spacingY._4,
    borderRadius: radius._10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  adBadgeText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  typeBadge: {
    backgroundColor: colors.primary,
    width: scale(24),
    height: verticalScale(24),
    borderRadius: radius._12,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow.sm,
  },
  typeBadgeText: {
    fontSize: fontSize.md,
    color: colors.black,
    fontWeight: '700',
  },
  mainContent: {
    alignItems: 'flex-start',
    gap: spacingY._5,
  },
  adTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.white,
    lineHeight: verticalScale(24),
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  adDescription: {
    fontSize: fontSize.md,
    color: colors.textLight,
    fontWeight: '400',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacingY._5,
    gap: spacingX._5,
  },
  actionDot: {
    width: scale(6),
    height: verticalScale(6),
    borderRadius: radius._3,
    backgroundColor: colors.primary,
    ...shadow.sm,
  },
  actionText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.8,
  },
});

export default HomeImageAdSection;