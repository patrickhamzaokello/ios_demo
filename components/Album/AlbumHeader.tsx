import React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors, fontSize, spacingX, spacingY } from '@/constants/theme';
import { AntDesign, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ALBUM_ART_MAX_SIZE = width * 0.65;
const ALBUM_ART_MIN_SIZE = 45;
const HEADER_MAX_HEIGHT = ALBUM_ART_MAX_SIZE + 200;
const HEADER_MIN_HEIGHT = 90;
const SCROLL_THRESHOLD = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface AlbumHeaderProps {
    artwork: string;
    title: string;
    artist: string;
    releaseDate: string;
    trackCount: number;
    totalPlays: string;
    description: string;
    scrollY: Animated.SharedValue<number>;
    onBack?: () => void;
    onMore?: () => void;
}

const AlbumHeader: React.FC<AlbumHeaderProps> = ({
    artwork,
    title,
    artist,
    releaseDate,
    trackCount,
    totalPlays,
    description,
    scrollY,
    onBack,
    onMore
}) => {
    // Animation styles
    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(
                scrollY.value,
                [0, SCROLL_THRESHOLD],
                [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
                Extrapolation.CLAMP
            )
        };
    });

    const artworkAnimatedStyle = useAnimatedStyle(() => {
        return {
            width: interpolate(
                scrollY.value,
                [0, SCROLL_THRESHOLD],
                [ALBUM_ART_MAX_SIZE, ALBUM_ART_MIN_SIZE],
                Extrapolation.CLAMP
            ),
            height: interpolate(
                scrollY.value,
                [0, SCROLL_THRESHOLD],
                [ALBUM_ART_MAX_SIZE, ALBUM_ART_MIN_SIZE],
                Extrapolation.CLAMP
            ),
            top: interpolate(
                scrollY.value,
                [0, SCROLL_THRESHOLD],
                [(StatusBar.currentHeight ?? 0) + 80, (StatusBar.currentHeight ?? 0) + 25],
                Extrapolation.CLAMP
            ),
            left: interpolate(
                scrollY.value,
                [0, SCROLL_THRESHOLD],
                [(width - ALBUM_ART_MAX_SIZE) / 2, 12],
                Extrapolation.CLAMP
            ),
            borderRadius: interpolate(
                scrollY.value,
                [0, SCROLL_THRESHOLD],
                [12, 6],
                Extrapolation.CLAMP
            ),
        };
    });

    const titleContainerStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, SCROLL_THRESHOLD * 0.7, SCROLL_THRESHOLD],
                [1, 0, 1],
                Extrapolation.CLAMP
            ),
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        [0, SCROLL_THRESHOLD],
                        [0, -30],
                        Extrapolation.CLAMP
                    )
                }
            ]
        };
    });
    
    const collapsedTitleStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [SCROLL_THRESHOLD * 0.7, SCROLL_THRESHOLD],
                [0, 1],
                Extrapolation.CLAMP
            ),
            transform: [
                {
                    translateX: interpolate(
                        scrollY.value,
                        [0, SCROLL_THRESHOLD],
                        [-20, 0],
                        Extrapolation.CLAMP
                    )
                }
            ]
        };
    });

    const infoAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, SCROLL_THRESHOLD * 0.4],
                [1, 0],
                Extrapolation.CLAMP
            )
        };
    });

    const actionsAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, SCROLL_THRESHOLD * 0.5],
                [1, 0],
                Extrapolation.CLAMP
            ),
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        [0, SCROLL_THRESHOLD * 0.5],
                        [0, 10],
                        Extrapolation.CLAMP
                    )
                }
            ]
        };
    });

    const navigationBarStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: scrollY.value > SCROLL_THRESHOLD * 0.8 ? colors.black : 'transparent',
        };
    });

    const backgroundStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, SCROLL_THRESHOLD],
                [0.85, 0.95],
                Extrapolation.CLAMP
            ),
        };
    });

    return (
        <Animated.View style={[styles.container, headerAnimatedStyle]}>
            {/* Background Image (Blurred) */}
            <Animated.Image
                source={{ uri: artwork }}
                style={[StyleSheet.absoluteFill, styles.backgroundImage]}
                blurRadius={30}
            />
            
            {/* Dark overlay */}
            <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, backgroundStyle]} />
            
            {/* Navigation Bar */}
            <Animated.View style={[styles.navBar, navigationBarStyle]}>
                <TouchableOpacity onPress={onBack} style={styles.navButton}>
                    <Ionicons name="chevron-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                
                {/* Compact title for scrolled state */}
                <Animated.View style={[styles.collapsedTitle, collapsedTitleStyle]}>
                    <Text style={styles.collapsedTitleText} numberOfLines={1}>{title}</Text>
                    <Text style={styles.collapsedArtistText} numberOfLines={1}>{artist}</Text>
                </Animated.View>
                
                <TouchableOpacity onPress={onMore} style={styles.navButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color={colors.primary} />
                </TouchableOpacity>
            </Animated.View>
            
            {/* Album artwork */}
            <Animated.Image
                source={{ uri: artwork }}
                style={[styles.artwork, artworkAnimatedStyle]}
                resizeMode="cover"
            />
            
            {/* Album details */}
            <View style={styles.detailsContainer}>
                <Animated.View style={[styles.titleContainer, titleContainerStyle]}>
                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                    <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
                </Animated.View>

                <Animated.View style={[styles.infoContainer, infoAnimatedStyle]}>
                    <Text style={styles.infoText}>{releaseDate} • {trackCount} songs</Text>
                    <Text style={styles.infoText}>{totalPlays} plays</Text>
                    {description ? (
                        <Text style={styles.description} numberOfLines={2}>{description}</Text>
                    ) : null}
                </Animated.View>

                <Animated.View style={[styles.actionButtons, actionsAnimatedStyle]}>
                    <TouchableOpacity style={styles.playButton}>
                        <Ionicons name="play" size={22} color={colors.black} />
                        <Text style={styles.playButtonText}>Play</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shuffleButton}>
                        <Ionicons name="shuffle" size={20} color={colors.primary} />
                        <Text style={styles.shuffleButtonText}>Shuffle</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        zIndex: 10,
    },
    backgroundImage: {
        zIndex: -2,
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: -1,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight || 40,
        paddingHorizontal: spacingX._15,
        height: 90,
    } as ViewStyle,
    navButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    collapsedTitle: {
        flex: 1,
        marginHorizontal: spacingX._12,
    },
    collapsedTitleText: {
        color: colors.primary,
        fontSize: fontSize.md,
        fontWeight: '600',
        textAlign: 'center',
    },
    collapsedArtistText: {
        color: colors.neutral100,
        fontSize: fontSize.sm,
        textAlign: 'center',
    },
    artwork: {
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    detailsContainer: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        paddingHorizontal: spacingX._25,
    },
    titleContainer: {
        marginBottom: spacingY._10,
    },
    title: {
        color: colors.primary,
        fontSize: fontSize.xxl,
        fontWeight: '700',
        marginBottom: spacingY._7,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    artist: {
        color: colors.neutral100,
        fontSize: fontSize.lg,
        fontWeight: '500',
    },
    infoContainer: {
        marginTop: spacingY._17,
    },
    infoText: {
        color: colors.neutral100,
        fontSize: fontSize.sm,
        marginBottom: spacingY._4,
    },
    description: {
        color: colors.neutral100,
        fontSize: fontSize.sm,
        marginTop: spacingY._12,
        lineHeight: 20,
        opacity: 0.9,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: spacingY._25,
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: spacingY._12,
        paddingHorizontal: spacingX._25,
        borderRadius: 24,
        marginRight: spacingX._15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    playButtonText: {
        color: colors.black,
        fontWeight: '600',
        marginLeft: spacingX._10,
    },
    shuffleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: spacingY._12,
        paddingHorizontal: spacingX._25,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    shuffleButtonText: {
        color: colors.primary,
        fontWeight: '600',
        marginLeft: spacingX._10,
    },
});

export default AlbumHeader;