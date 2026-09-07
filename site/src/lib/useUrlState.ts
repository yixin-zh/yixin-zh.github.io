import { useCallback, useEffect, useState } from "react";

type Updater = (params: URLSearchParams) => void;

/**
 * Minimal replacement for react-router's `useSearchParams`: the trace id, step
 * index and view flags all live in the query string so every step is linkable.
 */
export function useUrlState() {
  const [params, setParams] = useState(
    () => new URLSearchParams(window.location.search),
  );

  const update = useCallback((updater: Updater) => {
    const next = new URLSearchParams(window.location.search);
    updater(next);
    const query = next.toString();
    window.history.pushState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
    setParams(next);
  }, []);

  useEffect(() => {
    const onPopState = () => setParams(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return { params, update };
}
