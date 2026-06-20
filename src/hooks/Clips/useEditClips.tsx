import { useState, useCallback } from "react";
import { UpdateClip } from "../../services/UpdateClips";

export const useEditClips = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const editData = useCallback(
    async (
      id: string,
      updatedValues: {
        title: string;
        tag: string[];
        embed?: string;
        videoUrl?: string;
      }
    ) => {
      setLoading(true);
      setError(null);
      try {
        await UpdateClip(id, updatedValues);
      } catch (err: any) {
        setError(`Parece que no pudimos actualizar el clip: ${err.message || err}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { editData, loading, error };
};
