// Transparent weighted Opportunity Score (spec §25-26). Every point traces
// to a real input field — shown alongside the score, never a black box.

import type { SafetyBadge } from "./safety";

export type BrandTier = "luxury" | "premium" | "unverified";

export interface ScoringInput {
  brandTier: BrandTier;
  estimatedValue: number | null;
  noPostingObligation: boolean;
  sourceVerified: boolean;
  shippingIncluded: boolean;
  safetyBadge: SafetyBadge;
}

export interface ScoreBreakdown {
  score: number; // 1-10
  factors: Array<{ label: string; points: number }>;
}

const MAX_RAW = 10;

export function computeScore(input: ScoringInput): ScoreBreakdown {
  const factors: Array<{ label: string; points: number }> = [];

  // Brand prestige (0-2.5)
  const brandPoints = input.brandTier === "luxury" ? 2.5 : input.brandTier === "premium" ? 1.5 : 0;
  factors.push({ label: `Brand prestige (${input.brandTier})`, points: brandPoints });

  // Product value bucket (0-2)
  const value = input.estimatedValue ?? 0;
  const valuePoints = value >= 200 ? 2 : value >= 75 ? 1.25 : value >= 25 ? 0.75 : value > 0 ? 0.25 : 0;
  factors.push({ label: `Estimated value ($${value})`, points: valuePoints });

  // No posting obligation (0-1.5) — spec §26 no-obligation gifting priority
  const obligationPoints = input.noPostingObligation ? 1.5 : 0;
  factors.push({ label: input.noPostingObligation ? "No posting required" : "Posting required", points: obligationPoints });

  // Verified source (0-1.5)
  const verifiedPoints = input.sourceVerified ? 1.5 : 0;
  factors.push({ label: input.sourceVerified ? "Source verified" : "Not yet verified", points: verifiedPoints });

  // Shipping included (0-1)
  const shippingPoints = input.shippingIncluded ? 1 : 0;
  factors.push({ label: input.shippingIncluded ? "Shipping included" : "Shipping not confirmed free", points: shippingPoints });

  // Risk / safety (-3 to +1.5)
  const riskPoints =
    input.safetyBadge === "SAFE"
      ? 1.5
      : input.safetyBadge === "REVIEW"
        ? 0
        : input.safetyBadge === "HIGH_RISK"
          ? -2
          : -3; // REJECTED
  factors.push({ label: `Safety: ${input.safetyBadge}`, points: riskPoints });

  const raw = factors.reduce((sum, f) => sum + f.points, 0);
  const clamped = Math.max(0, Math.min(MAX_RAW, raw));
  const score = Math.round(clamped * 10) / 10;

  return { score, factors };
}
