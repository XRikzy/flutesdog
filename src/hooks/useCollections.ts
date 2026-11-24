import { useEffect, useState } from "react";
import { getCollections } from "../services/collections";

export function useCollections() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getCollections>>>();
  const [error, setError] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    getCollections().then(
      (result) => { if (active) { setData(result); setError(false); } },
      () => { if (active) setError(true); },
    );
    return () => { active = false; };
  }, [version]);

  return { data, loading: !data && !error, error, reload: () => setVersion((value) => value + 1) };
}
