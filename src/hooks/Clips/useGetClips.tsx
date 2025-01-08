import { useCallback, useEffect, useState } from "react";
import { Ivideos } from "../../constants/documents";
import { fetchData } from "../../services/getClips";
export const useGetClips = () => {
  const [data, setData] = useState<Ivideos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const loadDocuments = useCallback(async () => {
    try {
      const data = await fetchData();
      setData(data);
    } catch {
      setError("Error Fetching documents");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);
  return {
    data,
    error,
    loading,
    refetch: loadDocuments,
  };
};
