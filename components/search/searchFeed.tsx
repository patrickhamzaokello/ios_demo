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

const { width } = Dimensions.get("window");
const CATEGORY_WIDTH = width * 0.4;

// Mock data
const recentSearches = [
  "Taylor Swift",
  "Kendrick Lamar",
  "Drake",
  "Billie Eilish",
  "The Weeknd",
];

const categories = [
  {
    id: "1",
    name: "Hip-Hop",
    image: "https://via.placeholder.com/200/222222/ffffff?text=Hip-Hop",
  },
  {
    id: "2",
    name: "Pop",
    image: "https://via.placeholder.com/200/222222/ffffff?text=Pop",
  },
  {
    id: "3",
    name: "R&B/Soul",
    image: "https://via.placeholder.com/200/222222/ffffff?text=R&B",
  },
  {
    id: "4",
    name: "Rock",
    image: "https://via.placeholder.com/200/222222/ffffff?text=Rock",
  },
  {
    id: "5",
    name: "Dance",
    image: "https://via.placeholder.com/200/222222/ffffff?text=Dance",
  },
  {
    id: "6",
    name: "Latin",
    image: "https://via.placeholder.com/200/222222/ffffff?text=Latin",
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();

  const {
    data: searchResults,
    isLoading,
    error,
    suggestedWord,
    totalResults,
    hasMore,
  } = useSearch(submittedQuery, currentPage);

  // Fade in animation for suggestion
  useEffect(() => {
    if (suggestedWord) {
      setShowSuggestion(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setShowSuggestion(false);
      fadeAnim.setValue(0);
    }
  }, [suggestedWord]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length === 0) {
      setSubmittedQuery("");
      setIsSearching(false);
      setCurrentPage(1);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      setSubmittedQuery(searchQuery.trim());
      setIsSearching(true);
      setCurrentPage(1);
      Keyboard.dismiss();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSubmittedQuery("");
    setIsSearching(false);
    setCurrentPage(1);
    searchInputRef.current?.focus();
  };

  const handleUseSuggestion = () => {
    // Extract the suggested word from the "Did you mean: X?" format
    const suggested = suggestedWord.match(/Did you mean: (.*)\?/);
    if (suggested && suggested[1]) {
      setSearchQuery(suggested[1]);
      setSubmittedQuery(suggested[1]);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    setSubmittedQuery(query);
    setIsSearching(true);
    setCurrentPage(1);
  };

  const convertToTrack = (item: any) => {
    return {
      id: item.id,
      url: item.path,
      title: item.title,
      artist: item.artist,
      artwork: item.artworkPath,
      duration: parseInt(item.track_duration) || 0,
      // Add any other Track properties you need
    };
  };

  // Handle playing a single track
  const handleTrackSelect = async (
    selectedTrack: ReturnType<typeof convertToTrack>
  ) => {
    try {
      // Get current queue
      const queue = await TrackPlayer.getQueue();

      // Check if the track is already in the queue
      const trackIndex = queue.findIndex(
        (track) => track.id === selectedTrack.id
      );

      if (trackIndex > -1) {
        // If track exists in queue, play it directly
        await TrackPlayer.skip(trackIndex);
      } else {
        // If not in queue, reset and add the new track
        await TrackPlayer.reset();
        await TrackPlayer.add(selectedTrack);
      }

      // Start playing
      await TrackPlayer.play();

      // Optionally: navigate to player screen if needed
      // router.push('/player');
    } catch (error) {
      console.error("Error playing track:", error);
      // You might want to show an error message to the user here
    }
  };

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryImageContainer}>
        <FastImage
          source={{
            uri: item.image ?? unknownTrackImageUri,
            priority: FastImage.priority.normal,
          }}
          style={styles.categoryImage}
        />
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }: { item: any }) => {
    const track = convertToTrack(item);
    const isActiveTrack = activeTrack?.url === track.url;
    switch (item.type) {
      case "song":
        return (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleTrackSelect(track)}
          >
            <View style={{ position: "relative" }}>
              <FastImage
                source={{
                  uri: item.artworkPath ?? unknownTrackImageUri,
                  priority: FastImage.priority.normal,
                }}
                style={{
                  ...styles.resultImage,
                  opacity: isActiveTrack ? 0.6 : 1,
                }}
              />
              {isActiveTrack &&
                (playing ? (
                  <LoaderKit
                    style={styles.trackPlayingIconIndicator}
                    name="LineScaleParty"
                    color={colors.primary}
                  />
                ) : (
                  <Ionicons
                    style={styles.trackPausedIndicator}
                    name="play"
                    size={24}
                    color={colors.primary}
                  />
                ))}
            </View>

            <View style={styles.resultTextContainer}>
              <Text
                style={{
                  ...styles.resultTitle,
                  color: isActiveTrack ? colors.primary : colors.text,
                }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <View style={styles.resultMetaContainer}>
                <Text style={styles.resultSubtitle} numberOfLines={1}>
                  {item.artist}
                </Text>
                {item.album_name && (
                  <>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Text style={styles.resultSubtitle} numberOfLines={1}>
                      {item.album_name}
                    </Text>
                  </>
                )}
              </View>
              <View style={styles.resultStats}>
                <Ionicons name="play" size={12} color="#999" />
                <Text style={styles.statsText}>
                  {item.plays.toLocaleString()}
                </Text>
                <Text style={styles.dotSeparator}>•</Text>
                <Text style={styles.statsText}>{item.track_duration}</Text>
                {item.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={12}
                      color="#1DB954"
                    />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      case "artist":
        return (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(search)/home_artist_details",
                params: {
                  artist_id: item.id,
                },
              })
            }
          >
            <FastImage
              source={{
                uri: item.artworkPath ?? unknownTrackImageUri,
                priority: FastImage.priority.normal,
              }}
              style={[styles.resultImage, styles.artistImage]}
            />
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultTitle} numberOfLines={2}>
                {item.artist}
              </Text>
              <Text style={styles.resultSubtitle} numberOfLines={2}>
                Artist
              </Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      case "album":
        return (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(search)/new_release",
                params: {
                  releaseid: item.id,
                },
              })
            }
          >
            <FastImage
              source={{
                uri: item.artworkPath ?? unknownTrackImageUri,
                priority: FastImage.priority.normal,
              }}
              style={{
                ...styles.resultImage,
                opacity: isActiveTrack ? 0.6 : 1,
              }}
            />
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.resultSubtitle} numberOfLines={2}>
                {item.artist}
              </Text>
            </View>
            <View style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>Open</Text>
            </View>
          </TouchableOpacity>
        );
      case "playlist":
        return (
          <TouchableOpacity style={styles.resultItem}>
            <FastImage
              source={{
                uri: item.artworkPath ?? unknownTrackImageUri,
                priority: FastImage.priority.normal,
              }}
              style={{
                ...styles.resultImage,
                opacity: isActiveTrack ? 0.6 : 1,
              }}
            />
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultTitle}>{item.title}</Text>
              <Text style={styles.resultSubtitle}>Playlist</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Artists, Songs, Lyrics, and More"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <View style={styles.clearButton}>
                <Ionicons name="close-circle-sharp" size={16} color="#999" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Suggested search term */}
      {showSuggestion && suggestedWord && (
        <Animated.View
          style={[styles.suggestionContainer, { opacity: fadeAnim }]}
        >
          <Text style={styles.suggestionText}>{suggestedWord}</Text>
          <TouchableOpacity
            style={styles.suggestionButton}
            onPress={handleUseSuggestion}
          >
            <Text style={styles.suggestionButtonText}>Use Suggestion</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {isSearching && searchResults?.length === 0 && !isLoading && (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={64} color="#666" />
          <Text style={styles.noResultsText}>
            No results found for "{submittedQuery}"
          </Text>
          <Text style={styles.noResultsHint}>
            Try checking your spelling or using different keywords
          </Text>
        </View>
      )}

      {isSearching && searchResults?.length > 0 && (
        <View style={styles.resultsInfoContainer}>
          <Text style={styles.resultsInfoText}>
            {totalResults} {totalResults === 1 ? "result" : "results"} for "
            {submittedQuery}"
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          isSearching && searchResults?.length === 0 && !isLoading
            ? { flex: 1 }
            : {}
        }
      >
        {isSearching ? (
          /* Search Results */
          <View style={styles.resultsContainer}>
            {isLoading && currentPage === 1 ? (
              <ActivityIndicator
                size="large"
                color="#FFF"
                style={styles.loadingIndicator}
              />
            ) : error ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle-outline"
                  size={64}
                  color="#FF2D55"
                />
                <Text style={styles.errorText}>
                  Something went wrong. Please try again.
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => handleSearchSubmit()}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              searchResults?.length > 0 && (
                <>
                  <FlatList
                    data={searchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => (
                      <View style={styles.itemSeparator} />
                    )}
                  />

                  {hasMore && (
                    <TouchableOpacity
                      style={styles.loadMoreButton}
                      onPress={handleLoadMore}
                      disabled={isLoading}
                    >
                      {isLoading && currentPage > 1 ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Text style={styles.loadMoreButtonText}>Load More</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </>
              )
            )}
          </View>
        ) : (
          /* Browse Content */
          <>
            {/* Recent Searches */}
            <View style={styles.recentContainer}>
              <View style={styles.recentHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recentList}>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentItem}
                    onPress={() => handleRecentSearch(search)}
                  >
                    <BlurView
                      intensity={20}
                      tint="dark"
                      style={styles.recentItemBlur}
                    >
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color="#FFF"
                        style={styles.recentIcon}
                      />
                      <Text style={styles.recentText}>{search}</Text>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Browse Categories */}
            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Browse Categories</Text>
              <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id}
                horizontal={false}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.categoriesGrid}
              />
            </View>
          </>
        )}
      </ScrollView>
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  trackPlayingIconIndicator: {
    position: "absolute",
    top: 18,
    left: 16,
    width: 16,
    height: 16,
  },
  trackPausedIndicator: {
    position: "absolute",
    top: 14,
    left: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: "#FFF",
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(50, 50, 50, 0.6)",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  suggestionText: {
    color: "#CCC",
    fontSize: 14,
  },
  suggestionButton: {
    backgroundColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  suggestionButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recentContainer: {
    marginBottom: 24,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 12,
  },
  clearText: {
    fontSize: 16,
    color: "#FF2D55",
  },
  recentList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  recentItem: {
    marginRight: 10,
    marginBottom: 10,
  },
  recentItemBlur: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(60, 60, 60, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  recentIcon: {
    marginRight: 6,
  },
  recentText: {
    fontSize: 14,
    color: "#FFF",
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesGrid: {
    alignItems: "center",
  },
  categoryItem: {
    width: CATEGORY_WIDTH,
    height: CATEGORY_WIDTH * 0.6,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.matteBlack,
    overflow: "hidden",
  },
  categoryImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    borderRadius: 8,
  },
  categoryName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  resultsContainer: {
    marginTop: 8,
    paddingBottom: 200,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  resultImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#333", // Placeholder color while loading
  },
  artistImage: {
    borderRadius: 24, // Make artist images circular
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
    marginBottom: 4,
  },
  resultSubtitle: {
    color: "#999",
    fontSize: 14,
  },
  resultMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  resultStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsText: {
    color: "#999",
    fontSize: 12,
    marginLeft: 4,
    marginRight: 4,
  },
  dotSeparator: {
    color: "#999",
    marginHorizontal: 4,
    fontSize: 12,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(29, 185, 84, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  verifiedText: {
    color: "#1DB954",
    fontSize: 10,
    marginLeft: 2,
  },
  actionButton: {
    padding: 8,
  },
  followButton: {
    backgroundColor: "#333",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
  },
  followButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
  },
  viewDetailsButton: {
    backgroundColor: "#333",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
  },
  viewDetailsText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
  },
  itemSeparator: {
    height: 0.5,
    backgroundColor: "#333",
  },
  loadMoreButton: {
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  loadMoreButtonText: {
    color: "#FFF",
    fontWeight: "500",
  },
  loadingIndicator: {
    marginTop: 24,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    color: "#FF2D55",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#FF2D55",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "500",
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
  resultsInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsInfoText: {
    color: "#999",
    fontSize: 14,
  },
});
