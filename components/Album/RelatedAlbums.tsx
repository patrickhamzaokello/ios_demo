import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacingX, spacingY, borderRadius } from '@/constants/theme';

interface AlbumItem {
  id: string;
  title: string;
  artist: string;
  artworkPath: string;
  description?: string;
  datecreated?: string;
}

interface RelatedAlbumsProps {
  title: string;
  albums: AlbumItem[];
}

const { width } = Dimensions.get('window');
const ALBUM_WIDTH = (width - spacingX._20 * 2 - spacingX._12 * 2) / 2.5;

const RelatedAlbums: React.FC<RelatedAlbumsProps> = ({ title, albums }) => {
  const router = useRouter();

  const handleAlbumPress = (album: AlbumItem) => {
    router.push({
      pathname: `/(tabs)/(home)/new_release`,
      params: {
        releaseid: album.id,
        releaseTitle: album.title,
        releaseArtist: album.artist,
        releaseArtwork: album.artworkPath
      }
    });
  };

  const renderAlbum = ({ item }: { item: AlbumItem }) => (
    <TouchableOpacity 
      style={styles.albumContainer}
      onPress={() => handleAlbumPress(item)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.artworkPath }} 
        style={styles.albumArtwork}
        resizeMode="cover"
      />
      <Text style={styles.albumTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.albumArtist} numberOfLines={1}>{item.artist}</Text>
      {item.datecreated && (
        <Text style={styles.albumDate}>{item.datecreated}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>
      <FlatList
        data={albums}
        renderItem={renderAlbum}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacingY._25,
  },
  heading: {
    fontSize: fontSize.xl,
    color: colors.primary,
    marginBottom: spacingY._17,
    paddingHorizontal: spacingX._20,
  },
  listContent: {
    paddingHorizontal: spacingX._20,
  },
  albumContainer: {
    width: ALBUM_WIDTH,
    marginRight: spacingX._12,
  },
  albumArtwork: {
    width: ALBUM_WIDTH,
    height: ALBUM_WIDTH,
    borderRadius: borderRadius.sm,
    marginBottom: spacingY._10,
  },
  albumTitle: {
    fontSize: fontSize.md,
    color: colors.neutral100,
    marginBottom: 2,
  },
  albumArtist: {
    fontSize: fontSize.sm,
    color: colors.neutral300,
    marginBottom: 2,
  },
  albumDate: {
    fontSize: fontSize.xs,
    color: colors.neutral300,
  },
});

export default RelatedAlbums;