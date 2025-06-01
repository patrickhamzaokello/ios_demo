import { useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize } from '@/constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Sample data based on your API structure
const libraryData = {
  version: 9,
  page: 1,
  Library: [
    {
      heading: "New Releases From Artists You Follow.",
      HomeRelease: [
        {
          id: "mw_albce1aee72-ca8e-4f75-beb6-da1d63e56415",
          heading: "New Release For You",
          title: "Kinzaali",
          artworkPath: "https://mwonya-kasfa-assets-store.s3.us-east-1.amazonaws.com/80fb5950348ffff1becadffe7c2c54679ef2bdde23d8885fed496840453ca397.jpeg",
          tag: "May 2025 - Music",
          artistId: "martist62a5fcbabb0e4chi",
          artist: "Chicor",
          exclusive: false,
          artistArtwork: "https://assets.mwonya.com/images/artistprofiles/Chicor_profile_20220612144826_04132.jpeg",
          Tracks: [
            {
              id: 2437,
              title: "Kinzaali",
              artist: "Chicor",
              artistID: "martist62a5fcbabb0e4chi",
              album: "Kinzaali",
              artworkPath: "https://mwonya-kasfa-assets-store.s3.us-east-1.amazonaws.com/80fb5950348ffff1becadffe7c2c54679ef2bdde23d8885fed496840453ca397.jpeg",
              genre: "Afro-Beat",
              genreID: 29,
              duration: "182.8832",
              lyrics: null,
              path: "https://mwonya-kasfa-assets-store.s3.us-east-1.amazonaws.com/tracks/689a5552741b6745832992e01b26a067425caf87f5f544c4770a76221398a045.mpeg",
              totalplays: 0,
              albumID: "mw_albce1aee72-ca8e-4f75-beb6-da1d63e56415"
            }
          ]
        }
      ]
    },
    {
      heading: "Discover new Artists to listen and follow.",
      featuredArtists: [
        {
          id: "martist6503fb93a6188med",
          profilephoto: "https://artist.mwonya.com/assets/images/artistprofiles/Thy Medi _profile_20230915063707_04363.jpg",
          name: "Thy'Medi "
        },
        {
          id: "martist61a9b42104d0dryy",
          profilephoto: "https://assets.mwonya.com/images/artistprofiles/Ryymes Official_profile_20211203060729_02626.jpg",
          name: "Ryymes Official"
        },
        {
          id: "martist645bed2a7ee6fsin",
          profilephoto: "https://assets.mwonya.com/images/artistprofiles/artist_profile_2023051020_Dickens Darius_martist645bed2a7ee6fsin.jpg",
          name: "Dickens Darius"
        },
        {
          id: "martist6059d3966ef4cthe",
          profilephoto: "https://assets.mwonya.com/images/artistprofiles/Deed X Shay_profile_20210323114006_00872.jpg",
          name: "Deed X Shay"
        },
        {
          id: "martist63f488298fbb9sha",
          profilephoto: "https://assets.mwonya.com/images/artistprofiles/Shally _profile_20230221090025_06235.jpg",
          name: "Shally "
        }
      ]
    },
    {
      heading: "Mwonya Playlists Recommended Just For You.",
      featuredPlaylists: [
        {
          id: "mwP_mobile6b2496c8fe_daylist",
          name: "Daylist - Dance Party",
          owner: "Mwonya",
          coverurl: "https://assets.mwonya.com/images/daylistcover.png"
        },
        {
          id: "mwPL660e4898db7dbmw63e",
          name: "Slaps",
          owner: "Mwonya",
          coverurl: "https://assets.mwonya.com/images/createdplaylist/Instagram post - 354.png"
        },
        {
          id: "mwP_mobile6b2496c8fe",
          name: "New Music Fridays",
          owner: "Mwonya",
          coverurl: "https://assets.mwonya.com/RawFiles/Instagram post - 392.png"
        },
        {
          id: "mwP_mobile65d1e4bd520f7",
          name: "That Sound",
          owner: "Mwonya",
          coverurl: "https://assets.mwonya.com/images/createdplaylist/thatsound.png"
        },
        {
          id: "mwPL660eaad0525b8mw63e",
          name: "DJ EXTENDED",
          owner: "Mwonya",
          coverurl: "https://assets.mwonya.com/images/createdplaylist/Instagram post - 357.png"
        },
        {
          id: "mwP_mobile65bf3e49b10d5",
          name: "Editors' Picks",
          owner: "Mwonya",
          coverurl: "https://assets.mwonya.com/images/createdplaylist/editorspick.png"
        }
      ]
    },
    {
      heading: "Artists Followed by You.",
      featuredArtists: [
        {
          id: "martist647a1567cd1caava",
          profilephoto: "https://assets.mwonya.com/images/artistprofiles/The Goddess Lawino _profile_20230602161431_05706.jpg",
          name: "The Goddess Lawino "
        },
        {
          id: "martist638dd358c0f7aabb",
          profilephoto: "https://assets.mwonya.com/images/artistprofiles/Abbey Tumusiime_profile_20221205111744_02916.jpeg",
          name: "Abbey Tumusiime"
        },
        {
          id: "martist60472ab113e8fsmo",
          profilephoto: "https://assets.mwonya.com/images/artistprofiles/Smokie allan profile.jpg",
          name: "Smokie Allan"
        },
        {
          id: "martist629883d2dca17kay",
          profilephoto: "https://assets.mwonya.com/images/artistprofiles/Instagram post - 356.png",
          name: "Joka"
        },
        {
          id: "martist605df0bdc53a0neo",
          profilephoto: "https://assets.mwonya.com/images/artistprofiles/Neo Okello_profile_20210326143333_07527.jpg",
          name: "Neo Okello"
        }
      ]
    }
  ]
};

const UserLibraryScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState('all');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const NewReleaseCard = ({ item }) => (
    <TouchableOpacity style={styles.newReleaseCard} activeOpacity={0.8}>
      <Image source={{ uri: item.artworkPath }} style={styles.newReleaseArtwork} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.newReleaseGradient}
      />
      <View style={styles.newReleaseContent}>
        <View style={styles.newReleaseHeader}>
          <Image source={{ uri: item.artistArtwork }} style={styles.artistAvatar} />
          <View style={styles.newReleaseInfo}>
            <Text style={styles.newReleaseTitle}>{item.title}</Text>
            <Text style={styles.newReleaseArtist}>{item.artist}</Text>
          </View>
          {item.exclusive && (
            <View style={styles.exclusiveBadge}>
              <Text style={styles.exclusiveText}>EXCLUSIVE</Text>
            </View>
          )}
        </View>
        <View style={styles.trackInfo}>
          <MaterialIcons name="music-note" size={14} color={colors.primary} />
          <Text style={styles.trackCount}>{item.Tracks.length} track{item.Tracks.length !== 1 ? 's' : ''}</Text>
          <Text style={styles.genre}>{item.Tracks[0]?.genre}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ArtistCard = ({ item, size = 'medium' }) => (
    <TouchableOpacity 
      style={[styles.artistCard, size === 'small' && styles.artistCardSmall]} 
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.profilephoto }} style={[styles.artistImage, size === 'small' && styles.artistImageSmall]} />
      <Text style={[styles.artistName, size === 'small' && styles.artistNameSmall]} numberOfLines={2}>
        {item.name.trim()}
      </Text>
    </TouchableOpacity>
  );

  const PlaylistCard = ({ item, index }) => (
    <TouchableOpacity 
      style={[styles.playlistCard, index === 0 && styles.firstPlaylistCard]} 
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.coverurl }} style={styles.playlistImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.playlistGradient}
      />
      <View style={styles.playlistContent}>
        <Text style={styles.playlistName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.playlistOwner}>by {item.owner}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSection = ({ item, index }) => {
    if (item.HomeRelease) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{item.heading}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={item.HomeRelease}
            renderItem={({ item }) => <NewReleaseCard item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      );
    }

    if (item.featuredArtists) {
      const isFollowedSection = item.heading.includes('Followed by You');
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{item.heading}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={item.featuredArtists}
            renderItem={({ item }) => (
              <ArtistCard 
                item={item} 
                size={isFollowedSection ? 'small' : 'medium'} 
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal={!isFollowedSection}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={isFollowedSection ? styles.followedArtistsList : styles.horizontalList}
            numColumns={isFollowedSection ? 2 : 1}
            key={isFollowedSection ? 'followed' : 'discover'}
          />
        </View>
      );
    }

    if (item.featuredPlaylists) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{item.heading}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={item.featuredPlaylists}
            renderItem={({ item, index }) => <PlaylistCard item={item} index={index} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      );
    }

    return null;
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <BlurView intensity={80} style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Your Library</Text>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {['all', 'playlists', 'artists', 'albums'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Good evening</Text>
            <Text style={styles.welcomeSubtext}>What would you like to listen to?</Text>
          </View>

          <FlatList
            data={libraryData.Library}
            renderItem={renderSection}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.sectionsList}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.matteBlack,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 90,
  },
  headerBlur: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.text,
  },
  searchButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.matteBlack,
    marginTop: 90,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: colors.neutral800,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.black,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: fontSize.display,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: fontSize.lg,
    color: colors.textLight,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  seeAllText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  horizontalList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  newReleaseCard: {
    width: screenWidth * 0.8,
    height: 200,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.neutral800,
    position: 'relative',
  },
  newReleaseArtwork: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  newReleaseGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  newReleaseContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  newReleaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  artistAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  newReleaseInfo: {
    flex: 1,
  },
  newReleaseTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  newReleaseArtist: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  exclusiveBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  exclusiveText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.black,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackCount: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginLeft: 5,
    marginRight: 10,
  },
  genre: {
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  artistCard: {
    width: 120,
    alignItems: 'center',
    marginRight: 15,
  },
  artistCardSmall: {
    width: (screenWidth - 60) / 2,
    marginRight: 0,
    marginBottom: 20,
  },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  artistImageSmall: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  artistName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  artistNameSmall: {
    fontSize: fontSize.sm,
  },
  followedArtistsList: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  playlistCard: {
    width: 150,
    height: 180,
    marginRight: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.neutral800,
    position: 'relative',
  },
  firstPlaylistCard: {
    width: 200,
    height: 200,
  },
  playlistImage: {
    width: '100%',
    height: '70%',
  },
  playlistGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  playlistContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  playlistName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  playlistOwner: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  sectionsList: {
    paddingBottom: 20,
  },
});

export default UserLibraryScreen;

