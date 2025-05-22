import type { HomeData } from "../types/home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useState, useEffect, useCallback } from "react";

export function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Check network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  // Load data function - tries API first, falls back to cache
  const loadData = useCallback(
    async (forceRefresh = false) => {
      setLoading(true);

      try {
        // Check if we should use cached data
        if (!forceRefresh && !isConnected) {
          const cachedData = await AsyncStorage.getItem("homeData");
          const cachedTimestamp = await AsyncStorage.getItem(
            "homeDataTimestamp"
          );

          if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            setData(parsedData);
            setLastUpdated(
              cachedTimestamp ? new Date(parseInt(cachedTimestamp)) : null
            );
            setLoading(false);
            return;
          }
        }

        // Only try fetching if we're online or forcing refresh
        if (isConnected || forceRefresh) {
          try {
            const response = await fetch(
              "https://api.mwonya.com/v1/Requests/endpoints/allcombined.php?userID=mwUWTsKbYeIVPV20BN8or955NA1J43&page=1"
            );
            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }
            const json = await response.json();
            await AsyncStorage.setItem("homeData", JSON.stringify(json));
            const timestamp = Date.now().toString();
            await AsyncStorage.setItem("homeDataTimestamp", timestamp);
            setData(json);
            setLoading(false);
            setLastUpdated(new Date(parseInt(timestamp)));
            setError(null);
          } catch (err) {
            setError(
              err instanceof Error ? err : new Error("An error occurred")
            );
            setLoading(false);
            setError(null);
          }
        } else {
          // We're offline with no cached data
          throw new Error(
            "No internet connection and no cached data available"
          );
        }
      } catch (err) {
        setError(err as Error);
        // Try loading from cache as fallback if fetch failed
        if (isConnected) {
          const cachedData = await AsyncStorage.getItem("homeData");
          if (cachedData) {
            setData(JSON.parse(cachedData));
            const cachedTimestamp = await AsyncStorage.getItem(
              "homeDataTimestamp"
            );
            setLastUpdated(
              cachedTimestamp ? new Date(parseInt(cachedTimestamp)) : null
            );
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [isConnected]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);


  const refetch = useCallback(() => {
    return loadData(true);
  }, [loadData]);


  return { data, loading, error, refetch,  isConnected, lastUpdated};
}
