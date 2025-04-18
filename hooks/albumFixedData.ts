import { api_albumDetails, API_ContainerContentDetails } from '@/api/mwonyaService';
import { AlbumDetailsResponse } from '@/types/album';
import { useState, useEffect } from 'react';



export const useAlbumDetailsData = (albumId: string | undefined) => {
  const [data, setData] = useState<AlbumDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbumDetails = async () => {
    if (!albumId) {
      setError('No album ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response_data = await API_ContainerContentDetails(albumId);

      setData(response_data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching album details");
      setLoading(false);
    }
  }

    useEffect(() => {
      fetchAlbumDetails();
    }, [albumId]);

    const refetch = () => {
      fetchAlbumDetails();
    };

    return { data, loading, error, refetch };
  };
