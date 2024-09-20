import { useEffect, useState } from "react";
import { Ivideos } from "../../constants/documents";
import { fetchData } from "../../services/getClips";
import { handleSave } from "../../services/addClips";
export const useAddClips = () => {
  const [data, setData] = useState<Ivideos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const addDocuments = async () => {
      try {
        const data = await handleSave();
        setData(data);
      } catch {
        setError("Error Fetching documents");
      } finally {
        setLoading(false);
      }
    };
    addDocuments();
  }, []);
  return {
    data,
    error,
    loading,
  };
};
