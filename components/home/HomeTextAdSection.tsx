import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { scale, verticalScale } from "@/utils/styling";
import { 
  colors, 
  spacingX, 
  spacingY, 
  radius, 
  fontSize, 
  shadow
} from "@/constants/theme";

const HomeTextAdSection = ({ data }: { data: any }) => {
  const handleAdPress = async () => {
    try {
      if (data.ad_link) {
        const supported = await Linking.canOpenURL(data.ad_link);
        if (supported) {
          await Linking.openURL(data.ad_link);
        } else {
          Alert.alert('Error', 'Cannot open this link');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleAdPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Ad Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: data.ad_image }}
            style={styles.adImage}
            resizeMode="cover"
          />
        </View>

        {/* Ad Content */}
        <View style={styles.textContainer}>
          <Text style={styles.adTitle} numberOfLines={2}>
            {data.ad_title}
          </Text>
          
          <Text style={styles.adDescription} numberOfLines={3}>
            {data.ad_description}
          </Text>

          {/* Ad Badge */}
          <View style={styles.adBadge}>
            <Text style={styles.adBadgeText}>Sponsored</Text>
          </View>
        </View>
      </View>

      {/* Link Indicator */}
      {data.ad_type === 'link' && (
        <View style={styles.linkIndicator}>
          <Text style={styles.linkText}>Visit Site</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.matteBlack,
    marginHorizontal: spacingX._15,
    marginVertical: spacingY._10,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.divider,
    ...shadow.md,
  },
  content: {
    flexDirection: 'row',
    padding: spacingX._15,
  },
  imageContainer: {
    width: scale(80),
    height: verticalScale(80),
    borderRadius: radius._10,
    overflow: 'hidden',
    marginRight: spacingX._12,
    backgroundColor: colors.neutral800,
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  adTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacingY._5,
    lineHeight: verticalScale(22),
  },
  adDescription: {
    fontSize: fontSize.md,
    color: colors.textLighter,
    lineHeight: verticalScale(20),
    marginBottom: spacingY._10,
    fontWeight: '400',
  },
  adBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._4,
    borderRadius: radius._6,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  adBadgeText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  linkIndicator: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._12,
    alignItems: 'center',
  },
  linkText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default HomeTextAdSection;