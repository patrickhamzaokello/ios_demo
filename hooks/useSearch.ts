import { useEffect, useState } from "react";

const useSearch = (query: string) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.mwonya.com/v1/Requests/endpoints/search.php?page=1&key_query=${encodeURIComponent(
            query
          )}`
        );
        const result = await response.json();
        console.log(result);
        setData(result.search_results || []); // Assuming the API returns tracks
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { data, isLoading, error };
};

export default useSearch;
