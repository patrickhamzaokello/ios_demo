import { colors } from "@/constants/theme";
import useSearch from "@/hooks/useSearch"; // Custom hook for API search
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import TrackPlayer, {
  Track,
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";

import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "@d11/react-native-fast-image";
import LoaderKit from "react-native-loader-kit";
import { unknownTrackImageUri } from "@/constants/images";
import useNotificationList from "@/hooks/useUserNotificationList";

const { width } = Dimensions.get("window");



export default function NotificationPage() {
  const [userID, setUserID] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();


  const {
    data: notificationLists,
    isLoading,
    error,
    totalResults,
    hasMore,
  } = useNotificationList(userID, currentPage);

  console.log("Notification Lists: ", notificationLists);

  

 
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>



      {isLoading && notificationLists?.length === 0 && !isLoading && (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={64} color="#666" />
          <Text style={styles.noResultsText}>
            No results found
          </Text>
          <Text style={styles.noResultsHint}>
            Try checking your spelling or using different keywords
          </Text>
        </View>
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
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFF",
  },

  resultsContainer: {
    marginTop: 8,
    paddingBottom: 200,
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
  
});
