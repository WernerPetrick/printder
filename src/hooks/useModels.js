import { useState, useEffect, useCallback } from "react";
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

  const fetchModels = useCallback(async () => {
    if (!user || !hasMore) return;

    setLoading(true);
    try {
      const result = await getModels({
        category,
        excludeIds: [...swipedIds],
        limit: BATCH_SIZE,
        offset,
      });

      const newModels = result.documents.filter((doc) => !swipedIds.has(doc.$id));

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
  }, [user, category, swipedIds, offset, hasMore]);

  // Initial fetch
  useEffect(() => {
    if (user && models.length === 0) {
      fetchModels();
    }
  }, [user]);

  const markSwiped = useCallback((modelId) => {
    setSwipedIds((prev) => new Set([...prev, modelId]));
    setModels((prev) => prev.filter((m) => m.$id !== modelId));
  }, []);

  const refetch = useCallback(() => {
    setOffset(0);
    setModels([]);
    setHasMore(true);
  }, []);

  return {
    models,
    loading,
    hasMore,
    fetchMore: fetchModels,
    markSwiped,
    refetch,
  };
}
