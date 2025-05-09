import React, { useMemo } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    FlatList,
    SafeAreaView,
    StatusBar,
  } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import FastImage from "@d11/react-native-fast-image";
import { unknownTrackImageUri } from "@/constants/images";
import { colors } from "@/constants/theme";
import BackButton from "../BackButton";
import MoreButton from "../MoreButton";
import { MwonyaArtistDetailsResponse, Track, Album, RelatedArtist } from "@/types/artist";
import ArtistIntro from "./ArtistIntroSection";
import ArtistBioFooter from "./ArtistBiodata";



interface ArtistDetailsProps {
  artistData: MwonyaArtistDetailsResponse;
  goBack: () => void;
  goMore: () => void;
}

const ArtistDetails: React.FC<ArtistDetailsProps> = ({
  artistData,
  goBack,
  goMore,
}) => {
  // Find specific section types
  const introSection = artistData.Artist.find(
    (section) => section.Type === "intro"
  );
  const pickSection = artistData.Artist.find(
    (section) => section.Type === "pick"
  );
  const trendingSection = artistData.Artist.find(
    (section) => section.Type === "trending"
  );
  const releaseSection = artistData.Artist.find(
    (section) => section.Type === "release"
  );
  const relatedArtistSection = artistData.Artist.find(
    (section) => section.Type === "related_artist"
  );
  const bioSection = artistData.Artist.find(
    (section) => section.Type === "bio"
  );

  const artistIntro = introSection ? introSection.ArtistIntro[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        {/* Header with back and share buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
       
        </View>

        {/* Artist Intro Section */}
        {artistIntro && <ArtistIntroSection artistIntro={artistIntro} />}

    

        {/* Latest Release Section */}
        {pickSection && <LatestReleaseSection pickData={pickSection} />}

        {/* Popular Tracks Section */}
        {trendingSection && <PopularTracksSection trendingData={trendingSection} />}

        {/* Discography Section */}
        {releaseSection && <DiscographySection releaseData={releaseSection} />}

        {/* Related Artists Section */}
        {relatedArtistSection && <RelatedArtistsSection relatedData={relatedArtistSection} />}

        {/* Artist Bio Section */}
        {bioSection && <ArtistBioSection bioData={bioSection} />}
      </ScrollView>
    </SafeAreaView>
  );
};

// Artist Intro Section Component
const ArtistIntroSection = ({ artistIntro }: { artistIntro: any }) => {
  return (
    <ArtistIntro artist={artistIntro}/>
  );
};

// Latest Release Section Component
const LatestReleaseSection = ({ pickData }: { pickData: any }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{pickData.heading}</Text>
      {pickData.ArtistPick.map((pick: any) => (
        <View key={pick.id} style={styles.releaseCard}>
          <Image source={{ uri: pick.coverimage }} style={styles.releaseImage} />
          <View style={styles.releaseInfo}>
            <Text style={styles.releaseTitle}>{pick.song_title}</Text>
            <Text style={styles.releaseDate}>{pick.out_now}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// Popular Tracks Section Component
const PopularTracksSection = ({ trendingData }: { trendingData: any }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{trendingData.heading}</Text>
      {trendingData.Tracks.map((track: Track, index: number) => (
        <View key={track.id} style={styles.trackItem}>
          <Image source={{ uri: track.artworkPath }} style={styles.trackImage} />
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{track.title}</Text>
            <Text style={styles.trackDetails}>
              {track.totalplays} Plays • {track.album} • {track.genre}
            </Text>
          </View>
          <TouchableOpacity style={styles.trackMoreButton}>
            <Feather name="more-vertical" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

// Discography Section Component
const DiscographySection = ({ releaseData }: { releaseData: any }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderWithAction}>
        <Text style={styles.sectionHeading}>{releaseData.heading}</Text>
        <TouchableOpacity>
          <Text style={styles.viewMoreText}>View more</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={releaseData.ArtistAlbum}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Album }) => (
          <TouchableOpacity style={styles.albumCard}>
            <Image source={{ uri: item.artworkPath }} style={styles.albumImage} />
            <Text style={styles.albumTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.albumDate}>{item.datecreated}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Related Artists Section Component
const RelatedArtistsSection = ({ relatedData }: { relatedData: any }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{relatedData.heading}</Text>
      <FlatList
        data={relatedData.RelatedArtist}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: RelatedArtist }) => (
          <TouchableOpacity style={styles.relatedArtistCard}>
            <Image 
              source={{ uri: item.profilephoto }} 
              style={styles.relatedArtistImage} 
            />
            <Text style={styles.relatedArtistName} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Artist Bio Section Component
const ArtistBioSection = ({ bioData }: { bioData: any }) => {
  const bio = bioData.Bio[0];
  
  return (
    <ArtistBioFooter artist={bio} bioData={bioData}/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconButton: {
    padding: 8,
  },
  


  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionHeading: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewMoreText: {
    color: '#6200EA',
    fontSize: 14,
  },
  releaseCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
  },
  releaseImage: {
    width: 60,
    height: 60,
  },
  releaseInfo: {
    padding: 12,
    flex: 1,
  },
  releaseTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  releaseDate: {
    color: '#aaa',
    fontSize: 12,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  trackInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  trackTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  trackDetails: {
    color: '#999',
    fontSize: 12,
  },
  trackMoreButton: {
    padding: 8,
  },
  albumCard: {
    width: 140,
    marginRight: 16,
  },
  albumImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  albumTitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  albumDate: {
    color: '#999',
    fontSize: 12,
  },
  relatedArtistCard: {
    width: 100,
    alignItems: 'center',
    marginRight: 16,
  },
  relatedArtistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  relatedArtistName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },

});

export default ArtistDetails;
