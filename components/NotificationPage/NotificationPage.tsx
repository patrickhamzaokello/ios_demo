import { unknownTrackImageUri } from "@/constants/images";
import { colors, spacingX, spacingY, radius, fontSize, fontWeight, borderRadius, shadow } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import useNotificationList from "@/hooks/useUserNotificationList";
import FastImage from "@d11/react-native-fast-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

// Enhanced notification configuration with better colors
const getNotificationConfig = (type) => {
  const configs = {
    song: {
      color: colors.primary,
      backgroundColor: `${colors.primary}15`,
      icon: "music-note",
      label: "Song"
    },
    album: {
      color: colors.info,
      backgroundColor: `${colors.info}15`,
      icon: "album",
      label: "Album"
    },
    artist: {
      color: colors.warning,
      backgroundColor: `${colors.warning}15`,
      icon: "account-music",
      label: "Artist"
    },
    playlist: {
      color: colors.success,
      backgroundColor: `${colors.success}15`,
      icon: "playlist-music",
      label: "Playlist"
    },
    default: {
      color: colors.primary,
      backgroundColor: `${colors.primary}15`,
      icon: "bell",
      label: "Update"
    },
  };

  return configs[type] || configs.default;
};

// Enhanced time formatting
const formatRelativeTime = (dateString) => {
  if (!dateString) return "Unknown";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;

    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    
    return year === currentYear ? `${month} ${day}` : `${month} ${day}, ${year}`;
  } catch (error) {
    return "Unknown";
  }
};

// Skeleton Loading Components
const NotificationSkeleton = () => {
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View style={[styles.skeletonImage, { opacity: shimmerOpacity }]} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonHeader}>
          <Animated.View style={[styles.skeletonTitle, { opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.skeletonTime, { opacity: shimmerOpacity }]} />
        </View>
        <Animated.View style={[styles.skeletonDescription, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.skeletonDescriptionShort, { opacity: shimmerOpacity }]} />
      </View>
    </View>
  );
};

const SectionSkeleton = () => (
  <View style={styles.skeletonSectionContainer}>
    <Animated.View style={styles.skeletonSectionHeader} />
  </View>
);

// Enhanced Notification Item
const NotificationItem = ({ item, onPress, unread = true }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const config = getNotificationConfig(item.type);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(item);
  };

  return (
    <Animated.View style={[styles.itemContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.notificationItem,
          unread && styles.unreadNotification,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <FastImage
            source={{ uri: item.artworkPath || unknownTrackImageUri }}
            style={styles.notificationImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={[styles.typeIndicator, { backgroundColor: config.color }]}>
            <MaterialCommunityIcons 
              name={config.icon} 
              size={scale(12)} 
              color={colors.white} 
            />
          </View>
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.contentHeader}>
            <View style={styles.titleRow}>
              <Text style={styles.notificationTitle} numberOfLines={1}>
                {item.title || 'Untitled'}
              </Text>
              <View style={[styles.typeBadge, { backgroundColor: config.backgroundColor }]}>
                <Text style={[styles.typeBadgeText, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>
            </View>
            <Text style={styles.timeStamp}>
              {formatRelativeTime(item.date)}
            </Text>
          </View>

          <Text style={styles.notificationDescription} numberOfLines={2}>
            {item.description || 'No description available'}
          </Text>

          {unread && <View style={styles.unreadIndicator} />}
        </View>

        <MaterialCommunityIcons 
          name="chevron-right" 
          size={scale(16)} 
          color={colors.neutral400} 
          style={styles.chevron}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Enhanced Section Header
const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title || ''}</Text>
    <View style={styles.sectionDivider} />
  </View>
);

// Enhanced Empty State
const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconContainer}>
      <MaterialCommunityIcons
        name="bell-off-outline"
        size={scale(48)}
        color={colors.neutral500}
      />
    </View>
    <Text style={styles.emptyTitle}>All caught up!</Text>
    <Text style={styles.emptyDescription}>
      You're all set! New notifications will appear here.
    </Text>
  </View>
);

// Enhanced Error State
const ErrorState = ({ onRetry }) => (
  <View style={styles.emptyContainer}>
    <View style={styles.errorIconContainer}>
      <MaterialCommunityIcons
        name="wifi-off"
        size={scale(48)}
        color={colors.error}
      />
    </View>
    <Text style={styles.errorTitle}>Connection Error</Text>
    <Text style={styles.errorDescription}>
      Unable to load notifications. Please check your connection.
    </Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <MaterialCommunityIcons 
        name="refresh" 
        size={scale(16)} 
        color={colors.white} 
        style={styles.retryIcon}
      />
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

// Loading State Component
const LoadingState = () => (
  <View style={styles.loadingContainer}>
    {[...Array(6)].map((_, index) => (
      <React.Fragment key={index}>
        {index === 0 && <SectionSkeleton />}
        <NotificationSkeleton />
        {index === 2 && <SectionSkeleton />}
      </React.Fragment>
    ))}
  </View>
);

export default function NotificationPage() {
  const [userID, setUserID] = useState("mwUWTsKbYeIVPV20BN8or955NA1J43");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);
  const router = useRouter();

  const {
    data: notificationLists,
    isLoading,
    error,
    totalResults,
    hasMore,
    refetch,
  } = useNotificationList(userID, currentPage);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    refetch().finally(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });
  }, [refetch]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading && !refreshing) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleNotificationPress = (item) => {
    if (!readNotifications.includes(item.id)) {
      setReadNotifications((prev) => [...prev, item.id]);
    }

    switch (item.type) {
      case "song":
        router.push(`/song/${item.id}`);
        break;
      case "album":
        router.push(`/album/${item.id}`);
        break;
      case "artist":
        router.push(`/artist/${item.artistID}`);
        break;
      case "playlist":
        router.push(`/playlist/${item.id}`);
        break;
      default:
        break;
    }
  };

  const processedData = React.useMemo(() => {
    if (!notificationLists || notificationLists.length === 0) return [];

    return notificationLists.flatMap((section, sectionIndex) => {
      const sectionItems = [
        {
          id: `section-${sectionIndex}`,
          isSection: true,
          title: section.heading,
        },
      ];

      const notificationItems = section.notification_List.map((item) => ({
        ...item,
        isSection: false,
        sectionHeading: section.heading,
      }));

      return [...sectionItems, ...notificationItems];
    });
  }, [notificationLists]);

  const unreadCount = processedData.filter(
    (item) => !item.isSection && !readNotifications.includes(item.id)
  ).length;

  const renderItem = ({ item }) => {
    if (item.isSection) {
      return <SectionHeader title={item.title || ''} />;
    }

    return (
      <NotificationItem
        item={item}
        onPress={handleNotificationPress}
        unread={!readNotifications.includes(item.id)}
      />
    );
  };

  const renderFooter = () => {
    if (!isLoading || refreshing || processedData.length === 0) return null;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.matteBlack} />

      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={() => {
              const allIds = processedData
                .filter((item) => !item.isSection)
                .map((item) => item.id);
              setReadNotifications(allIds);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
          >
            <MaterialCommunityIcons 
              name="check-all" 
              size={scale(14)} 
              color={colors.primary} 
              style={styles.markAllIcon}
            />
            <Text style={styles.markAllButtonText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {isLoading && processedData.length === 0 ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          onRetry={() => {
            setCurrentPage(1);
            refetch();
          }}
        />
      ) : processedData.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={processedData}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.isSection ? item.id : `notification-${item.id}`
          }
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.neutral800}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.matteBlack,
  },
  header: {
    paddingTop: spacingY._15,
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.matteBlack,
    ...shadow.sm,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: fontSize.headline,
    fontWeight: '700',
    color: colors.text,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    marginLeft: spacingX._10,
    paddingHorizontal: spacingX._7,
    paddingVertical: spacingY._4,
    minWidth: scale(24),
    alignItems: "center",
  },
  unreadBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.matteBlack,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacingY._7,
    paddingHorizontal: spacingX._12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  markAllIcon: {
    marginRight: spacingX._5,
  },
  markAllButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    paddingTop: spacingY._20,
  },
  list: {
    paddingBottom: spacingY._30,
  },
  itemContainer: {
    marginHorizontal: spacingX._15,
    marginVertical: spacingY._4,
  },
  sectionHeader: {
    backgroundColor: colors.matteBlack,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._25,
    paddingBottom: spacingY._10,
  },
  sectionHeaderText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textLighter,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacingY._7,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacingX._15,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.divider,
    ...shadow.sm,
  },
  unreadNotification: {
    backgroundColor: `${colors.primary}05`,
    borderColor: `${colors.primary}20`,
  },
  imageContainer: {
    position: "relative",
  },
  notificationImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral800,
  },
  typeIndicator: {
    position: "absolute",
    bottom: -spacingY._4,
    right: -spacingX._5,
    width: scale(20),
    height: scale(20),
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.matteBlack,
  },
  notificationContent: {
    flex: 1,
    marginLeft: spacingX._15,
    position: "relative",
  },
  contentHeader: {
    marginBottom: spacingY._5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY._4,
  },
  notificationTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: spacingX._10,
  },
  typeBadge: {
    paddingHorizontal: spacingX._7,
    paddingVertical: spacingY._4,
    borderRadius: borderRadius.xs,
  },
  typeBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  timeStamp: {
    fontSize: fontSize.xs,
    color: colors.neutral400,
    fontWeight: '500',
  },
  notificationDescription: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    lineHeight: verticalScale(18),
  },
  unreadIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    width: scale(8),
    height: scale(8),
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  chevron: {
    marginLeft: spacingX._10,
  },
  loaderFooter: {
    paddingVertical: spacingY._20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: spacingX._10,
    fontSize: fontSize.sm,
    color: colors.neutral400,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacingX._30,
  },
  emptyIconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacingY._20,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '600',
    textAlign: "center",
    marginBottom: spacingY._10,
  },
  emptyDescription: {
    color: colors.textLight,
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: verticalScale(20),
  },
  errorIconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.error}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacingY._20,
  },
  errorTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '600',
    textAlign: "center",
    marginBottom: spacingY._10,
  },
  errorDescription: {
    color: colors.textLight,
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: verticalScale(20),
    marginBottom: spacingY._25,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._20,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    ...shadow.md,
  },
  retryIcon: {
    marginRight: spacingX._7,
  },
  retryButtonText: {
    color: colors.matteBlack,
    fontWeight: '600',
    fontSize: fontSize.md,
  },
  // Skeleton Styles
  skeletonContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacingX._15,
    marginHorizontal: spacingX._15,
    marginVertical: spacingY._4,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  skeletonImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral700,
  },
  skeletonContent: {
    flex: 1,
    marginLeft: spacingX._15,
  },
  skeletonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._7,
  },
  skeletonTitle: {
    height: verticalScale(16),
    width: "60%",
    backgroundColor: colors.neutral700,
    borderRadius: borderRadius.xs,
  },
  skeletonTime: {
    height: verticalScale(12),
    width: scale(40),
    backgroundColor: colors.neutral700,
    borderRadius: borderRadius.xs,
  },
  skeletonDescription: {
    height: verticalScale(14),
    width: "90%",
    backgroundColor: colors.neutral700,
    borderRadius: borderRadius.xs,
    marginBottom: spacingY._4,
  },
  skeletonDescriptionShort: {
    height: verticalScale(14),
    width: "70%",
    backgroundColor: colors.neutral700,
    borderRadius: borderRadius.xs,
  },
  skeletonSectionContainer: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._25,
    paddingBottom: spacingY._10,
  },
  skeletonSectionHeader: {
    height: verticalScale(12),
    width: scale(80),
    backgroundColor: colors.neutral700,
    borderRadius: borderRadius.xs,
  },
});