import { useState } from "react";
import { AddClipValues } from "../../constants/documents";
import { AddClips } from "../../services/addClips";
export const useAddClips = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const addData = async (data: AddClipValues) => {
    setLoading(true);
    setError(null);
    try {
      await AddClips(data);
    } catch (err) {
      setError(`Parece que no pudimos crear el clip:  ${err}`);
    } finally {
      setLoading(false);
    }
  };
  return {
    addData,
    error,
    loading,
  };
};
