import { useCallback, useEffect, useRef, useState } from "react";
import { Ivideos } from "../../constants/documents";
import { getClips } from "../../services/getClips";
const cacheKey = "flutesdog:clips";

function readCache(): Ivideos[] {
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
    if (Array.isArray(cached?.clips) && Date.now() - cached.savedAt < 5 * 60_000) return cached.clips;
  } catch {
    // Storage may be unavailable in private browsers.
  }
  return [];
}

export const useGetClips = () => {
  const [data, setData] = useState(readCache);
  const [loading, setLoading] = useState(data.length === 0);
  const [error, setError] = useState<string | null>(null);
  const latestRequest = useRef(0);
  const loadDocuments = useCallback(async () => {
    const request = ++latestRequest.current;
    setError(null);
    try {
      const data = await getClips();
      if (request !== latestRequest.current) return;
      setData(data);
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ clips: data, savedAt: Date.now() }));
      } catch {
        // The catalog can still be shown when storage is unavailable.
      }
    } catch {
      if (request === latestRequest.current) setError("No pudimos cargar los clips.");
    } finally {
      if (request === latestRequest.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadDocuments();
    return () => { latestRequest.current++; };
  }, [loadDocuments]);
  return {
    data,
    error,
    loading,
    refetch: loadDocuments,
  };
};
