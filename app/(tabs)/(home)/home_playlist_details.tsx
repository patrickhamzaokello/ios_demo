import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useAlbumDetailsData } from '@/hooks/albumFixedData';
import Album from '@/components/Album/index';
import { colors, fontSize, fontWeight } from '@/constants/theme';
import { usePlaylistDetailsData } from '@/hooks/playlistFixedData';
import PlaylistDetails from '@/components/Playlist/PlaylistDetails';

const PlaylistScreen = () => {
    const { playlist_id } =
        useLocalSearchParams<{
            playlist_id: string;
        }>();

    const { data, loading, error, refetch } = usePlaylistDetailsData(playlist_id);


    if (loading) {
        return (
            <ScreenWrapper>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Fetching playlist details...</Text>
                </View>
            </ScreenWrapper>
        );
    }

    if (error) {
        return (
            <ScreenWrapper>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <Text
                        style={styles.retryText}
                        onPress={refetch}
                    >
                        Tap to retry
                    </Text>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <PlaylistDetails data={data} goBack={() => { }} goMore={() => {}} />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: colors.primary,
        fontSize: fontSize.md,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: colors.error,
        fontSize: fontSize.lg,
        fontWeight: '500',
        marginBottom: 10,
        textAlign: 'center',
    },
    retryText: {
        color: colors.primary,
        fontSize: fontSize.md,
        textDecorationLine: 'underline',
    },
});

export default PlaylistScreen;