import { useState, useEffect, useCallback } from "react";

export default function useFetch(url, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, options);
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Fetch failed");

      // Ensure data is always an array
      setData(Array.isArray(result) ? result : [result]);
    } catch (err) {
      const message = err.message || "Unknown error";
      console.error("Fetch error:", message);
      setError(message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
