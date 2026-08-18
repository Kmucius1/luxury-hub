"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

function payloadFrom(formData: FormData) {
  return {
    name: str(formData, "name") ?? "",
    website: str(formData, "website"),
    city: str(formData, "city"),
    submission_process: str(formData, "submission_process"),
    past_response: str(formData, "past_response"),
    relationship_stage: str(formData, "relationship_stage") ?? "target",
    notes: str(formData, "notes"),
  };
}

export async function createAgency(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("pr_agencies").insert(payloadFrom(formData)).select("id").single();
  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    action: "pr_agency_created",
    entity_type: "pr_agencies",
    entity_id: data.id,
    details: {},
  });

  revalidatePath("/pr-agencies");
  redirect(`/pr-agencies/${data.id}`);
}

export async function updateAgency(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("pr_agencies").update(payloadFrom(formData)).eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    action: "pr_agency_updated",
    entity_type: "pr_agencies",
    entity_id: id,
    details: {},
  });

  revalidatePath("/pr-agencies");
  revalidatePath(`/pr-agencies/${id}`);
  redirect(`/pr-agencies/${id}`);
}

export async function deleteAgency(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("pr_agencies").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/pr-agencies");
  redirect("/pr-agencies");
}

export async function addAgencyContact(agencyId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("pr_contacts").insert({
    agency_id: agencyId,
    name: str(formData, "name"),
    email: str(formData, "email"),
    role: str(formData, "role"),
    notes: str(formData, "notes"),
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/pr-agencies/${agencyId}`);
}

export async function deleteAgencyContact(agencyId: string, contactId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("pr_contacts").delete().eq("id", contactId);
  if (error) throw new Error(error.message);
  revalidatePath(`/pr-agencies/${agencyId}`);
}
