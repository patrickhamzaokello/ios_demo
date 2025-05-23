// Enhanced useHomeData.js hook with real connectivity testing

import { API_HomeFeedFreshData } from "@/api/mwonyaService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect, useRef, useState } from "react";

// Test actual internet connectivity, not just network connection
const testInternetConnectivity = async () => {
  try {
    // Use a fast, lightweight endpoint to test connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch("https://www.google.com/generate_204", {
      method: "GET",
      signal: controller.signal,
      cache: "no-cache",
    });

    clearTimeout(timeoutId);
    return response.status === 204; // Google returns 204 for this endpoint
  } catch (error) {
    return false; // Any error means no real internet connection
  }
};

export function useHomeData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [initialLoad, setInitialLoad] = useState(true);
  const [backgroundRefresh, setBackgroundRefresh] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasRealInternet, setHasRealInternet] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const connectivityCheckRef = useRef(null);

  // Enhanced connectivity checking
  const checkConnectivity = useCallback(async () => {
    const netState = await NetInfo.fetch();
    const hasNetworkConnection =
      netState.isConnected && netState.isInternetReachable;

    setIsConnected(hasNetworkConnection ?? false);

    if (hasNetworkConnection) {
      // Test real internet connectivity
      const hasInternet = await testInternetConnectivity();
      setHasRealInternet(hasInternet);
      return hasInternet;
    }

    setHasRealInternet(false);
    return false;
  }, []);

  // Load cached data immediately on app start
  const loadCachedData = useCallback(async () => {
    try {
      const cachedData = await AsyncStorage.getItem("homeData");
      const cachedTimestamp = await AsyncStorage.getItem("homeDataTimestamp");

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setData(parsedData);
        setLastUpdated(
          cachedTimestamp ? new Date(parseInt(cachedTimestamp)) : null
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading cached data:", error);
      return false;
    }
  }, []);

  // Fetch fresh data from API
  const fetchFreshData = useCallback(async () => {
    try {
      // Replace with your actual API endpoint
      const response_data = await API_HomeFeedFreshData(
        "mwUWTsKbYeIVPV20BN8or955NA1J43"
      );

      if (response_data === null) {
        throw new Error("Failed to fetch fresh data");
      }

      // Save to AsyncStorage for offline use
      await AsyncStorage.setItem("homeData", JSON.stringify(response_data));
      const timestamp = Date.now().toString();
      await AsyncStorage.setItem("homeDataTimestamp", timestamp);

      setData(response_data);
      setLastUpdated(new Date(parseInt(timestamp)));
      setError(null);

      return true;
    } catch (err) {
      console.error("Error fetching fresh data:", err);
      setError(new Error("Failed to fetch fresh data"));
      return false;
    }
  }, []);

  // Main data loading function
  const loadData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setBackgroundRefresh(true);
      } else if (initialLoad) {
        setLoading(true);
      }

      try {
        // Always load cached data first (for immediate display)
        const hasCachedData = await loadCachedData();

        if (initialLoad && hasCachedData) {
          setLoading(false);
          setInitialLoad(false);
        }

        // Check if we have real internet connectivity
        const hasInternet = await checkConnectivity();

        if (hasInternet) {
          // Try to fetch fresh data in the background
          const fetchSuccess = await fetchFreshData();

          if (!fetchSuccess && !hasCachedData) {
            // Only show error if we have no cached data to fall back on
            setError(
              new Error("Failed to load data and no cached data available")
            );
          }
        } else if (!hasCachedData) {
          // No internet and no cached data
          setError(
            new Error("No internet connection and no cached data available")
          );
        }
      } catch (err) {
        setError(new Error("An unexpected error occurred"));
      } finally {
        setLoading(false);
        setInitialLoad(false);
        setBackgroundRefresh(false);
      }
    },
    [initialLoad, loadCachedData, fetchFreshData, checkConnectivity]
  );

  // Set up network state listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const wasConnected = isConnected;
      const hasNetworkConnection =
        state.isConnected && state.isInternetReachable;

      setIsConnected(hasNetworkConnection ?? false);

      if (hasNetworkConnection) {
        // Test real internet when network state changes
        const hasInternet = await testInternetConnectivity();
        setHasRealInternet(hasInternet);

        // If we just regained internet connection, refresh data in background
        if (!wasConnected && hasInternet && data) {
          loadData(true); // Background refresh
        }
      } else {
        setHasRealInternet(false);
      }
    });

    return () => unsubscribe();
  }, [isConnected, data, loadData]);

  // Initial data loading
  useEffect(() => {
    loadData();
  }, []);

  // Periodic connectivity checks (optional, for more robust detection)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isConnected) {
        const hasInternet = await testInternetConnectivity();
        if (hasRealInternet !== hasInternet) {
          setHasRealInternet(hasInternet);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected, hasRealInternet]);

  // Function to explicitly refresh data
  const refetch = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  return {
    data,
    loading,
    initialLoad,
    backgroundRefresh,
    error,
    refetch,
    isConnected: hasRealInternet, // Return real internet status
    lastUpdated,
  };
}
