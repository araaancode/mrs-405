// app/halls/hooks/useHalls.js
"use client";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url) =>
    axios.get(url, { timeout: 15000 }).then((r) => r.data);

function extractHalls(result) {
    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result.halls)) return result.halls;
    if (Array.isArray(result.results)) return result.results;
    if (Array.isArray(result.items)) return result.items;
    return [];
}

export function useHalls() {
    const { data, error, isLoading, mutate } = useSWR("/api/halls", fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 60_000,
        keepPreviousData: true,
    });

    const halls = extractHalls(data).filter((h) => h.is_active !== false);

    return { halls, loading: isLoading, error, refresh: mutate };
}