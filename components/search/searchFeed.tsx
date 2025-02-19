import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors } from '@/constants/theme';

const { width } = Dimensions.get('window');
const CATEGORY_WIDTH = width * 0.4;

// Mock data
const recentSearches = [
    'Taylor Swift', 'Kendrick Lamar', 'Drake', 'Billie Eilish', 'The Weeknd'
];

const categories = [
    { id: '1', name: 'Hip-Hop', image: 'https://via.placeholder.com/200/222222/ffffff?text=Hip-Hop' },
    { id: '2', name: 'Pop', image: 'https://via.placeholder.com/200/222222/ffffff?text=Pop' },
    { id: '3', name: 'R&B/Soul', image: 'https://via.placeholder.com/200/222222/ffffff?text=R&B' },
    { id: '4', name: 'Rock', image: 'https://via.placeholder.com/200/222222/ffffff?text=Rock' },
    { id: '5', name: 'Dance', image: 'https://via.placeholder.com/200/222222/ffffff?text=Dance' },
    { id: '6', name: 'Latin', image: 'https://via.placeholder.com/200/222222/ffffff?text=Latin' },
];

const topResults = [
    { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', image: 'https://via.placeholder.com/60/222222/ffffff?text=BL' },
    { id: '2', title: 'As It Was', artist: 'Harry Styles', image: 'https://via.placeholder.com/60/222222/ffffff?text=AIW' },
    { id: '3', title: 'Bad Habits', artist: 'Ed Sheeran', image: 'https://via.placeholder.com/60/222222/ffffff?text=BH' },
];

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (text) => {
        setSearchQuery(text);
        setIsSearching(text.length > 0);
    };

    const renderCategory = ({ item }) => (
        <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryImageContainer}>
                <Image source={{ uri: item.image || 'https://via.placeholder.com/200/222222/ffffff?text=Hip-Hop' }} style={styles.categoryImage} />
                <Text style={styles.categoryName}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderTopResult = ({ item }) => (
        <TouchableOpacity style={styles.resultItem}>
            <Image source={{ uri: item.image }} style={styles.resultImage} />
            <View style={styles.resultTextContainer}>
                <Text style={styles.resultTitle}>{item.title}</Text>
                <Text style={styles.resultArtist}>{item.artist}</Text>
            </View>
            <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Search</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Artists, Songs, Lyrics, and More"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={handleSearch}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <View style={styles.clearButton}>
                                <Ionicons name="close-circle-sharp" size={16} color="#999" />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView style={styles.content}>
                {isSearching ? (
                    /* Search Results */
                    <View style={styles.resultsContainer}>
                        <Text style={styles.sectionTitle}>Top Results</Text>
                        <FlatList
                            data={topResults}
                            renderItem={renderTopResult}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                        />
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
                                    <TouchableOpacity key={index} style={styles.recentItem}>
                                        <BlurView intensity={20} tint="dark" style={styles.recentItemBlur}>
                                            <Ionicons name="time-outline" size={14} color="#FFF" style={styles.recentIcon} />
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
                                keyExtractor={item => item.id}
                                horizontal={false}
                                numColumns={2}
                                scrollEnabled={false}
                                contentContainerStyle={styles.categoriesGrid}
                            />
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Bottom Tab Bar Placeholder */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFF',
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 38,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        color: '#FFF',
        fontSize: 16,
    },
    clearButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    recentContainer: {
        marginBottom: 24,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 12,
    },
    clearText: {
        fontSize: 16,
        color: '#FF2D55',
    },
    recentList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    recentItem: {
        marginRight: 10,
        marginBottom: 10,
    },
    recentItemBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(60, 60, 60, 0.5)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    recentIcon: {
        marginRight: 6,
    },
    recentText: {
        fontSize: 14,
        color: '#FFF',
    },
    categoriesContainer: {
        marginBottom: 24,
    },
    categoriesGrid: {
        alignItems: 'center',
    },
    categoryItem: {
        width: CATEGORY_WIDTH,
        height: CATEGORY_WIDTH * 0.6,
        marginHorizontal: 8,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.matteBlack,
        overflow: 'hidden',
    },
    categoryImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryImage: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
        borderRadius: 8,
    },
    categoryName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    resultsContainer: {
        marginTop: 16,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
    },
    resultImage: {
        width: 48,
        height: 48,
        borderRadius: 6,
        marginRight: 12,
    },
    resultTextContainer: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFF',
        marginBottom: 4,
    },
    resultArtist: {
        fontSize: 14,
        color: '#999',
    },

});