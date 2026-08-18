"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}

function num(formData: FormData, key: string): number {
  const v = str(formData, key);
  const n = v === null ? 0 : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function logSearchQuery(formData: FormData) {
  const supabase = await createClient();
  const query = str(formData, "query");
  if (!query) throw new Error("Query text is required.");
  const { error } = await supabase.from("search_queries").insert({ query, category: str(formData, "category") });
  if (error) throw new Error(error.message);
  revalidatePath("/settings/search-log");
}

export async function logSearchRun(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("search_runs").insert({
    run_date: str(formData, "run_date") ?? new Date().toISOString().slice(0, 10),
    queries_run: num(formData, "queries_run"),
    results_found: num(formData, "results_found"),
    verified: num(formData, "verified"),
    rejected: num(formData, "rejected"),
    scam: num(formData, "scam"),
    added: num(formData, "added"),
    notes: str(formData, "notes"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/settings/search-log");
}
