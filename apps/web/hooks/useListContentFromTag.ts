import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../utils/getErrorMessage";
import { toast } from "sonner";

export const useListContentFromTag = (contentType: string, tagId: string) => {
  const [tagContent, setTagContent] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [inititalLoading, setInitialLoading] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [limit] = useState(15);
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
        const res = await axios.get(`/api/web/tag/${tagId}/contents`, {
          params: {
            type: contentType,
            limit,
            ...(currentCursor && { cursor: currentCursor }),
          },
        });
        if (currentCursor) {
          setTagContent((prev) => [...prev, ...res.data.data]);
        } else {
          setTagContent(res.data.data);
        }
        setCursor(res.data.cursor);
        setHasMore(res.data.hasMore);
      } catch (error) {
        toast.error(getErrorMessage(error), { position: "top-center" });
      } finally {
        setInitialLoading(false);
        setFetchLoading(false);
        isFetchingRef.current = false;
      }
    },
    [contentType, tagId],
  );

  const resetAndRefetchContentFromTag = useCallback(() => {
    setTagContent([]);
    setHasMore(true);
    setCursor(null);
    setInitialLoading(true);
    isFetchingRef.current = false;

    setRefetchCounter((counter) => counter + 1);
  }, []);

  useEffect(() => {
    setTagContent([]);
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
    tagContent,
    fetchLoading,
    inititalLoading,
    hasMore,
    domRef,
    resetAndRefetchContentFromTag,
  };
};
