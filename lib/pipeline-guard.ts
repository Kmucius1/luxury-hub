import { PIPELINE_STATUSES, type PipelineStatus } from "./utils";
import type { SafetyResult } from "./safety";

const TERMINAL_NEGATIVE: PipelineStatus[] = ["declined", "rejected", "scam"];
const RESEARCHING_INDEX = PIPELINE_STATUSES.indexOf("researching");

/**
 * Enforces spec §9: a REJECTED or HIGH_RISK opportunity cannot advance past
 * "Researching" in the pipeline. REJECTED is force-set to "rejected"
 * outright (spec §1 — "not actually free" stops the application).
 */
export function applyStatusGuard(requestedStatus: PipelineStatus, safety: SafetyResult): PipelineStatus {
  if (safety.badge === "REJECTED") return "rejected";

  if (safety.blocksAdvancement && !TERMINAL_NEGATIVE.includes(requestedStatus)) {
    const requestedIndex = PIPELINE_STATUSES.indexOf(requestedStatus);
    if (requestedIndex > RESEARCHING_INDEX) return "researching";
  }

  return requestedStatus;
}
