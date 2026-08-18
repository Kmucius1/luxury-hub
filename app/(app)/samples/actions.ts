"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeSafety, type SafetyInput } from "@/lib/safety";
import { computeScore, type BrandTier } from "@/lib/scoring";
import { applyStatusGuard } from "@/lib/pipeline-guard";
import type { PipelineStatus, Category, OfferType } from "@/lib/utils";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}
function bool(formData: FormData, key: string): boolean { return formData.get(key) === "on"; }
function num(formData: FormData, key: string): number | null {
  const v = str(formData, key); if (v === null) return null;
  const n = Number(v); return Number.isFinite(n) ? n : null;
}

function buildOpportunityPayload(formData: FormData) {
  const safetyInput: SafetyInput = {
    paymentRequired: bool(formData, "payment_required"), cardRequired: bool(formData, "card_required"),
    purchaseRequired: bool(formData, "purchase_required"), depositRequired: bool(formData, "deposit_required"),
    giftCardRequested: bool(formData, "gift_card_requested"), cryptoRequested: bool(formData, "crypto_requested"),
    reimbursementFirst: bool(formData, "reimbursement_first"), membershipFeeRequired: bool(formData, "membership_fee_required"),
    contactEmail: str(formData, "contact_email"), officialWebsite: str(formData, "official_website"),
    brandVerified: bool(formData, "brand_verified"), telegramOnly: bool(formData, "telegram_only"),
    whatsappOnly: bool(formData, "whatsapp_only"), urgentPressureLanguage: bool(formData, "urgent_pressure_language"),
    suspiciousAttachment: bool(formData, "suspicious_attachment"), requestsSsnOrId: bool(formData, "requests_ssn_or_id"),
    requestsBankingEarly: bool(formData, "requests_banking_early"),
  };
  const safety = computeSafety(safetyInput);
  const brandTier = (str(formData, "brand_tier") as BrandTier) ?? "luxury";
  const estimatedValue = num(formData, "estimated_value");
  const postingRequired = bool(formData, "posting_required");
  const shippingResponsibility = str(formData, "shipping_responsibility") ?? "unclear";
  const verificationStatus = str(formData, "verification_status") ?? "unverified";
  const { score } = computeScore({ brandTier, estimatedValue, noPostingObligation: !postingRequired, sourceVerified: verificationStatus === "verified", shippingIncluded: shippingResponsibility === "brand_covers", safetyBadge: safety.badge });
  const requestedStatus = (str(formData, "status") as PipelineStatus) ?? "found";
  const finalStatus = applyStatusGuard(requestedStatus, safety);

  return { payload: {
    brand: str(formData, "brand") ?? "", brand_logo_url: str(formData, "brand_logo_url"), product: str(formData, "product") ?? "",
    category: (str(formData, "category") as Category) ?? "fragrance", product_image_url: str(formData, "product_image_url"),
    pr_package_image_url: str(formData, "pr_package_image_url"), evidence_image_url: str(formData, "evidence_image_url"),
    evidence_source_url: str(formData, "evidence_source_url"), evidence_source_type: str(formData, "evidence_source_type"),
    expected_contents: str(formData, "expected_contents"), receipt_confidence: str(formData, "receipt_confidence") ?? "unknown",
    receipt_confidence_reason: str(formData, "receipt_confidence_reason"), estimated_value: estimatedValue, brand_tier: brandTier,
    offer_type: str(formData, "offer_type") as OfferType | null, source: str(formData, "source"), official_website: str(formData, "official_website"),
    official_social: str(formData, "official_social"), application_link: str(formData, "application_link"), contact_name: str(formData, "contact_name"),
    contact_email: str(formData, "contact_email"), pr_agency: str(formData, "pr_agency"), date_found: str(formData, "date_found"), deadline: str(formData, "deadline"),
    requirements: str(formData, "requirements"), social_requirements: str(formData, "social_requirements"), posting_required: postingRequired,
    posting_platform: str(formData, "posting_platform"), posting_count: num(formData, "posting_count"), posting_deadline: str(formData, "posting_deadline"),
    posting_tags: str(formData, "posting_tags"), disclosure_type: str(formData, "disclosure_type"), shipping_responsibility: shippingResponsibility,
    card_required: safetyInput.cardRequired, payment_required: safetyInput.paymentRequired, purchase_required: safetyInput.purchaseRequired,
    deposit_required: safetyInput.depositRequired, gift_card_requested: safetyInput.giftCardRequested, crypto_requested: safetyInput.cryptoRequested,
    reimbursement_first: safetyInput.reimbursementFirst, membership_fee_required: safetyInput.membershipFeeRequired, telegram_only: safetyInput.telegramOnly,
    whatsapp_only: safetyInput.whatsappOnly, urgent_pressure_language: safetyInput.urgentPressureLanguage, suspicious_attachment: safetyInput.suspiciousAttachment,
    requests_ssn_or_id: safetyInput.requestsSsnOrId, requests_banking_early: safetyInput.requestsBankingEarly, brand_verified: safetyInput.brandVerified,
    verification_status: verificationStatus, safety_badge: safety.badge, safety_reasons: safety.reasons, opportunity_score: score, status: finalStatus,
    request_date: str(formData, "request_date"), approval_date: str(formData, "approval_date"), shipment_date: str(formData, "shipment_date"),
    tracking_number: str(formData, "tracking_number"), delivery_date: str(formData, "delivery_date"), notes: str(formData, "notes"),
    fulfillment_type: str(formData, "fulfillment_type") ?? "gift", available_sizes: str(formData, "available_sizes"), required_size: str(formData, "required_size"),
    color: str(formData, "color"), product_url: str(formData, "product_url"), full_product_or_sample: str(formData, "full_product_or_sample"),
    posts_required_count: num(formData, "posts_required_count"), return_required: bool(formData, "return_required"),
    return_shipping_responsibility: str(formData, "return_shipping_responsibility"), estimated_delivery: str(formData, "estimated_delivery"),
  }, safety, statusOverridden: finalStatus !== requestedStatus };
}

export async function createOpportunity(formData: FormData) {
  const supabase = await createClient(); const { payload, statusOverridden } = buildOpportunityPayload(formData);
  const { data, error } = await supabase.from("sample_opportunities").insert(payload).select("id").single(); if (error) throw new Error(error.message);
  await supabase.from("audit_logs").insert({ action: "opportunity_created", entity_type: "sample_opportunities", entity_id: data.id, details: { safety_badge: payload.safety_badge, status_overridden: statusOverridden } });
  if ((payload.opportunity_score ?? 0) >= 9 && payload.safety_badge === "SAFE") await supabase.from("notifications").insert({ type: "high_score", title: `New high-score opportunity: ${payload.brand}`, body: `${payload.product} — ${payload.opportunity_score}/10`, related_opportunity_id: data.id });
  revalidatePath("/samples"); revalidatePath("/dashboard"); redirect(`/samples/${data.id}${statusOverridden ? "?blocked=1" : ""}`);
}

export async function updateOpportunity(id: string, formData: FormData) {
  const supabase = await createClient(); const { data: previous } = await supabase.from("sample_opportunities").select("status").eq("id", id).single();
  const { payload, statusOverridden } = buildOpportunityPayload(formData);
  const { error } = await supabase.from("sample_opportunities").update(payload).eq("id", id); if (error) throw new Error(error.message);
  await supabase.from("audit_logs").insert({ action: "opportunity_updated", entity_type: "sample_opportunities", entity_id: id, details: { safety_badge: payload.safety_badge, status_overridden: statusOverridden } });
  if (previous?.status !== "approved" && payload.status === "approved") await supabase.from("notifications").insert({ type: "approved", title: `Approved: ${payload.brand}`, body: payload.product, related_opportunity_id: id });
  revalidatePath("/samples"); revalidatePath(`/samples/${id}`); revalidatePath("/dashboard"); redirect(`/samples/${id}${statusOverridden ? "?blocked=1" : ""}`);
}

export async function sendShippingAddress(id: string) {
  const supabase = await createClient();
  const { data: opportunity, error: fetchError } = await supabase.from("sample_opportunities").select("brand, product, safety_badge, payment_required, card_required, status").eq("id", id).single();
  if (fetchError || !opportunity) throw new Error(fetchError?.message ?? "Opportunity not found.");
  if (opportunity.safety_badge !== "SAFE" || opportunity.payment_required || opportunity.card_required) throw new Error("Safety re-check failed — this opportunity is not SAFE or requires payment. Address was not sent.");
  const { error } = await supabase.from("sample_opportunities").update({ status: "address_sent" }).eq("id", id); if (error) throw new Error(error.message);
  await supabase.from("audit_logs").insert({ action: "shipping_address_sent", entity_type: "sample_opportunities", entity_id: id, details: { safety_badge: opportunity.safety_badge } });
  await supabase.from("notifications").insert({ type: "address_sent", title: `Shipping address sent: ${opportunity.brand}`, body: opportunity.product, related_opportunity_id: id });
  revalidatePath("/samples"); revalidatePath(`/samples/${id}`); revalidatePath("/dashboard");
}

export async function deleteOpportunity(id: string) {
  const supabase = await createClient(); const { error } = await supabase.from("sample_opportunities").delete().eq("id", id); if (error) throw new Error(error.message);
  await supabase.from("audit_logs").insert({ action: "opportunity_deleted", entity_type: "sample_opportunities", entity_id: id, details: {} });
  revalidatePath("/samples"); revalidatePath("/dashboard"); redirect("/samples");
}
