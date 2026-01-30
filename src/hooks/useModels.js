import { useState, useEffect, useCallback, useRef } from "react";
import { getModels, getUserSwipes } from "../services/appwrite";
import { useAuth } from "./useAuth";

const BATCH_SIZE = 10;

export function useModels(category = null) {
  const { user } = useAuth();
  const [models, setModels] = useState([]);
  const [swipedIds, setSwipedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Keep a ref so fetchMore always reads the latest values
  const stateRef = useRef({ offset, hasMore, swipedIds });
  stateRef.current = { offset, hasMore, swipedIds };

  // Load user's existing swipes on mount
  useEffect(() => {
    if (!user) return;

    getUserSwipes(user.$id)
      .then((result) => {
        const ids = new Set(result.documents.map((doc) => doc.modelId));
        setSwipedIds(ids);
      })
      .catch(console.error);
  }, [user]);

  // Reset and fetch when category changes (also handles initial load)
  useEffect(() => {
    if (!user) return;

    setOffset(0);
    setModels([]);
    setHasMore(true);
    setLoading(true);

    getModels({
      category,
      limit: BATCH_SIZE,
      offset: 0,
    })
      .then((result) => {
        const swiped = stateRef.current.swipedIds;
        const newModels = result.documents.filter((doc) => !swiped.has(doc.$id));

        if (newModels.length === 0) {
          setHasMore(false);
        } else {
          setModels(newModels);
          setOffset(BATCH_SIZE);
        }
      })
      .catch((err) => console.error("Failed to fetch models:", err))
      .finally(() => setLoading(false));
  }, [user, category]);

  // Fetch more (used by CardStack when running low)
  const fetchMore = useCallback(async () => {
    const { offset: currentOffset, hasMore: canFetch, swipedIds: swiped } = stateRef.current;
    if (!user || !canFetch) return;

    setLoading(true);
    try {
      const result = await getModels({
        category,
        limit: BATCH_SIZE,
        offset: currentOffset,
      });

      const newModels = result.documents.filter((doc) => !swiped.has(doc.$id));

      if (newModels.length === 0) {
        setHasMore(false);
      } else {
        setModels((prev) => [...prev, ...newModels]);
        setOffset((prev) => prev + BATCH_SIZE);
      }
    } catch (err) {
      console.error("Failed to fetch models:", err);
    } finally {
      setLoading(false);
    }
  }, [user, category]);

  const markSwiped = useCallback((modelId) => {
    setSwipedIds((prev) => new Set([...prev, modelId]));
    setModels((prev) => prev.filter((m) => m.$id !== modelId));
  }, []);

  return {
    models,
    loading,
    hasMore,
    fetchMore,
    markSwiped,
  };
}
