"use client";
import { useEffect, useRef } from "react";

export function useDraft({ watch, reset, key, extra = {}, delay = 500 }) {
  const hydrated = useRef(false);

  // بازیابی اولیه
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const { values } = JSON.parse(raw);
      if (values) reset(values);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ذخیره با debounce
  useEffect(() => {
    let timer;
    const sub = watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify({ values, ...extra }));
        } catch {
          /* ignore */
        }
      }, delay);
    });
    return () => {
      clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [watch, key, delay]); // eslint-disable-line
}