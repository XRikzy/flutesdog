import { useState } from "react";
import { handleDelete } from "../../services/deleteClips";
export const useDeleteClips = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const deleteData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await handleDelete(id);
    } catch (err) {
      setError(`Parece que no pudimos eliminar el clip:  ${err}`);
    } finally {
      setLoading(false);
    }
  };
  return {
    deleteData,
    error,
    loading,
  };
};
