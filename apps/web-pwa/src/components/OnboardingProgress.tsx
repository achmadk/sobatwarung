import { useOnboardingProgress } from "../hooks/useOnboardingProgress.js";

export function OnboardingProgress() {
  const { firstOrderCompleted, firstGroupBuyCompleted, isLoading } = useOnboardingProgress();

  if (isLoading) {
    return null;
  }

  const allComplete = firstOrderCompleted && firstGroupBuyCompleted;

  if (allComplete) {
    return (
      <div className="rounded-xl bg-green-50 p-4 text-center">
        <p className="text-sm font-medium text-green-700">Selamat! Anda telah mengenal semua fitur utama.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="mb-2 text-xs text-gray-500">Progress Anda</p>
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-xl">{firstOrderCompleted ? "🛒✓" : "🛒○"}</span>
          <span className="text-sm text-gray-600">Pesanan</span>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1">
          <span className="text-xl">{firstGroupBuyCompleted ? "🤝✓" : "🤝○"}</span>
          <span className="text-sm text-gray-600">Group Buy</span>
        </div>
      </div>
    </div>
  );
}
