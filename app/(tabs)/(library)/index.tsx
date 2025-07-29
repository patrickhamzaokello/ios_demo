import { colors, fontSize, fontWeight, radius, shadow, spacingX, spacingY } from '@/constants/theme';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Modal,
  FlatList,
  Alert
} from 'react-native';



// Mock data
const mockLikedTracks = [
  { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', album: 'After Hours', image: 'https://via.placeholder.com/60x60/333/fff?text=BL' },
  { id: '2', title: 'Watermelon Sugar', artist: 'Harry Styles', duration: '2:54', album: 'Fine Line', image: 'https://via.placeholder.com/60x60/333/fff?text=WS' },
  { id: '3', title: 'Good 4 U', artist: 'Olivia Rodrigo', duration: '2:58', album: 'SOUR', image: 'https://via.placeholder.com/60x60/333/fff?text=G4U' },
  { id: '4', title: 'Levitating', artist: 'Dua Lipa', duration: '3:23', album: 'Future Nostalgia', image: 'https://via.placeholder.com/60x60/333/fff?text=LEV' },
  { id: '5', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', duration: '2:21', album: 'Stay', image: 'https://via.placeholder.com/60x60/333/fff?text=ST' },
];

const mockPlaylists = [
  { id: '1', name: 'My Favorites', trackCount: 45, image: 'https://via.placeholder.com/80x80/a3e635/000?text=♪' },
  { id: '2', name: 'Workout Mix', trackCount: 32, image: 'https://via.placeholder.com/80x80/ef4444/fff?text=💪' },
  { id: '3', name: 'Chill Vibes', trackCount: 28, image: 'https://via.placeholder.com/80x80/3498DB/fff?text=🌊' },
  { id: '4', name: 'Party Hits', trackCount: 67, image: 'https://via.placeholder.com/80x80/F7B633/000?text=🎉' },
];

const MusicLibraryPage = () => {
  const [activeTab, setActiveTab] = useState('playlists');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlists, setPlaylists] = useState(mockPlaylists);
  const [likedTracks] = useState(mockLikedTracks);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = {
        id: Date.now().toString(),
        name: newPlaylistName.trim(),
        trackCount: 0,
        image: 'https://via.placeholder.com/80x80/a3e635/000?text=♪'
      };
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
    }
  };

  const handleDeletePlaylist = (playlistId) => {
    Alert.alert(
      'Delete Playlist',
      'Are you sure you want to delete this playlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setPlaylists(playlists.filter(p => p.id !== playlistId))
        }
      ]
    );
  };

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._10,
        borderRadius: radius._20,
        backgroundColor: isActive ? colors.primary : colors.surface,
        marginRight: spacingX._10,
      }}
    >
      <Text style={{
        color: isActive ? colors.black : colors.text,
        fontSize: fontSize.md,
        fontWeight: isActive ? fontWeight.semibold : fontWeight.medium,
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const PlaylistCard = ({ playlist }) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius._12,
        padding: spacingX._15,
        marginBottom: spacingY._12,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadow.sm,
      }}
      onLongPress={() => handleDeletePlaylist(playlist.id)}
    >
      <Image
        source={{ uri: playlist.image }}
        style={{
          width: 60,
          height: 60,
          borderRadius: radius._8,
          marginRight: spacingX._15,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{
          color: colors.text,
          fontSize: fontSize.lg,
          fontWeight: fontWeight.semibold,
          marginBottom: spacingY._2,
        }}>
          {playlist.name}
        </Text>
        <Text style={{
          color: colors.textLight,
          fontSize: fontSize.sm,
        }}>
          {playlist.trackCount} tracks
        </Text>
      </View>
      <TouchableOpacity
        style={{
          padding: spacingX._8,
        }}
      >
        <Text style={{ color: colors.textLight, fontSize: fontSize.xl }}>⋯</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const TrackItem = ({ track }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacingY._10,
        paddingHorizontal: spacingX._15,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
      }}
    >
      <Image
        source={{ uri: track.image }}
        style={{
          width: 50,
          height: 50,
          borderRadius: radius._6,
          marginRight: spacingX._12,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{
          color: colors.text,
          fontSize: fontSize.md,
          fontWeight: fontWeight.medium,
          marginBottom: spacingY._2,
        }}>
          {track.title}
        </Text>
        <Text style={{
          color: colors.textLight,
          fontSize: fontSize.sm,
        }}>
          {track.artist}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <TouchableOpacity style={{ marginBottom: spacingY._4 }}>
          <Text style={{ color: colors.primary, fontSize: fontSize.lg }}>♥</Text>
        </TouchableOpacity>
        <Text style={{
          color: colors.textLighter,
          fontSize: fontSize.xs,
        }}>
          {track.duration}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPlaylistsTab = () => (
    <View>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingY._20 
      }}>
        <Text style={{
          color: colors.text,
          fontSize: fontSize.xxl,
          fontWeight: fontWeight.bold,
        }}>
          Your Playlists
        </Text>
        <TouchableOpacity
          onPress={() => setShowCreatePlaylist(true)}
          style={{
            backgroundColor: colors.primary,
            borderRadius: radius._20,
            paddingHorizontal: spacingX._16,
            paddingVertical: spacingY._8,
          }}
        >
          <Text style={{
            color: colors.black,
            fontSize: fontSize.md,
            fontWeight: fontWeight.semibold,
          }}>
            + Create
          </Text>
        </TouchableOpacity>
      </View>

      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </View>
  );

  const renderLikedTab = () => (
    <View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacingY._20,
      }}>
        <View style={{
          backgroundColor: colors.primary,
          borderRadius: radius._12,
          padding: spacingX._15,
          marginRight: spacingX._15,
        }}>
          <Text style={{ color: colors.black, fontSize: fontSize.xl }}>♥</Text>
        </View>
        <View>
          <Text style={{
            color: colors.text,
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
          }}>
            Liked Songs
          </Text>
          <Text style={{
            color: colors.textLight,
            fontSize: fontSize.sm,
          }}>
            {likedTracks.length} songs
          </Text>
        </View>
      </View>

      <View style={{
        backgroundColor: colors.surface,
        borderRadius: radius._12,
        overflow: 'hidden',
        ...shadow.sm,
      }}>
        {likedTracks.map((track, index) => (
          <TrackItem key={track.id} track={track} />
        ))}
      </View>
    </View>
  );

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.matteBlack,
    }}>
      {/* Header */}
      <View style={{
        paddingTop: spacingY._50,
        paddingHorizontal: spacingX._20,
        paddingBottom: spacingY._20,
        backgroundColor: colors.neutral900,
      }}>
        <Text style={{
          color: colors.text,
          fontSize: fontSize.display,
          fontWeight: fontWeight.bold,
          marginBottom: spacingY._15,
        }}>
          Your Library
        </Text>

        {/* Tab Navigation */}
        <View style={{ flexDirection: 'row' }}>
          <TabButton
            title="Playlists"
            isActive={activeTab === 'playlists'}
            onPress={() => setActiveTab('playlists')}
          />
          <TabButton
            title="Liked Songs"
            isActive={activeTab === 'liked'}
            onPress={() => setActiveTab('liked')}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacingX._20,
          paddingBottom: spacingY._80,
        }}
      >
        {activeTab === 'playlists' ? renderPlaylistsTab() : renderLikedTab()}
      </ScrollView>

      {/* Create Playlist Modal */}
      <Modal
        visible={showCreatePlaylist}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreatePlaylist(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.8)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: colors.neutral800,
            borderRadius: radius._16,
            padding: spacingX._25,
            width: '80%',
            ...shadow.lg,
          }}>
            <Text style={{
              color: colors.text,
              fontSize: fontSize.xl,
              fontWeight: fontWeight.bold,
              marginBottom: spacingY._20,
              textAlign: 'center',
            }}>
              Create New Playlist
            </Text>

            <TextInput
              style={{
                backgroundColor: colors.surface,
                borderRadius: radius._8,
                padding: spacingX._15,
                color: colors.text,
                fontSize: fontSize.md,
                marginBottom: spacingY._20,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              placeholder="Enter playlist name"
              placeholderTextColor={colors.textLighter}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => {
                  setShowCreatePlaylist(false);
                  setNewPlaylistName('');
                }}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: radius._8,
                  paddingHorizontal: spacingX._20,
                  paddingVertical: spacingY._12,
                  flex: 0.45,
                }}
              >
                <Text style={{
                  color: colors.text,
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.medium,
                  textAlign: 'center',
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreatePlaylist}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: radius._8,
                  paddingHorizontal: spacingX._20,
                  paddingVertical: spacingY._12,
                  flex: 0.45,
                }}
              >
                <Text style={{
                  color: colors.black,
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.semibold,
                  textAlign: 'center',
                }}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MusicLibraryPage;