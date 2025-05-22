import { unknownTrackImageUri } from "@/constants/images";
import { colors } from "@/constants/theme";
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
} from "react-native";

const { width } = Dimensions.get("window");

// Get notification type color and icon
const getNotificationConfig = (type) => {
  const configs = {
    song: {
      color: colors.primary,
      icon: "music-note",
    },
    album: {
      color: colors.accent2,
      icon: "album",
    },
    artist: {
      color: colors.accent3,
      icon: "account-music",
    },
    playlist: {
      color: colors.primary,
      icon: "playlist-music",
    },
    default: {
      color: colors.primary,
      icon: "bell",
    },
  };

  return configs[type] || configs.default;
};

// Format date to readable format
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 5) return "now";
  if (diffMins < 60) return `${diffMins}m`;

  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h`;

  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "1d";
  if (diffDays < 7) return `${diffDays}d`;

  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
};

// Main notification item component
const NotificationItem = ({ item, onPress, unread = true }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const config = getNotificationConfig(item.type);

  const handlePress = () => {
    // Animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Navigate
    onPress(item);
  };

  return (
    <Animated.View
      style={[styles.itemContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        style={styles.notificationItem}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <FastImage
            source={{ uri: item.artworkPath || unknownTrackImageUri }}
            style={styles.notificationImage}
          />
          <View
            style={[styles.typeIndicator, { backgroundColor: config.color }]}
          >
            <MaterialCommunityIcons name={config.icon} size={14} color="#FFF" />
          </View>
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.contentHeader}>
            <Text style={styles.notificationTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.timeStamp}>
              {formatRelativeTime(item.date)}
            </Text>
          </View>

          <Text style={styles.notificationDescription} numberOfLines={2}>
            {item.description}
          </Text>

          {unread && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Section header component
const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

// Empty state component
const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <MaterialCommunityIcons
      name="bell-off-outline"
      size={40}
      color={colors.neutral600}
    />
    <Text style={styles.emptyTitle}>All caught up!</Text>
    <Text style={styles.emptyDescription}>No notifications right now</Text>
  </View>
);

// Error state component
const ErrorState = ({ onRetry }) => (
  <View style={styles.emptyContainer}>
    <MaterialCommunityIcons
      name="alert-circle-outline"
      size={40}
      color={colors.error}
    />
    <Text style={styles.emptyTitle}>Couldn't load notifications</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
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

  // Refresh control handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });
  }, [refetch]);

  // Load more handler
  const handleLoadMore = () => {
    if (hasMore && !isLoading && !refreshing) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Mark notification as read when pressed
  const handleNotificationPress = (item) => {
    if (!readNotifications.includes(item.id)) {
      setReadNotifications((prev) => [...prev, item.id]);
    }

    // Navigate based on type
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

  // Flatten and process notification data
  const processedData = React.useMemo(() => {
    if (!notificationLists || notificationLists.length === 0) return [];

    return notificationLists.flatMap((section, sectionIndex) => {
      // Add section header as a special item
      const sectionItems = [
        {
          id: `section-${sectionIndex}`,
          isSection: true,
          title: section.heading,
        },
      ];

      // Add actual notification items
      const notificationItems = section.notification_List.map((item) => ({
        ...item,
        isSection: false,
        sectionHeading: section.heading,
      }));

      return [...sectionItems, ...notificationItems];
    });
  }, [notificationLists]);

  // List item renderer that handles both section headers and items
  const renderItem = ({ item }) => {
    if (item.isSection) {
      return <SectionHeader title={item.title} />;
    }

    return (
      <NotificationItem
        item={item}
        onPress={handleNotificationPress}
        unread={!readNotifications.includes(item.id)}
      />
    );
  };

  // Footer loading indicator
  const renderFooter = () => {
    if (!isLoading || refreshing) return null;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {processedData.some(
          (item) => !item.isSection && !readNotifications.includes(item.id)
        ) && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={() => {
              const allIds = processedData
                .filter((item) => !item.isSection)
                .map((item) => item.id);
              setReadNotifications(allIds);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            }}
          >
            <Text style={styles.markAllButtonText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {isLoading && processedData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
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
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Replace with your theme's background color
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border, // Replace with your theme's border color
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text, // Replace with your theme's text color
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.buttonBackground, // Replace with your theme's button background color
  },
  markAllButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.buttonText, // Replace with your theme's button text color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 16,
  },
  itemContainer: {
    backgroundColor: colors.neutral900,
  },
  sectionHeader: {
    backgroundColor: colors.sectionBackground, // Updated
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted, // Updated
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border, // Updated
  },
  imageContainer: {
    position: "relative",
  },
  notificationImage: {
    width: 46,
    height: 46,
    borderRadius: 6,
    backgroundColor: colors.imageBackground, // Updated
  },
  typeIndicator: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.neutral900, // Updated
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
    position: "relative",
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  timeStamp: {
    fontSize: 12,
    color: colors.textMuted, // Updated
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary, // Updated
    flex: 1,
    marginRight: 8,
  },
  notificationDescription: {
    fontSize: 13,
    color: colors.textMuted, // Updated
    lineHeight: 18,
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary, // Updated
  },
  loaderFooter: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    color: colors.textPrimary, // Updated
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 6,
  },
  emptyDescription: {
    color: colors.textMuted, // Updated
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.primary, // Updated
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.textPrimary, // Updated
    fontWeight: "600",
    fontSize: 14,
  },
});
