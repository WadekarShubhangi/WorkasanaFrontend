import { useState, useEffect } from "react";

export default function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!url) return;
  const fetchData = async () => {
    try {
      const res = await fetch(url, options);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [url, JSON.stringify(options)]);


  return { data, loading };
}
