"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

function num(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function updateProfile(id: string, formData: FormData) {
  const supabase = await createClient();
  const categories = (str(formData, "categories") ?? "")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);

  const { error } = await supabase
    .from("creator_profile")
    .update({
      name: str(formData, "name") ?? "",
      creator_handle: str(formData, "creator_handle") ?? "",
      email: str(formData, "email") ?? "",
      instagram_handle: str(formData, "instagram_handle"),
      tiktok_handle: str(formData, "tiktok_handle"),
      location: str(formData, "location"),
      categories,
      bio: str(formData, "bio"),
      media_kit_url: str(formData, "media_kit_url"),
      instagram_followers: num(formData, "instagram_followers"),
      tiktok_followers: num(formData, "tiktok_followers"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function updateShippingAddress(id: string, formData: FormData) {
  const supabase = await createClient();
  const address = {
    line1: str(formData, "line1") ?? "",
    line2: str(formData, "line2") ?? "",
    city: str(formData, "city") ?? "",
    state: str(formData, "state") ?? "",
    zip: str(formData, "zip") ?? "",
    country: str(formData, "country") ?? "",
  };

  const { error } = await supabase.from("creator_profile").update({ shipping_address: address }).eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    action: "shipping_address_updated",
    entity_type: "creator_profile",
    entity_id: id,
    details: {},
  });

  revalidatePath("/settings");
}

function csv(formData: FormData, key: string): string[] {
  return (str(formData, key) ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function updateSizingProfile(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("creator_profile")
    .update({
      dress_size: str(formData, "dress_size"),
      top_size: str(formData, "top_size"),
      bottom_size: str(formData, "bottom_size"),
      denim_size: str(formData, "denim_size"),
      bra_size: str(formData, "bra_size"),
      swim_size: str(formData, "swim_size"),
      shoe_size: str(formData, "shoe_size"),
      height: str(formData, "height"),
      measurements: str(formData, "measurements"),
      preferred_fit: str(formData, "preferred_fit"),
      preferred_heel_height: str(formData, "preferred_heel_height"),
      preferred_colors: csv(formData, "preferred_colors"),
      preferred_styles: csv(formData, "preferred_styles"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    action: "sizing_profile_updated",
    entity_type: "creator_profile",
    entity_id: id,
    details: {},
  });

  revalidatePath("/settings");
}
