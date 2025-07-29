import { CollectionSection } from "@/components/home/CollectionSection";
import { DJCollectionSection } from "@/components/home/DJCollectionSection";
import { HeroSection } from "@/components/home/HeroSection";
import { PlaylistSection } from "@/components/home/PlaylistSection";
import ScreenWrapper from "@/components/ScreenWrapper";
import { generateTracksListId } from "@/helpers/miscellaneous";
import { useQueue } from "@/store/queue";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  RefreshControl,
} from "react-native-gesture-handler";
import TrackPlayer, { Track } from "react-native-track-player";
import { FeaturedArtistsSection } from "../../../components/home/FeaturedArtistsSection";
import { LoadingState } from "../../../components/home/LoadingState";
import { NewReleaseSection } from "../../../components/home/NewReleaseSection";
import { SliderSection } from "../../../components/home/SliderSection";
import { TrendingSection } from "../../../components/home/TrendingSection";
import { useHomeData } from "../../../hooks/useHomeData";
import HomeTextAdSection from "@/components/home/HomeTextAdSection";
import HomeImageAdSection from "@/components/home/HomeImageAdSection";
import { HomeWeeklyChartSection } from "@/components/home/HomeTimelySection";

// Offline banner component
const OfflineBanner = ({ lastUpdated }: { lastUpdated: string | null }) => {
  const formattedTime = lastUpdated
    ? formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })
    : "";

  return (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineText}>
        You're offline. Showing cached content from {formattedTime}.
      </Text>
    </View>
  );
};

// Background refresh indicator
const BackgroundRefreshIndicator = () => (
  <View style={styles.backgroundRefreshIndicator}>
    <Text style={styles.backgroundRefreshText}>Updating...</Text>
  </View>
);

export default function HomeScreen() {
  const {
    data,
    loading,
    initialLoad,
    backgroundRefresh,
    error,
    refetch,
    isConnected,
    lastUpdated,
  } = useHomeData() as {
    data: { featured: any[] } | null;
    loading: boolean;
    initialLoad: boolean;
    backgroundRefresh: boolean;
    error: Error | null;
    refetch: () => void;
    isConnected: boolean;
    lastUpdated: Date | null;
  };

  const router = useRouter();
  const queueOffset = useRef(0);
  const { activeQueueId, setActiveQueueId } = useQueue();

  const handleTrackSelect = async (
    selectedTrack: Track,
    tracks: Track[],
    id: string
  ) => {
    const trackIndex = tracks.findIndex(
      (track) => track.url === selectedTrack.url
    );

    if (trackIndex === -1) return;

    const isChangingQueue = id !== activeQueueId;

    if (isChangingQueue) {
      const beforeTracks = tracks.slice(0, trackIndex);
      const afterTracks = tracks.slice(trackIndex + 1);

      await TrackPlayer.reset();

      // we construct the new queue
      await TrackPlayer.add(selectedTrack);
      await TrackPlayer.add(afterTracks);
      await TrackPlayer.add(beforeTracks);

      await TrackPlayer.play();

      queueOffset.current = trackIndex;
      setActiveQueueId(id);
    } else {
      const nextTrackIndex =
        trackIndex - queueOffset.current < 0
          ? tracks.length + trackIndex - queueOffset.current
          : trackIndex - queueOffset.current;

      await TrackPlayer.skip(nextTrackIndex);
      TrackPlayer.play();
    }
  };

  const renderSection = useCallback(
    (section: any, index: number) => {
      switch (section.type) {
        case "hero":
          return (
            <HeroSection
              key={index}
              data={section}
              onNotificationsPress={() =>
                router.push("/(tabs)/(home)/notifications")
              }
            />
          );
        case "newRelease":
          return <NewReleaseSection key={index} data={section} />;
        case "slider":
          return <SliderSection key={index} data={section} />;
        case "image_ad":
          return <HomeImageAdSection key={index} data={section} />;
        case "timely": 
          return <HomeWeeklyChartSection    key={index}
          data={section}
          queueID={generateTracksListId(index.toString(), section.heading)}
          onTrackPress={(
            selectedTrack: Track,
            tracks: Track[],
            id: string
          ) => handleTrackSelect(selectedTrack, tracks, id)} />;
        case "text_ad":
          return <HomeTextAdSection key={index} data={section} />;
        case "artist":
          return <FeaturedArtistsSection key={index} data={section} />;
        case "artist_more_like":
          return <FeaturedArtistsSection key={index} data={section} />;
        case "trend":
          return (
            <TrendingSection
              key={index}
              data={section}
              queueID={generateTracksListId(index.toString(), section.heading)}
              onTrackPress={(
                selectedTrack: Track,
                tracks: Track[],
                id: string
              ) => handleTrackSelect(selectedTrack, tracks, id)}
            />
          );
        case "albums":
          return <CollectionSection key={index} data={section} />;
        case "djs":
          return <DJCollectionSection key={index} data={section} />;
        case "playlist":
          return <PlaylistSection key={index} data={section} />;
        default:
          return null;
      }
    },
    [router]
  );

  // Only show skeleton loading if it's the initial load and we have no data
  if (initialLoad && loading && !data) {
    return <LoadingState />;
  }

  // Show error state only if we don't have cached data to display
  if (error && !data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error.message}</Text>
        <Text style={styles.retryText} onPress={refetch}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <ScreenWrapper>
        {/* Show offline banner when not connected but have cached data */}
        {!isConnected && lastUpdated && (
          <OfflineBanner lastUpdated={lastUpdated?.toISOString() || null} />
        )}

        {/* Show background refresh indicator */}
        {backgroundRefresh && <BackgroundRefreshIndicator />}

        <ScrollView
          style={styles.container}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 200 }}
          refreshControl={
            <RefreshControl
              refreshing={loading && !backgroundRefresh} // Don't show spinner during background refresh
              onRefresh={refetch}
              tintColor="#FFFFFF"
            />
          }
        >
          {data?.featured?.map(renderSection)}
        </ScrollView>
      </ScreenWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  retryText: {
    color: "#63B3ED",
    fontSize: 14,
  },
  offlineBanner: {
    backgroundColor: "#433D3C",
    padding: 8,
    width: "100%",
    alignItems: "center",
  },
  offlineText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  backgroundRefreshIndicator: {
    backgroundColor: "rgba(99, 179, 237, 0.8)",
    padding: 4,
    width: "100%",
    alignItems: "center",
  },
  backgroundRefreshText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "500",
  },
});
