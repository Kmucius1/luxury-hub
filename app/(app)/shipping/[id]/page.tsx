import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { formatCurrency, SHIPMENT_STATUSES, SHIPMENT_STATUS_LABELS } from "@/lib/utils";
import type { Shipment } from "@/lib/types";
import { updateShipment, deleteShipment } from "../actions";

export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("shipments")
    .select("*, sample_opportunities(id, brand, product, estimated_value, category)")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const s = data as Shipment;

  const boundUpdate = updateShipment.bind(null, id);
  const boundDelete = deleteShipment.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/shipping" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Shipping
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>
            {s.sample_opportunities?.brand} — {s.sample_opportunities?.product}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">Value: {formatCurrency(s.sample_opportunities?.estimated_value)}</p>

          <form action={boundUpdate} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="carrier">Carrier</Label>
              <Input id="carrier" name="carrier" defaultValue={s.carrier ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tracking_number">Tracking Number</Label>
              <Input id="tracking_number" name="tracking_number" defaultValue={s.tracking_number ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="shipment_date">Shipment Date</Label>
              <Input id="shipment_date" name="shipment_date" type="date" defaultValue={s.shipment_date ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expected_delivery">Expected Delivery</Label>
              <Input id="expected_delivery" name="expected_delivery" type="date" defaultValue={s.expected_delivery ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="delivery_status">Status</Label>
              <Select id="delivery_status" name="delivery_status" defaultValue={s.delivery_status}>
                {SHIPMENT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {SHIPMENT_STATUS_LABELS[st]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-end">
              <CheckboxField
                name="received"
                label="Mark as Received"
                hint="Adds this to My Products and closes out the opportunity"
                defaultChecked={s.received}
              />
            </div>
            <div className="col-span-full flex justify-end">
              <Button type="submit" variant="gold">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <form action={boundDelete} className="flex justify-end">
        <Button type="submit" variant="destructive" size="sm">
          Delete Shipment
        </Button>
      </form>
    </div>
  );
}
