import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { useCallback } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';
// import HeroSection  from '../../components/home/HeroSection';
import { HeroSection } from '@/components/home/HeroSection';
import { NewReleaseSection } from '../../components/home/NewReleaseSection';
import { FeaturedArtistsSection } from '../../components/home/FeaturedArtistsSection';
import { TrendingSection } from '../../components/home/TrendingSection';
import { LoadingState } from '../../components/home/LoadingState';
import { useHomeData } from '../../hooks/useHomeData';
import { SliderSection } from '../../components/home/SliderSection';
import ScreenWrapper from '@/components/ScreenWrapper'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CollectionSection } from '@/components/home/CollectionSection';
import { PlaylistSection } from '@/components/home/PlaylistSection';
import { MoreLikeArtistSection } from '@/components/home/MoreLikeArtist';
import { DJCollectionSection } from '@/components/home/DJCollectionSection';


export default function HomeScreen() {
    const { data, loading, error, refetch } = useHomeData();

    const renderSection = useCallback((section: any, index: number) => {
        switch (section.type) {
            case 'hero':
                return <HeroSection key={index} data={section} />;
            case 'newRelease':
                return <NewReleaseSection key={index} data={section} />;
            case 'slider':
                return <SliderSection key={index} data={section} />;
            case 'artist':
                return <FeaturedArtistsSection key={index} data={section} />;
            case 'artist_more_like':
                return <MoreLikeArtistSection key={index} data={section} />;
            case 'trend':
                return <TrendingSection key={index} data={section} />;
            case 'albums':
                return <CollectionSection key={index} data={section} />;
            case 'djs':
                return <DJCollectionSection key={index} data={section} />;
            case 'playlist':
                return <PlaylistSection key={index} data={section} />;
            default:
                return null;
        }
    }, []);

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
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

                <ScrollView
                    style={styles.container}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
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
});