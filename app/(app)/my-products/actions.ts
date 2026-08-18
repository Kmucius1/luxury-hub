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

function num(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function createReceivedProduct(formData: FormData) {
  const supabase = await createClient();
  const payload = {
    brand: str(formData, "brand") ?? "",
    product: str(formData, "product") ?? "",
    category: str(formData, "category"),
    retail_value: num(formData, "retail_value"),
    date_received: str(formData, "date_received"),
    source: str(formData, "source"),
    pr_agency: str(formData, "pr_agency"),
    posting_required: bool(formData, "posting_required"),
    posted: false,
    notes: str(formData, "notes"),
    fulfillment_type: str(formData, "fulfillment_type") ?? "gift",
  };

  const { data, error } = await supabase.from("received_products").insert(payload).select("id").single();
  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    action: "product_logged",
    entity_type: "received_products",
    entity_id: data.id,
    details: {},
  });

  revalidatePath("/my-products");
  revalidatePath("/dashboard");
  redirect("/my-products");
}

export async function togglePosted(id: string, formData: FormData) {
  const supabase = await createClient();
  const posted = bool(formData, "posted");
  const { error } = await supabase.from("received_products").update({ posted }).eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    action: "product_posted_toggled",
    entity_type: "received_products",
    entity_id: id,
    details: { posted },
  });

  revalidatePath("/my-products");
}

export async function deleteReceivedProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("received_products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/my-products");
  revalidatePath("/dashboard");
  redirect("/my-products");
}
