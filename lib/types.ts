import type { Category, OfferType, PipelineStatus, RequestMethod, RequestStatus, WishlistPriority } from "./utils";
import type { SafetyBadge } from "./safety";

export interface CreatorProfile {
  id: string;
  name: string;
  creator_handle: string;
  email: string;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  location: string | null;
  categories: string[];
  bio: string | null;
  media_kit_url: string | null;
  instagram_followers: number | null;
  tiktok_followers: number | null;
  shipping_address: Record<string, string> | null;
  dress_size: string | null;
  top_size: string | null;
  bottom_size: string | null;
  denim_size: string | null;
  bra_size: string | null;
  swim_size: string | null;
  shoe_size: string | null;
  height: string | null;
  measurements: string | null;
  preferred_fit: string | null;
  preferred_heel_height: string | null;
  preferred_colors: string[];
  preferred_styles: string[];
  created_at: string;
  updated_at: string;
}

export interface SampleOpportunity {
  id: string;
  brand: string;
  brand_logo_url: string | null;
  product: string;
  category: Category;
  product_image_url: string | null;
  estimated_value: number | null;
  brand_tier: "luxury" | "premium" | "unverified";
  offer_type: OfferType | null;
  source: string | null;
  official_website: string | null;
  official_social: string | null;
  application_link: string | null;
  contact_name: string | null;
  contact_email: string | null;
  pr_agency: string | null;
  date_found: string | null;
  deadline: string | null;
  requirements: string | null;
  social_requirements: string | null;
  posting_required: boolean;
  posting_platform: string | null;
  posting_count: number | null;
  posting_deadline: string | null;
  posting_tags: string | null;
  disclosure_type: "gifted" | "pr" | "brand_gift" | "ad" | null;
  shipping_responsibility: "brand_covers" | "zoe_covers" | "unclear";
  card_required: boolean;
  payment_required: boolean;
  purchase_required: boolean;
  deposit_required: boolean;
  gift_card_requested: boolean;
  crypto_requested: boolean;
  reimbursement_first: boolean;
  membership_fee_required: boolean;
  telegram_only: boolean;
  whatsapp_only: boolean;
  urgent_pressure_language: boolean;
  suspicious_attachment: boolean;
  requests_ssn_or_id: boolean;
  requests_banking_early: boolean;
  brand_verified: boolean;
  verification_status: "unverified" | "in_progress" | "verified";
  safety_badge: SafetyBadge;
  safety_reasons: string[];
  opportunity_score: number | null;
  status: PipelineStatus;
  request_date: string | null;
  approval_date: string | null;
  shipment_date: string | null;
  tracking_number: string | null;
  delivery_date: string | null;
  notes: string | null;
  fulfillment_type: "gift" | "loan_showroom_pull";
  available_sizes: string | null;
  required_size: string | null;
  color: string | null;
  product_url: string | null;
  full_product_or_sample: "full_product" | "sample" | null;
  posts_required_count: number | null;
  return_required: boolean;
  return_shipping_responsibility: string | null;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
}

export interface SampleRequest {
  id: string;
  opportunity_id: string;
  priority: "low" | "medium" | "high";
  contact_name: string | null;
  contact_email: string | null;
  method: RequestMethod | null;
  subject: string | null;
  message: string | null;
  status: RequestStatus;
  date_sent: string | null;
  follow_up_date: string | null;
  response: string | null;
  created_at: string;
  updated_at: string;
  sample_opportunities?: Pick<SampleOpportunity, "id" | "brand" | "product" | "estimated_value" | "category"> | null;
}

export interface WishlistItem {
  id: string;
  brand: string;
  product: string;
  category: Category | null;
  retail_price: number | null;
  product_url: string | null;
  size: string | null;
  color: string | null;
  priority: WishlistPriority;
  why_wanted: string | null;
  created_at: string;
  updated_at: string;
}

export type RelationshipStage =
  | "target"
  | "researched"
  | "contact_found"
  | "requested"
  | "responded"
  | "first_sample"
  | "pr_list"
  | "repeat_gifting"
  | "priority_relationship";

export interface LuxuryBrand {
  id: string;
  name: string;
  category: string | null;
  luxury_tier: "luxury" | "premium" | "unverified";
  website: string | null;
  instagram: string | null;
  tiktok: string | null;
  pr_agency_id: string | null;
  sampling_program: boolean;
  relationship_stage: RelationshipStage;
  notes: string | null;
  created_at: string;
  updated_at: string;
  pr_agencies?: Pick<PrAgency, "id" | "name"> | null;
}

export interface BrandContact {
  id: string;
  brand_id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  verified: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrAgency {
  id: string;
  name: string;
  website: string | null;
  city: string | null;
  submission_process: string | null;
  past_response: string | null;
  relationship_stage: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrContact {
  id: string;
  agency_id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ShipmentStatus =
  | "approved"
  | "address_sent"
  | "processing"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "received"
  | "issue";

export interface Shipment {
  id: string;
  opportunity_id: string | null;
  carrier: string | null;
  tracking_number: string | null;
  shipment_date: string | null;
  expected_delivery: string | null;
  delivery_status: ShipmentStatus;
  received: boolean;
  created_at: string;
  updated_at: string;
  sample_opportunities?: Pick<SampleOpportunity, "id" | "brand" | "product" | "estimated_value" | "category"> | null;
}

export interface ReceivedProduct {
  id: string;
  opportunity_id: string | null;
  brand: string;
  product: string;
  category: Category | null;
  retail_value: number | null;
  date_received: string | null;
  source: string | null;
  pr_agency: string | null;
  posting_required: boolean;
  posted: boolean;
  notes: string | null;
  fulfillment_type: "gift" | "loan_showroom_pull";
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  opportunity_id: string | null;
  brand_contact_id: string | null;
  subject: string | null;
  status: string;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  sample_opportunities?: Pick<SampleOpportunity, "id" | "brand" | "product"> | null;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  direction: "outbound" | "inbound";
  body: string | null;
  sent_at: string;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  related_opportunity_id: string | null;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface SearchQueryRow {
  id: string;
  query: string;
  category: string | null;
  created_at: string;
}

export interface SearchRunRow {
  id: string;
  run_date: string;
  queries_run: number;
  results_found: number;
  verified: number;
  rejected: number;
  scam: number;
  added: number;
  notes: string | null;
  created_at: string;
}
