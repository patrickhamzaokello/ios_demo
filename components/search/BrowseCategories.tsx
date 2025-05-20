// components/Search/BrowseCategories.tsx
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import FastImage from "@d11/react-native-fast-image";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "@/constants/theme";

const { width } = Dimensions.get("window");
const CATEGORY_WIDTH = width * 0.4;

type Category = {
  id: string;
  name: string;
  image: string;
};

type BrowseCategoriesProps = {
  categories: Category[];
};

export default function BrowseCategories({ categories }: BrowseCategoriesProps) {
  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryImageContainer}>
        <FastImage
          source={{
            uri: item.image,
            priority: FastImage.priority.normal,
          }}
          style={styles.categoryImage}
        />
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
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
  );
}

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 12,
  },
});