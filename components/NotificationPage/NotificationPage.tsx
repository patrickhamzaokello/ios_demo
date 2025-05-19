import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "@d11/react-native-fast-image";
import { unknownTrackImageUri } from "@/constants/images";
import useNotificationList from "@/hooks/useUserNotificationList";

const { width } = Dimensions.get("window");

// Icons map for different notification types
const NotificationIcon = ({ type }) => {
  switch (type) {
    case "song":
      return <Ionicons name="musical-note" size={18} color={colors.primary} />;
    case "album":
      return <Ionicons name="disc" size={18} color={colors.primary} />;
    case "artist":
      return <Ionicons name="person" size={18} color={colors.primary} />;
    case "playlist":
      return <Ionicons name="list" size={18} color={colors.primary} />;
    default:
      return <Ionicons name="notifications" size={18} color={colors.primary} />;
  }
};

// Format date to relative time (e.g. "2 hours ago")
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  }
  
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) {
    return `${diffHrs} hr${diffHrs !== 1 ? 's' : ''} ago`;
  }
  
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
};

// Individual notification item component
const NotificationItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.notificationItem} 
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <FastImage
        source={{ uri: item.artworkPath || unknownTrackImageUri }}
        style={styles.notificationImage}
      />
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <NotificationIcon type={item.type} />
        </View>
        <Text style={styles.notificationDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.notificationFooter}>
          <Text style={styles.notificationArtist}>
            {item.artist}
          </Text>
          <Text style={styles.notificationTime}>
            {formatRelativeTime(item.date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Section header component
const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

export default function NotificationPage() {
  const [userID, setUserID] = useState("mwUWTsKbYeIVPV20BN8or955NA1J43");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const {
    data: notificationLists,
    isLoading,
    error,
    totalResults,
    hasMore,
  } = useNotificationList(userID, currentPage);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleNotificationPress = (item) => {
    // Navigation based on notification type
    switch (item.type) {
      case "song":
        router.push(`/song/${item.id}`);
        break;
      case "album":
        router.push(`/(tabs)/(home)/new_release/${item.id}`);
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

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return <NotificationItem item={item} onPress={handleNotificationPress} />;
  };

  const renderSectionHeader = ({ section }) => {
    return <SectionHeader title={section.heading} />;
  };

  // Flatten the data structure for FlatList
  const flattenedData = notificationLists?.flatMap(section => 
    section.notification_List.map(item => ({
      ...item,
      sectionHeading: section.heading
    }))
  ) || [];

  // Group the flattened data by section heading
  const groupedData = flattenedData.reduce((acc, item) => {
    const existingSection = acc.find(section => section.heading === item.sectionHeading);
    if (existingSection) {
      existingSection.data.push(item);
    } else {
      acc.push({
        heading: item.sectionHeading,
        data: [item]
      });
    }
    return acc;
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {isLoading && flattenedData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#666" />
          <Text style={styles.errorText}>
            Couldn't load notifications
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => setCurrentPage(1)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : flattenedData.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="notifications-off-outline" size={64} color="#666" />
          <Text style={styles.noResultsText}>
            No notifications yet
          </Text>
          <Text style={styles.noResultsHint}>
            New updates will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={flattenedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          stickyHeaderIndices={groupedData.map((_, index) => 
            index === 0 ? 0 : 
            flattenedData.findIndex(item => item.sectionHeading === groupedData[index].heading)
          )}
          ListHeaderComponent={() => (
            <>
              {groupedData.map((section, index) => (
                <SectionHeader key={`section-${index}`} title={section.heading} />
              ))}
            </>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral800,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 24,
  },
  sectionHeader: {
    backgroundColor: colors.neutral900,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral800,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.neutral900,
  },
  notificationImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.neutral800,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginRight: 8,
  },
  notificationDescription: {
    fontSize: 14,
    color: colors.neutral400,
    marginTop: 4,
    marginBottom: 4,
    lineHeight: 18,
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  notificationArtist: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary,
  },
  notificationTime: {
    fontSize: 11,
    color: colors.neutral500,
  },
  separator: {
    height: 1,
    backgroundColor: colors.neutral800,
    marginLeft: 16 + 56 + 12, // Aligns with content, not image
  },
  loaderFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  noResultsText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
  },
  noResultsHint: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});