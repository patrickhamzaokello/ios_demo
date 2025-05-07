import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import AlbumDetails from "@/components/Album/AlbumDetails";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, fontSize } from "@/constants/theme";
import { useAlbumDetailsData } from "@/hooks/albumFixedData";

const AlbumScreen = () => {
  const { releaseid } = useLocalSearchParams<{
    releaseid: string;
  }>();

  const { data, loading, error, refetch } = useAlbumDetailsData(releaseid);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching new Release...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.retryText} onPress={refetch}>
            Tap to retry
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AlbumDetails data={data} goBack={() => {}} goMore={() => {}} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: colors.primary,
    fontSize: fontSize.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.lg,
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "center",
  },
  retryText: {
    color: colors.primary,
    fontSize: fontSize.md,
    textDecorationLine: "underline",
  },
});

export default AlbumScreen;
