"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

function payloadFrom(formData: FormData) {
  return {
    brand: str(formData, "brand") ?? "",
    product: str(formData, "product") ?? "",
    category: str(formData, "category"),
    retail_price: num(formData, "retail_price"),
    product_url: str(formData, "product_url"),
    size: str(formData, "size"),
    color: str(formData, "color"),
    priority: str(formData, "priority") ?? "medium",
    why_wanted: str(formData, "why_wanted"),
  };
}

export async function createWishlistItem(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("wish_list").insert(payloadFrom(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/wishlist");
  redirect("/wishlist");
}

export async function updateWishlistItem(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("wish_list").update(payloadFrom(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/wishlist");
  redirect("/wishlist");
}

export async function deleteWishlistItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("wish_list").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/wishlist");
  redirect("/wishlist");
}
