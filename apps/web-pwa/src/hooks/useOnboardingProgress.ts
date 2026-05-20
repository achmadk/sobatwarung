import { useState, useEffect, useCallback } from "react";
import { db } from "../services/db.js";
import { useAuth } from "./useAuth.js";

export interface OnboardingProgressState {
  firstOrderCompleted: boolean;
  firstGroupBuyCompleted: boolean;
  isLoading: boolean;
}

export function useOnboardingProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgressState>({
    firstOrderCompleted: false,
    firstGroupBuyCompleted: false,
    isLoading: true,
  });

  const loadProgress = useCallback(async () => {
    if (!user?.id) {
      setProgress({ firstOrderCompleted: false, firstGroupBuyCompleted: false, isLoading: false });
      return;
    }

    try {
      const record = await db.onboardingProgress.get(user.id);
      if (record) {
        setProgress({
          firstOrderCompleted: record.firstOrderCompleted,
          firstGroupBuyCompleted: record.firstGroupBuyCompleted,
          isLoading: false,
        });
      } else {
        await db.onboardingProgress.add({
          id: user.id,
          firstOrderCompleted: false,
          firstGroupBuyCompleted: false,
          userId: user.id,
        });
        setProgress({ firstOrderCompleted: false, firstGroupBuyCompleted: false, isLoading: false });
      }
    } catch {
      setProgress({ firstOrderCompleted: false, firstGroupBuyCompleted: false, isLoading: false });
    }
  }, [user?.id]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const markFirstOrderComplete = useCallback(async () => {
    if (!user?.id) return;

    await db.onboardingProgress.update(user.id, {
      firstOrderCompleted: true,
      firstOrderCompletedAt: new Date().toISOString(),
    });
    setProgress((prev) => ({ ...prev, firstOrderCompleted: true }));
  }, [user?.id]);

  const markFirstGroupBuyComplete = useCallback(async () => {
    if (!user?.id) return;

    await db.onboardingProgress.update(user.id, {
      firstGroupBuyCompleted: true,
      firstGroupBuyCompletedAt: new Date().toISOString(),
    });
    setProgress((prev) => ({ ...prev, firstGroupBuyCompleted: true }));
  }, [user?.id]);

  return {
    ...progress,
    markFirstOrderComplete,
    markFirstGroupBuyComplete,
    refresh: loadProgress,
  };
}
