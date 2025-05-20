// components/Search/RecentSearches.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

type RecentSearchesProps = {
  searches: string[];
  onSearch: (query: string) => void;
};

export default function RecentSearches({ searches, onSearch }: RecentSearchesProps) {
  return (
    <View style={styles.recentContainer}>
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <TouchableOpacity>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recentList}>
        {searches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentItem}
            onPress={() => onSearch(search)}
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
  );
}

const styles = StyleSheet.create({
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
});