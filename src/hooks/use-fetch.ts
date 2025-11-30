import { useEffect, useRef, useState } from 'react';

export type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

type Options = RequestInit & {
  retries?: number;
  retryDelay?: number; // ms
};

export function useFetch<T = any>(url?: string | null, opts?: Options) {
  const { retries = 2, retryDelay = 500, ...requestInit } = opts || {};
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: !!url, error: null });
  const abortRef = useRef<AbortController | null>(null);
  const urlRef = useRef(url);

  async function doFetch(signal?: AbortSignal) {
    if (!urlRef.current) return;
    setState(s => ({ ...s, loading: true, error: null }));
    let attempts = 0;
    while (attempts <= retries) {
      attempts += 1;
      try {
        const res = await fetch(urlRef.current!, { signal, ...requestInit });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const json = (await res.json()) as T;
        setState({ data: json, loading: false, error: null });
        return;
      } catch (err: any) {
        if (signal?.aborted) return; // request intentionally cancelled
        if (attempts > retries) {
          setState({ data: null, loading: false, error: err });
          return;
        }
        // retry with backoff
        await new Promise(r => setTimeout(r, retryDelay * attempts));
      }
    }
  }

  useEffect(() => {
    if (!url) return;
    urlRef.current = url;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    doFetch(abortRef.current.signal);
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const refetch = (newUrl?: string) => {
    if (newUrl) urlRef.current = newUrl;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    doFetch(abortRef.current.signal);
  };

  return { ...state, refetch } as FetchState<T> & { refetch: (url?: string) => void };
}
