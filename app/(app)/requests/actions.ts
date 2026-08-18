"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildRequestMessage, buildRequestSubject } from "@/lib/message-templates";
import { CATEGORY_LABELS, type Category } from "@/lib/utils";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

export async function createRequest(formData: FormData) {
  const supabase = await createClient();
  const opportunityId = str(formData, "opportunity_id");
  if (!opportunityId) throw new Error("An opportunity must be selected.");

  const { data: opportunity } = await supabase
    .from("sample_opportunities")
    .select("brand, product, category, contact_name, contact_email, required_size")
    .eq("id", opportunityId)
    .single();
  if (!opportunity) throw new Error("Opportunity not found.");

  if (opportunity.category === "clothing" || opportunity.category === "shoes") {
    const { data: profile } = await supabase
      .from("creator_profile")
      .select("dress_size, top_size, bottom_size, denim_size, swim_size, shoe_size")
      .single();

    const hasRelevantSize =
      opportunity.category === "shoes"
        ? Boolean(profile?.shoe_size)
        : Boolean(profile?.dress_size || profile?.top_size || profile?.bottom_size || profile?.denim_size || profile?.swim_size);

    if (!hasRelevantSize) {
      throw new Error(
        `Sizing profile missing — add your ${opportunity.category === "shoes" ? "shoe size" : "clothing sizes"} in Settings before requesting this ${opportunity.category} opportunity. Never guessing a size.`
      );
    }
  }

  const contactName = str(formData, "contact_name") ?? opportunity.contact_name;
  const reasonFits = str(formData, "reason_fits") ?? "";

  const message = buildRequestMessage({
    contactName,
    brand: opportunity.brand,
    product: opportunity.product,
    category: CATEGORY_LABELS[opportunity.category as Category] ?? opportunity.category,
    reasonFits,
  });

  const payload = {
    opportunity_id: opportunityId,
    priority: str(formData, "priority") ?? "medium",
    contact_name: contactName,
    contact_email: str(formData, "contact_email") ?? opportunity.contact_email,
    method: str(formData, "method"),
    subject: buildRequestSubject(opportunity.brand),
    message,
    status: "draft",
  };

  const { data, error } = await supabase.from("sample_requests").insert(payload).select("id").single();
  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    action: "request_drafted",
    entity_type: "sample_requests",
    entity_id: data.id,
    details: { opportunity_id: opportunityId },
  });

  revalidatePath("/requests");
  redirect(`/requests/${data.id}`);
}

export async function updateRequest(id: string, formData: FormData) {
  const supabase = await createClient();
  const payload = {
    priority: str(formData, "priority") ?? "medium",
    contact_name: str(formData, "contact_name"),
    contact_email: str(formData, "contact_email"),
    method: str(formData, "method"),
    subject: str(formData, "subject"),
    message: str(formData, "message"),
    status: str(formData, "status") ?? "draft",
    date_sent: str(formData, "date_sent"),
    follow_up_date: str(formData, "follow_up_date"),
    response: str(formData, "response"),
  };

  const { error } = await supabase.from("sample_requests").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    action: "request_updated",
    entity_type: "sample_requests",
    entity_id: id,
    details: { status: payload.status },
  });

  revalidatePath("/requests");
  revalidatePath(`/requests/${id}`);
  redirect(`/requests/${id}`);
}

export async function deleteRequest(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("sample_requests").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/requests");
  redirect("/requests");
}
