import { useEffect, useState } from "react";

const useSearch = (query: string, page = 1) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [suggestedWord, setSuggestedWord] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!query) {
      setData([]);
      setSuggestedWord("");
      setTotalResults(0);
      setTotalPages(0);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.mwonya.com/v1/Requests/endpoints/search.php?page=${page}&key_query=${encodeURIComponent(
            query
          )}`
        );
        
        const result = await response.json();
        
        // Extract all the metadata from the API response
        setData(result.search_results || []);
        setSuggestedWord(result.suggested_words || "");
        setTotalResults(result.total_results || 0);
        setTotalPages(result.total_pages || 0);
        setCurrentPage(result.page || page);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query, page]);

  return { 
    data, 
    isLoading, 
    error, 
    suggestedWord, 
    totalResults,
    totalPages,
    currentPage,
    hasMore: currentPage < totalPages
  };
};

export default useSearch;