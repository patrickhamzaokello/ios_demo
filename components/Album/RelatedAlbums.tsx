import { unknownTrackImageUri } from "@/constants/images";
import {
  borderRadius,
  colors,
  fontSize,
  spacingX,
  spacingY,
} from "@/constants/theme";
import FastImage from "@d11/react-native-fast-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

const { width } = Dimensions.get("window");
const ALBUM_WIDTH = (width - spacingX._20 * 2 - spacingX._12 * 2) / 1.7;

const RelatedAlbums: React.FC<RelatedAlbumsProps> = ({ title, albums }) => {
  const router = useRouter();

  const handleAlbumPress = (album: AlbumItem) => {
    router.push({
      pathname: `/(tabs)/(home)/albumDetailsPage`,
      params: { releaseid: album.id },
    });
  };

  const renderAlbum = ({ item }: { item: AlbumItem }) => (
    <TouchableOpacity
      style={styles.albumContainer}
      onPress={() => handleAlbumPress(item)}
      activeOpacity={0.8}
    >
      <FastImage
        source={{
          uri: item.artworkPath ?? unknownTrackImageUri,
          priority: FastImage.priority.normal,
        }}
        style={styles.albumArtwork}
        resizeMode="cover"
      />
      <Text style={styles.albumTitle} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={styles.albumArtist}>
        {item.artist}• {item.datecreated}
      </Text>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
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
    marginBottom: 6,
  },
  albumArtist: {
    fontSize: fontSize.sm,
    color: colors.neutral500,
  },
});

export default RelatedAlbums;
