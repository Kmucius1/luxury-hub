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

export async function createShipment(formData: FormData) {
  const supabase = await createClient();
  const opportunityId = str(formData, "opportunity_id");
  const payload = {
    opportunity_id: opportunityId,
    carrier: str(formData, "carrier"),
    tracking_number: str(formData, "tracking_number"),
    shipment_date: str(formData, "shipment_date"),
    expected_delivery: str(formData, "expected_delivery"),
    delivery_status: str(formData, "delivery_status") ?? "processing",
  };

  const { data, error } = await supabase.from("shipments").insert(payload).select("id").single();
  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    action: "shipment_created",
    entity_type: "shipments",
    entity_id: data.id,
    details: { opportunity_id: opportunityId },
  });

  revalidatePath("/shipping");
  redirect("/shipping");
}

export async function updateShipment(id: string, formData: FormData) {
  const supabase = await createClient();
  const deliveryStatus = str(formData, "delivery_status") ?? "processing";
  const markReceived = bool(formData, "received");

  const { data: shipment, error: fetchError } = await supabase
    .from("shipments")
    .select("*, sample_opportunities(id, brand, product, category, estimated_value, source, pr_agency, posting_required, fulfillment_type)")
    .eq("id", id)
    .single();
  if (fetchError || !shipment) throw new Error(fetchError?.message ?? "Shipment not found.");

  const payload = {
    carrier: str(formData, "carrier"),
    tracking_number: str(formData, "tracking_number"),
    shipment_date: str(formData, "shipment_date"),
    expected_delivery: str(formData, "expected_delivery"),
    delivery_status: deliveryStatus,
    received: markReceived,
  };

  const { error } = await supabase.from("shipments").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  if (deliveryStatus === "delivered") {
    await supabase.from("notifications").insert({
      type: "delivery",
      title: `Delivered: ${shipment.sample_opportunities?.brand ?? "Shipment"}`,
      body: shipment.sample_opportunities?.product ?? null,
      related_opportunity_id: shipment.opportunity_id,
    });
  }

  if (markReceived && shipment.opportunity_id && shipment.sample_opportunities) {
    const o = shipment.sample_opportunities;
    const { data: existing } = await supabase.from("received_products").select("id").eq("opportunity_id", o.id).maybeSingle();

    if (!existing) {
      await supabase.from("received_products").insert({
        opportunity_id: o.id,
        brand: o.brand,
        product: o.product,
        category: o.category,
        retail_value: o.estimated_value,
        source: o.source,
        pr_agency: o.pr_agency,
        posting_required: o.posting_required,
        fulfillment_type: o.fulfillment_type ?? "gift",
      });

      await supabase.from("notifications").insert({
        type: "received",
        title: `Received: ${o.brand} — ${o.product}`,
        body: "Added to My Products.",
        related_opportunity_id: o.id,
      });
    }

    await supabase.from("sample_opportunities").update({ status: "received" }).eq("id", o.id);
  }

  await supabase.from("audit_logs").insert({
    action: "shipment_updated",
    entity_type: "shipments",
    entity_id: id,
    details: { delivery_status: deliveryStatus, received: markReceived },
  });

  revalidatePath("/shipping");
  revalidatePath("/my-products");
  revalidatePath("/dashboard");
  redirect("/shipping");
}

export async function deleteShipment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("shipments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/shipping");
  redirect("/shipping");
}
