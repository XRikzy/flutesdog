import { useCallback, useEffect, useRef, useState } from "react";
import { getCollections } from "../services/collections";

export function useCollections() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getCollections>>>();
  const [error, setError] = useState(false);
  const revision = useRef(0);
  const reload = useCallback(async () => {
    const request = ++revision.current;
    try {
      const result = await getCollections();
      if (request === revision.current) {
        setData(result);
        setError(false);
      }
    } catch {
      if (request === revision.current) setError(true);
    }
  }, []);

  useEffect(() => {
    void reload();
    return () => { revision.current++; };
  }, [reload]);

  return { data, loading: !data && !error, error, reload };
}
