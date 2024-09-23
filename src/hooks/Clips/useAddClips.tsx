import { useState } from "react";
import { AddClipValues } from "../../constants/documents";
import { handleSave } from "../../services/addClips";
export const useAddClips = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorState, seterrorState] = useState<boolean>(false);
  const addData = async (data: AddClipValues) => {
    setLoading(false);
    setError(null);
    try {
      await handleSave(data);
    } catch (err) {
      setError("Parece que no pudimos crear el clip: " + err);
      seterrorState(true);
    } finally {
      setLoading(true);
    }
  };
  return {
    addData,
    errorState,
    error,
    loading,
  };
};
