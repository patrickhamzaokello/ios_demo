import { ScrollView, StyleSheet, View, Text, StatusBar } from 'react-native';
import { useCallback, useRef } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';
import { HeroSection } from '@/components/home/HeroSection';
import { NewReleaseSection } from '../../../components/home/NewReleaseSection';
import { FeaturedArtistsSection } from '../../../components/home/FeaturedArtistsSection';
import { TrendingSection } from '../../../components/home/TrendingSection';
import { LoadingState } from '../../../components/home/LoadingState';
import { useHomeData } from '../../../hooks/useHomeData';
import { SliderSection } from '../../../components/home/SliderSection';
import ScreenWrapper from '@/components/ScreenWrapper'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CollectionSection } from '@/components/home/CollectionSection';
import { PlaylistSection } from '@/components/home/PlaylistSection';
import { DJCollectionSection } from '@/components/home/DJCollectionSection';
import { useQueue } from '@/store/queue';
import TrackPlayer, { Track } from 'react-native-track-player';
import { generateTracksListId } from '@/helpers/miscellaneous';
import { useRouter } from "expo-router";
import { formatDistanceToNow } from 'date-fns';
import { colors } from '@/constants/theme';

// Offline banner component
interface OfflineBannerProps {
  lastUpdated: Date | null;
}

const OfflineBanner = ({ lastUpdated }: OfflineBannerProps) => {
  const formattedTime = lastUpdated 
    ? formatDistanceToNow(lastUpdated, { addSuffix: true }) 
    : '';

  return (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineText}>
        You're offline. Showing cached content from {formattedTime}.
      </Text>
    </View>
  );
};

export default function HomeScreen() {
    const { 
      data, 
      loading, 
      error, 
      refetch, 
      isConnected,
      lastUpdated 
    } = useHomeData();
    
    const router = useRouter();
    const queueOffset = useRef(0);
    const { activeQueueId, setActiveQueueId } = useQueue();
    
    const handleTrackSelect = async (selectedTrack: Track, tracks: Track[], id: string) => {
        console.log('Selected track:', selectedTrack);
        const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url)

        if (trackIndex === -1) return

        const isChangingQueue = id !== activeQueueId

        if (isChangingQueue) {
            const beforeTracks = tracks.slice(0, trackIndex)
            const afterTracks = tracks.slice(trackIndex + 1)

            await TrackPlayer.reset()

            // we construct the new queue
            await TrackPlayer.add(selectedTrack)
            await TrackPlayer.add(afterTracks)
            await TrackPlayer.add(beforeTracks)

            await TrackPlayer.play()

            queueOffset.current = trackIndex
            setActiveQueueId(id)
        } else {
            const nextTrackIndex =
                trackIndex - queueOffset.current < 0
                    ? tracks.length + trackIndex - queueOffset.current
                    : trackIndex - queueOffset.current

            await TrackPlayer.skip(nextTrackIndex)
            TrackPlayer.play()
        }
    }

    const renderSection = useCallback((section: any, index: number) => {
        switch (section.type) {
            case 'hero':
                return <HeroSection key={index} data={section} onNotificationsPress={() => router.push('/(tabs)/(home)/home_access_notifications')} />;
            case 'newRelease':
                return <NewReleaseSection key={index} data={section} />;
            case 'slider':
                return <SliderSection key={index} data={section} />;
            case 'artist':
                return <FeaturedArtistsSection key={index} data={section} />;
            case 'artist_more_like':
                return <FeaturedArtistsSection key={index} data={section} />;
            case 'trend':
                return (
                    <TrendingSection
                        key={index}
                        data={section}
                        queueID={generateTracksListId(index.toString(), section.heading )}
                        onTrackPress={(selectedTrack: Track, tracks: Track[], id: string) =>
                            handleTrackSelect(selectedTrack, tracks, id)
                        }
                    />
                );
            case 'albums':
                return <CollectionSection key={index} data={section} />;
            case 'djs':
                return <DJCollectionSection key={index} data={section} />;
            case 'playlist':
                return <PlaylistSection key={index} data={section} />;
            default:
                return null;
        }
    }, [router]);

    if (loading && !data) {
        // Only show loading state if we don't have any data to display
        return <LoadingState />;
    }

    // Show error state but only if we don't have cached data to display
    if (error && !data) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error.message}
                </Text>
                <Text
                    style={styles.retryText}
                    onPress={refetch}>
                    Tap to retry
                </Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView>
            <ScreenWrapper>
                {!isConnected && lastUpdated && (
                    <OfflineBanner lastUpdated={lastUpdated} />
                )}
                
                <ScrollView
                    style={styles.container}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 200 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={refetch}
                            tintColor="#FFFFFF"
                        />
                    }>
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    errorText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 8,
    },
    retryText: {
        color: '#63B3ED',
        fontSize: 14,
    },
    offlineBanner: {
        backgroundColor: colors.matteBlack,
        padding: 8,
        width: '100%',
        alignItems: 'center',
    },
    offlineText: {
        color: '#FFFFFF',
        fontSize: 12,
    }
});