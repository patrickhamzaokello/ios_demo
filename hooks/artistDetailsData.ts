import { api_artistDetails } from '@/api/mwonyaService';
import { MwonyaArtistDetailsResponse } from '@/types/artist';
import { MwonyaPlaylistDetailsResponse } from '@/types/playlist';
import { useState, useEffect } from 'react';



export const useArtistDetailsData = (artist_id: string | undefined) => {
  const [data, setData] = useState<MwonyaArtistDetailsResponse>({} as MwonyaArtistDetailsResponse);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtistDetails = async () => {
    if (!artist_id) {
      setError('No Artist ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response_data = await api_artistDetails(artist_id);

      setData(response_data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching artist details");
      setLoading(false);
    }
  }

    useEffect(() => {
      fetchArtistDetails();
    }, [artist_id]);

    const refetch = () => {
      fetchArtistDetails();
    };

    return { data, loading, error, refetch };
  };
