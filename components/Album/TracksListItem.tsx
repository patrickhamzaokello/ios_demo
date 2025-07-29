import { TrackShortcutsMenu } from '@/components/TrackShortcutsMenu'
import { StopPropagation } from '@/components/utils/StopPropagation'
import { colors, fontSize } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import LoaderKit from 'react-native-loader-kit'
import { Track, useActiveTrack, useIsPlaying } from 'react-native-track-player'

export type AlbumTracksListItemProps = {
	track: Track
	trackIndex: number
	onTrackSelect: (track: Track) => void
}

export const AlbumTracksListItem = ({
	track,
	trackIndex,
	onTrackSelect: handleTrackSelect,
}: AlbumTracksListItemProps) => {
	const { playing } = useIsPlaying()
	const isActiveTrack = useActiveTrack()?.url === track.url

	return (
		<TouchableHighlight 
			onPress={() => handleTrackSelect(track)} 
			underlayColor={colors.underlay}
			style={styles.touchableContainer}
		>
			<View style={styles.trackItemContainer}>
				{/* Track position number or play indicator */}
				<View style={styles.trackNumberContainer}>
					{isActiveTrack && playing ? (
						<LoaderKit
							style={styles.trackPlayingIndicator}
							name="LineScaleParty"
							color={colors.primary}
							size={16}
						/>
					) : isActiveTrack ? (
						<Ionicons
							name="play"
							size={16}
							color={colors.primary}
						/>
					) : (
						<Text style={styles.trackNumberText}>
							{trackIndex + 1}
						</Text>
					)}
				</View>

				{/* Track info */}
				<View style={styles.trackInfoContainer}>
					<Text
						numberOfLines={1}
						style={[
							styles.trackTitleText,
							{ color: isActiveTrack ? colors.primary : colors.text }
						]}
					>
						{track.title}
					</Text>

					{track.artist && (
						<Text numberOfLines={1} style={styles.trackArtistText}>
							{track.artist}
						</Text>
					)}
				</View>

				{/* Duration */}
				{track.duration && (
					<Text style={styles.durationText}>
						{formatDuration(track.duration)}
					</Text>
				)}

				{/* Menu */}
				<StopPropagation>
					<TrackShortcutsMenu track={track}>
						<View style={styles.menuButton}>
							<Entypo name="dots-three-horizontal" size={18} color={colors.icon} />
						</View>
					</TrackShortcutsMenu>
				</StopPropagation>
			</View>
		</TouchableHighlight>
	)
}

// Helper function to format duration
const formatDuration = (seconds: number): string => {
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	return `${mins}:${secs.toString().padStart(2, '0')}`
}

const styles = StyleSheet.create({
	touchableContainer: {
		borderRadius: 8,
		marginHorizontal: 16,
		marginVertical: 2,
	},
	trackItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
		minHeight: 64,
	},
	trackNumberContainer: {
		width: 32,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	trackNumberText: {
		...defaultStyles.text,
		fontSize: fontSize.sm,
		color: colors.textMuted,
		fontWeight: '500',
	},
	trackPlayingIndicator: {
		width: 16,
		height: 16,
	},
	trackInfoContainer: {
		flex: 1,
		paddingRight: 12,
	},
	trackTitleText: {
		...defaultStyles.text,
		fontSize: fontSize.base,
		fontWeight: '600',
		marginBottom: 2,
	},
	trackArtistText: {
		...defaultStyles.text,
		color: colors.textMuted,
		fontSize: fontSize.sm,
	},
	durationText: {
		...defaultStyles.text,
		fontSize: fontSize.sm,
		color: colors.textMuted,
		marginRight: 12,
		minWidth: 40,
		textAlign: 'right',
	},
	menuButton: {
		padding: 8,
		borderRadius: 20,
	},
})