// Deterministic scam/safety rule engine (spec §9). No AI guessing here —
// every verdict traces back to a specific stored field so Zoe can see why.

export type SafetyBadge = "SAFE" | "REVIEW" | "HIGH_RISK" | "REJECTED";

export const SAFETY_BADGE_LABELS: Record<SafetyBadge, string> = {
  SAFE: "Safe",
  REVIEW: "Review",
  HIGH_RISK: "High Risk",
  REJECTED: "Rejected — Not Actually Free",
};

export const SAFETY_BADGE_COLORS: Record<SafetyBadge, string> = {
  SAFE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  REVIEW: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  HIGH_RISK: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  REJECTED: "bg-red-500/15 text-red-700 dark:text-red-400",
};

const FREE_MAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "protonmail.com",
]);

export interface SafetyInput {
  // Absolute rule (spec §1) — any payment of any kind disqualifies.
  paymentRequired: boolean;
  cardRequired: boolean;
  purchaseRequired: boolean;
  depositRequired?: boolean;
  giftCardRequested?: boolean;
  cryptoRequested?: boolean;
  reimbursementFirst?: boolean;
  membershipFeeRequired?: boolean;

  // Contact/verification signals (spec §8-9)
  contactEmail?: string | null;
  officialWebsite?: string | null;
  brandVerified?: boolean;
  telegramOnly?: boolean;
  whatsappOnly?: boolean;
  urgentPressureLanguage?: boolean;
  suspiciousAttachment?: boolean;
  requestsSsnOrId?: boolean;
  requestsBankingEarly?: boolean;
}

export interface SafetyResult {
  badge: SafetyBadge;
  reasons: string[];
  blocksAdvancement: boolean;
}

function emailDomain(email?: string | null): string | null {
  if (!email || !email.includes("@")) return null;
  return email.split("@")[1]?.toLowerCase().trim() ?? null;
}

function domainFromUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    return host.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Pure function: given the stored opportunity/contact fields, compute the
 * safety badge. The "actually free" rule (spec §1) always wins — any
 * payment-shaped field short-circuits straight to REJECTED regardless of
 * everything else.
 */
export function computeSafety(input: SafetyInput): SafetyResult {
  const reasons: string[] = [];

  const paymentFlags: Array<[boolean | undefined, string]> = [
    [input.paymentRequired, "Payment required"],
    [input.cardRequired, "Credit/debit card requested"],
    [input.purchaseRequired, "Purchase required first"],
    [input.depositRequired, "Deposit required"],
    [input.giftCardRequested, "Gift card requested"],
    [input.cryptoRequested, "Crypto payment requested"],
    [input.reimbursementFirst, "Reimbursement-first scheme"],
    [input.membershipFeeRequired, "Membership/subscription fee required"],
  ];
  const triggeredPaymentFlags = paymentFlags.filter(([v]) => v).map(([, r]) => r);

  if (triggeredPaymentFlags.length > 0) {
    return {
      badge: "REJECTED",
      reasons: triggeredPaymentFlags,
      blocksAdvancement: true,
    };
  }

  let riskPoints = 0;

  if (input.requestsSsnOrId) {
    riskPoints += 4;
    reasons.push("Requests SSN or government ID");
  }
  if (input.requestsBankingEarly) {
    riskPoints += 4;
    reasons.push("Requests banking info before shipment");
  }
  if (input.telegramOnly) {
    riskPoints += 2;
    reasons.push("Telegram-only communication");
  }
  if (input.whatsappOnly) {
    riskPoints += 2;
    reasons.push("WhatsApp-only communication");
  }
  if (input.suspiciousAttachment) {
    riskPoints += 2;
    reasons.push("Suspicious attachment");
  }
  if (input.urgentPressureLanguage) {
    riskPoints += 1;
    reasons.push("Urgent/pressure language");
  }

  const contactDomain = emailDomain(input.contactEmail);
  const brandDomain = domainFromUrl(input.officialWebsite);
  if (contactDomain && FREE_MAIL_DOMAINS.has(contactDomain)) {
    riskPoints += 2;
    reasons.push(`Contact uses a free mail provider (${contactDomain}), not an official domain`);
  } else if (contactDomain && brandDomain && contactDomain !== brandDomain) {
    // Third-party PR agency email is fine (spec §8) — this is just a note,
    // not a risk point, unless it's also a free-mail domain (handled above).
    reasons.push(`Contact domain (${contactDomain}) differs from brand site (${brandDomain}) — verify agency relationship`);
  }

  if (input.brandVerified === false) {
    riskPoints += 3;
    reasons.push("Brand identity not yet verified");
  }

  if (riskPoints >= 6) {
    return { badge: "HIGH_RISK", reasons, blocksAdvancement: true };
  }
  if (riskPoints >= 2) {
    return { badge: "REVIEW", reasons, blocksAdvancement: false };
  }

  return {
    badge: "SAFE",
    reasons: reasons.length ? reasons : ["No risk signals found"],
    blocksAdvancement: false,
  };
}
