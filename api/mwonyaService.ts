import { AlbumDetailsResponse } from "@/types/album";
import { MwonyaArtistDetailsResponse } from "@/types/artist";
import { MwonyaPlaylistDetailsResponse } from "@/types/playlist";
import apiService from "@/utils/apiService";

export const api_playlistDetails = async (
  id: string
): Promise<MwonyaPlaylistDetailsResponse> => {
  try {
    const response = await apiService.post<MwonyaPlaylistDetailsResponse>(
      `/selectedPlaylist.php?page=1&playlistID=${id}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch playlist details');
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    return {
      page: 0,
      Playlists: [],
      total_pages: 0,
      total_results: 0,
    };
  }
};

export const api_artistDetails = async (
  id: string
): Promise<MwonyaArtistDetailsResponse> => {
  try {
    const response = await apiService.post<MwonyaArtistDetailsResponse>(
      `/artist.php?artistID=${id}&user_ID=mwUWTsKbYeIVPV20BN8or955NA1J43&page=1`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch artist details');
  } catch (error) {
    console.error('Error fetching artist details:', error);
    return {
      page: 0,
      Artist: [],
      total_pages: 0,
      total_results: 0,
    };
  }
};

export const API_HomeFeedFreshData = async (userid: string) => {
  try {
    const response = await apiService.post(
      `/allcombined.php?userID=${userid}&page=1`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch home feed data');
  } catch (error) {
    console.error('Error fetching home feed data:', error);
    return null;
  }
};

export const API_ContainerContentDetails = async (
  album_id: string
): Promise<AlbumDetailsResponse> => {
  try {
    const response = await apiService.post<AlbumDetailsResponse>(
      `/selectedAlbum.php?albumID=${album_id}&page=1`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch album details');
  } catch (error) {
    console.error('Error fetching album details:', error);
    return { page: 0, Album: [], total_pages: 0, total_results: 0 };
  }
};
