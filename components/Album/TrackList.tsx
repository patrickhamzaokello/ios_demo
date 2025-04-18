import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fontSize, fontWeight, spacingX, spacingY } from '@/constants/theme';
import { AntDesign, Entypo } from '@expo/vector-icons';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  totalplays: number;
  path: string;
  date_duration?: string;
}

interface TrackListProps {
  tracks: Track[];
  onPlayTrack?: (trackId: string) => void;
}

const formatDuration = (seconds: string) => {
  const totalSeconds = parseInt(seconds, 10);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const TrackList: React.FC<TrackListProps> = ({ tracks, onPlayTrack }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tracks</Text>
      {tracks.map((track, index) => (
        <TouchableOpacity
          key={track.id}
          style={styles.trackItem}
          onPress={() => onPlayTrack?.(track.id)}
          activeOpacity={0.7}
        >
          <View style={styles.trackNumberContainer}>
            <Text style={styles.trackNumber}>{index + 1}</Text>
            <AntDesign name='play' size={16} color={colors.primary} style={styles.playIcon} />
          </View>

          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
            <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
          </View>

          <View style={styles.trackMeta}>
            <Text style={styles.trackPlays}>{track.totalplays.toLocaleString()}</Text>
            <Text style={styles.trackDuration}>
              {track.date_duration ? track.date_duration.split('•')[1].trim() : formatDuration(track.duration)}
            </Text>
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Entypo name='dots-three-vertical' size={20} color={colors.primary} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX._20,
    marginBottom: spacingY._25,
  },
  heading: {
    fontSize: fontSize.xl,
    color: colors.primary,
    marginBottom: spacingY._17,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingY._12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  trackNumberContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackNumber: {
    fontSize: fontSize.md,
    color: colors.textLight,
  },
  playIcon: {
    display: 'none',
    position: 'absolute',
  },
  trackInfo: {
    flex: 1,
    marginLeft: spacingX._12,
    justifyContent: 'center',
  },
  trackTitle: {
    fontSize: fontSize.md,
    color: colors.textLight,
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacingX._5,
  },
  trackPlays: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginRight: spacingX._12,
  },
  trackDuration: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    width: 45,
    textAlign: 'right',
  },
  moreButton: {
    padding: spacingX._10,
  },
});

export default TrackList;