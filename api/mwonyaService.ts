import { AlbumDetailsResponse } from "@/types/album";
import { MwonyaPlaylistDetailsResponse } from "@/types/playlist";
import axiosInstance from "@/utils/apiUtils";


export const api_playlistDetails = async (id: string): Promise<MwonyaPlaylistDetailsResponse> => {
    try {
        const response = await axiosInstance.post(`/selectedPlaylist.php?page=1&playlistID=${id}`);

        return response.data;

    } catch (error) {
        return {
                page: 0,
                Playlists: [],
                total_pages: 0,
                total_results: 0,
        };
    }
};

export const api_albumDetails = async (id: string): Promise<MwonyaPlaylistDetailsResponse> => {
    try {
        const response = await axiosInstance.post('/selectedPlaylist.php?page=1&playlistID=mwP_mobile6b2496c8fe');

        return response.data;

    } catch (error) {
        return {
                page: 0,
                Playlists: [],
                total_pages: 0,
                total_results: 0,
        };
    }
};


export const API_ContainerContentDetails = async (album_id: string): Promise<AlbumDetailsResponse> => {
    try {
        const response = await axiosInstance.post(`/selectedAlbum.php?albumID=${album_id}&page=1`);

        return response.data;

    } catch (error) {
        return {page : 0, Album: [], total_pages: 0, total_results: 0};
    }
};