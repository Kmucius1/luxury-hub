"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

function payloadFrom(formData: FormData) {
  return {
    name: str(formData, "name") ?? "",
    category: str(formData, "category"),
    luxury_tier: str(formData, "luxury_tier") ?? "luxury",
    website: str(formData, "website"),
    instagram: str(formData, "instagram"),
    tiktok: str(formData, "tiktok"),
    pr_agency_id: str(formData, "pr_agency_id"),
    sampling_program: bool(formData, "sampling_program"),
    relationship_stage: str(formData, "relationship_stage") ?? "target",
    notes: str(formData, "notes"),
  };
}

export async function createBrand(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("luxury_brands").insert(payloadFrom(formData)).select("id").single();
  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    action: "brand_created",
    entity_type: "luxury_brands",
    entity_id: data.id,
    details: {},
  });

  revalidatePath("/brands");
  redirect(`/brands/${data.id}`);
}

export async function updateBrand(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("luxury_brands").update(payloadFrom(formData)).eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    action: "brand_updated",
    entity_type: "luxury_brands",
    entity_id: id,
    details: {},
  });

  revalidatePath("/brands");
  revalidatePath(`/brands/${id}`);
  redirect(`/brands/${id}`);
}

export async function deleteBrand(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("luxury_brands").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/brands");
  redirect("/brands");
}

export async function addBrandContact(brandId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("brand_contacts").insert({
    brand_id: brandId,
    name: str(formData, "name"),
    email: str(formData, "email"),
    role: str(formData, "role"),
    verified: bool(formData, "verified"),
    notes: str(formData, "notes"),
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/brands/${brandId}`);
}

export async function deleteBrandContact(brandId: string, contactId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("brand_contacts").delete().eq("id", contactId);
  if (error) throw new Error(error.message);
  revalidatePath(`/brands/${brandId}`);
}
