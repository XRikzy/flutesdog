import { useState } from "react";
import { DeleteClips } from "../../services/deleteClips";
export const useDeleteClips = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const deleteData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await DeleteClips(id);
    } catch (err) {
      setError(`Parece que no pudimos eliminar el clip:  ${err}`);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  return {
    openDelete,
    id,
    title,
    setId,
    setTitle,
    deleteData,
    handleOpenDelete,
    handleCloseDelete,
    error,
    loading,
  };
};
