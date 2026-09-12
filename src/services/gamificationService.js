import {
  collection,
  doc,
  increment,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../firebase";

export const GROWTH_STAGES = [
  { key: "benih", label: "Benih", emoji: "🌱", min: 0, max: 49 },
  { key: "tunas", label: "Tunas", emoji: "🌿", min: 50, max: 149 },
  { key: "muda", label: "Muda", emoji: "🌳", min: 150, max: 299 },
  { key: "dewasa", label: "Dewasa", emoji: "🌲", min: 300, max: Infinity },
];

export function getGrowthStageByPoints(totalPoints = 0) {
  const safePoints = Number(totalPoints) || 0;

  if (safePoints >= 300) return "dewasa";
  if (safePoints >= 150) return "muda";
  if (safePoints >= 50) return "tunas";
  return "benih";
}

export function getStageMeta(stageName = "benih") {
  const normalizedStage = String(stageName || "benih").trim().toLowerCase();
  return GROWTH_STAGES.find((stage) => stage.key === normalizedStage) || GROWTH_STAGES[0];
}

export function getProgressToNextStage(totalPoints = 0) {
  const safePoints = Number(totalPoints) || 0;
  const currentStage = getGrowthStageByPoints(safePoints);
  const currentMeta = getStageMeta(currentStage);
  const currentMin = currentMeta.min;

  if (currentStage === "dewasa") {
    return {
      currentStage,
      nextStage: null,
      currentThreshold: currentMin,
      nextThreshold: null,
      progress: 100,
      remaining: 0,
      emoji: currentMeta.emoji,
      label: currentMeta.label,
    };
  }

  const nextStage = GROWTH_STAGES[GROWTH_STAGES.findIndex((stage) => stage.key === currentStage) + 1];
  const nextThreshold = nextStage.min;
  const range = nextThreshold - currentMin;
  const progress = range > 0 ? Math.min(100, Math.max(0, ((safePoints - currentMin) / range) * 100)) : 0;

  return {
    currentStage,
    nextStage: nextStage.key,
    currentThreshold: currentMin,
    nextThreshold,
    progress,
    remaining: Math.max(0, nextThreshold - safePoints),
    emoji: currentMeta.emoji,
    label: currentMeta.label,
  };
}

export async function addPoints(userId, source, points, relatedId = null) {
  const safeUserId = String(userId || "").trim();
  const numericPoints = Number(points) || 0;

  if (!safeUserId || numericPoints <= 0) {
    return {
      addedPoints: 0,
      totalPoints: 0,
      previousStage: "benih",
      newStage: "benih",
      leveledUp: false,
      source,
      relatedId,
    };
  }

  const userRef = doc(firestore, "users", safeUserId);
  const transactionRef = doc(collection(firestore, "users", safeUserId, "point_transactions"));

  let result = {
    addedPoints: numericPoints,
    totalPoints: numericPoints,
    previousStage: "benih",
    newStage: "benih",
    leveledUp: false,
    source,
    relatedId,
  };

  await runTransaction(firestore, async (transaction) => {
    const userSnapshot = await transaction.get(userRef);
    const previousTotal = userSnapshot.exists() ? Number(userSnapshot.data()?.totalPoints || 0) : 0;
    const previousStage = getGrowthStageByPoints(previousTotal);
    const nextTotal = previousTotal + numericPoints;
    const newStage = getGrowthStageByPoints(nextTotal);

    const transactionPayload = {
      userId: safeUserId,
      source,
      points: numericPoints,
      relatedId: relatedId || null,
      totalPointsAfter: nextTotal,
      createdAt: serverTimestamp(),
    };

    if (!userSnapshot.exists()) {
      transaction.set(userRef, {
        uid: safeUserId,
        totalPoints: nextTotal,
        growthStage: newStage,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      transaction.update(userRef, {
        totalPoints: increment(numericPoints),
        growthStage: newStage,
        updatedAt: serverTimestamp(),
      });
    }

    transaction.set(transactionRef, transactionPayload);

    result = {
      addedPoints: numericPoints,
      totalPoints: nextTotal,
      previousStage,
      newStage,
      leveledUp: previousStage !== newStage,
      source,
      relatedId,
    };
  });

  return result;
}
