import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";
import { getGrowthStageByPoints, getProgressToNextStage } from "../services/gamificationService.js";

export default function VirtualTreeWidget({ userId }) {
  const [profile, setProfile] = useState({
    totalPoints: 0,
    growthStage: "benih",
  });

  useEffect(() => {
    if (!userId) {
      setProfile({ totalPoints: 0, growthStage: "benih" });
      return undefined;
    }

    const userRef = doc(firestore, "users", userId);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const userData = snapshot.exists() ? snapshot.data() : {};
      const totalPoints = Number(userData.totalPoints || 0);

      setProfile({
        totalPoints,
        growthStage: userData.growthStage || getGrowthStageByPoints(totalPoints),
      });
    });

    return () => unsubscribe();
  }, [userId]);

  const progress = useMemo(() => getProgressToNextStage(profile.totalPoints), [profile.totalPoints]);

  return (
    <div className="flex items-center gap-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 rounded-full px-3 py-1.5 transition-all shadow-sm text-white">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base leading-none">{progress.emoji}</span>
        <div className="leading-none">
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-200">{profile.growthStage || "Benih"}</div>
          <div className="mt-0.5 text-[11px] font-bold text-amber-300">{profile.totalPoints || 0} pts</div>
        </div>
      </div>

      <div className="w-16 shrink-0">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-400 to-amber-300"
            style={{ width: `${Math.max(8, progress.progress)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
