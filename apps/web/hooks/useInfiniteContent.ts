import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { getErrorMessage } from "../utils/getErrorMessage";
import { toast } from "sonner";

export const useInfiniteContent = (contentType: string) => {
  const [content, setContent] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [inititalLoading, setInitialLoading] = useState<boolean>(true);
  const [limit] = useState<number>(15);
  const [refetchCounter, setRefetchCounter] = useState<number>(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const domRef = useRef<HTMLDivElement | null>(null);

  const hasMoreRef = useRef(hasMore);
  const cursorRef = useRef(cursor);
  const initialLoadingRef = useRef(inititalLoading);
  const isFetchingRef = useRef(false);

  hasMoreRef.current = hasMore;
  cursorRef.current = cursor;
  initialLoadingRef.current = inititalLoading;

  const fetchContent = useCallback(
    async (cursorParam?: string | null) => {
      if (isFetchingRef.current || !hasMoreRef.current) return;
      isFetchingRef.current = true;

      const currentCursor =
        cursorParam !== undefined ? cursorParam : cursorRef.current;

      setFetchLoading(true);

      try {
        const res = await axios.get("/api/web/content", {
          params: {
            contentType,
            limit,
            ...(currentCursor && { cursor: currentCursor }),
          },
        });

        if (currentCursor) {
          setContent((prev) => [...prev, ...res.data.data]);
        } else {
          setContent(res.data.data);
        }
        setCursor(res.data.cursor);
        setHasMore(res.data.hasMore);
      } catch (error: any) {
        toast.error(getErrorMessage(error), { position: "top-center" });
      } finally {
        setInitialLoading(false);
        setFetchLoading(false);
        isFetchingRef.current = false;
      }
    },
    [contentType],
  );

  const resetAndRefetchContent = useCallback(() => {
    setContent([]);
    setHasMore(true);
    setCursor(null);
    setInitialLoading(true);
    isFetchingRef.current = false;

    setRefetchCounter((counter) => counter + 1);
  }, []);

  useEffect(() => {
    setContent([]);
    setHasMore(true);
    setCursor(null);
    setInitialLoading(true);

    hasMoreRef.current = true;
    isFetchingRef.current = false;
    cursorRef.current = null;
    initialLoadingRef.current = true;

    fetchContent(null);
  }, [contentType, refetchCounter, fetchContent]);

  useEffect(() => {
    if (!domRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entry) => {
        if (
          entry[0]?.isIntersecting &&
          hasMoreRef.current &&
          !isFetchingRef.current &&
          !initialLoadingRef.current
        ) {
          fetchContent();
        }
      },
      { threshold: 0 },
    );

    observerRef.current.observe(domRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [fetchContent]);

  return {
    content,
    fetchLoading,
    inititalLoading,
    hasMore,
    domRef,
    resetAndRefetchContent,
  };
};
