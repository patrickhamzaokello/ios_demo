import { API_ContainerContentDetails, api_playlistDetails } from '@/api/mwonyaService';
import { MwonyaPlaylistDetailsResponse } from '@/types/playlist';
import { useState, useEffect } from 'react';



export const usePlaylistDetailsData = (playlist_id: string | undefined) => {
  const [data, setData] = useState<MwonyaPlaylistDetailsResponse>({} as MwonyaPlaylistDetailsResponse);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbumDetails = async () => {
    if (!playlist_id) {
      setError('No album ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response_data = await api_playlistDetails(playlist_id);

      setData(response_data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching album details");
      setLoading(false);
    }
  }

    useEffect(() => {
      fetchAlbumDetails();
    }, [playlist_id]);

    const refetch = () => {
      fetchAlbumDetails();
    };

    return { data, loading, error, refetch };
  };
