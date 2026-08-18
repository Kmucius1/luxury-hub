import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Sample pipeline status (spec §4) ──────────────────────────────
export const PIPELINE_STATUSES = [
  "found",
  "researching",
  "verified",
  "ready_to_request",
  "request_sent",
  "waiting",
  "approved",
  "address_requested",
  "address_sent",
  "processing",
  "shipped",
  "delivered",
  "received",
  "declined",
  "rejected",
  "scam",
] as const;

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

export const PIPELINE_STATUS_LABELS: Record<PipelineStatus, string> = {
  found: "Found",
  researching: "Researching",
  verified: "Verified",
  ready_to_request: "Ready to Request",
  request_sent: "Request Sent",
  waiting: "Waiting",
  approved: "Approved",
  address_requested: "Address Requested",
  address_sent: "Address Sent",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  received: "Received",
  declined: "Declined",
  rejected: "Rejected",
  scam: "Scam",
};

export const PIPELINE_STATUS_COLORS: Record<PipelineStatus, string> = {
  found: "bg-stone-500/10 text-stone-600 dark:text-stone-300",
  researching: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  verified: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  ready_to_request: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
  request_sent: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  waiting: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  address_requested: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  address_sent: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  processing: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  shipped: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  delivered: "bg-green-500/10 text-green-700 dark:text-green-400",
  received: "bg-green-600/10 text-green-700 dark:text-green-400",
  declined: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  rejected: "bg-red-500/10 text-red-700 dark:text-red-400",
  scam: "bg-red-600/15 text-red-700 dark:text-red-400",
};

export const CATEGORIES = [
  "fragrance",
  "beauty",
  "fashion",
  "clothing",
  "shoes",
  "accessories",
  "home",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  fragrance: "Fragrance",
  beauty: "Beauty",
  fashion: "Fashion",
  clothing: "Clothing",
  shoes: "Shoes",
  accessories: "Accessories",
  home: "Home",
};

export const FULFILLMENT_TYPES = ["gift", "loan_showroom_pull"] as const;
export type FulfillmentType = (typeof FULFILLMENT_TYPES)[number];
export const FULFILLMENT_TYPE_LABELS: Record<FulfillmentType, string> = {
  gift: "Gift — Keeps Product",
  loan_showroom_pull: "Loan / Showroom Pull — RETURN REQUIRED",
};

export const OFFER_TYPES = [
  "official_free_sample",
  "pr_sample",
  "pr_mailer",
  "creator_gifting",
  "product_seeding",
  "no_obligation_gifting",
  "launch_mailer",
  "press_sample",
  "creator_sample",
  "review_sample",
  "event_gift",
  "luxury_gift",
  "full_size_product",
  "miniature",
  "discovery_sample",
  "fragrance_vial",
  "clothing_gift",
  "home_product_gift",
] as const;

export type OfferType = (typeof OFFER_TYPES)[number];

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  official_free_sample: "Official Free Sample",
  pr_sample: "PR Sample",
  pr_mailer: "PR Mailer",
  creator_gifting: "Creator Gifting",
  product_seeding: "Product Seeding",
  no_obligation_gifting: "No-Obligation Gifting",
  launch_mailer: "Launch Mailer",
  press_sample: "Press Sample",
  creator_sample: "Creator Sample",
  review_sample: "Review Sample",
  event_gift: "Event Gift",
  luxury_gift: "Luxury Gift",
  full_size_product: "Full-Size Product",
  miniature: "Miniature",
  discovery_sample: "Discovery Sample",
  fragrance_vial: "Fragrance Vial",
  clothing_gift: "Clothing Gift",
  home_product_gift: "Home Product Gift",
};

export const REQUEST_METHODS = [
  "email",
  "instagram_dm",
  "tiktok",
  "application",
  "pr_portal",
] as const;

export type RequestMethod = (typeof REQUEST_METHODS)[number];

export const REQUEST_METHOD_LABELS: Record<RequestMethod, string> = {
  email: "Email",
  instagram_dm: "Instagram DM",
  tiktok: "TikTok",
  application: "Application",
  pr_portal: "PR Portal",
};

export const REQUEST_STATUSES = [
  "draft",
  "sent",
  "followed_up",
  "responded",
  "no_response",
  "approved",
  "declined",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  followed_up: "Followed Up",
  responded: "Responded",
  no_response: "No Response",
  approved: "Approved",
  declined: "Declined",
};

export const WISHLIST_PRIORITIES = ["low", "medium", "high"] as const;
export type WishlistPriority = (typeof WISHLIST_PRIORITIES)[number];

// ── Brand / PR agency relationship stages (spec §22-23) ────────────
export const RELATIONSHIP_STAGES = [
  "target",
  "researched",
  "contact_found",
  "requested",
  "responded",
  "first_sample",
  "pr_list",
  "repeat_gifting",
  "priority_relationship",
] as const;

export type RelationshipStageValue = (typeof RELATIONSHIP_STAGES)[number];

export const RELATIONSHIP_STAGE_LABELS: Record<string, string> = {
  target: "Target",
  researched: "Researched",
  contact_found: "Contact Found",
  requested: "Requested",
  responded: "Responded",
  first_sample: "First Sample",
  pr_list: "PR List",
  repeat_gifting: "Repeat Gifting",
  priority_relationship: "Priority Relationship",
};

// ── Shipment tracking statuses (spec §20) ───────────────────────────
export const SHIPMENT_STATUSES = [
  "approved",
  "address_sent",
  "processing",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "received",
  "issue",
] as const;

export type ShipmentStatusValue = (typeof SHIPMENT_STATUSES)[number];

export const SHIPMENT_STATUS_LABELS: Record<string, string> = {
  approved: "Approved",
  address_sent: "Address Sent",
  processing: "Processing",
  shipped: "Shipped",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  received: "Received",
  issue: "Issue",
};

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
