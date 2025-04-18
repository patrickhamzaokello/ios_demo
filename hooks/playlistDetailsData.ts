import { useState, useEffect } from 'react';
import type { HomeData } from '../types/home';
import { api_playlistDetails } from '@/api/mwonyaService';
import { MwonyaPlaylistDetailsResponse } from '@/types/playlist';

interface UsePlaylistDetailsData {
  data: MwonyaPlaylistDetailsResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePlaylistDetailsData(id: string): UsePlaylistDetailsData {
  const [data, setData] = useState<MwonyaPlaylistDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response_data = await api_playlistDetails(id);

      setData(response_data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      setLoading(false);
    }
  };

  const refetch = () => {
    setLoading(true);
    setError(null);
    fetchData();
  };

  return { data, loading, error, refetch };
}