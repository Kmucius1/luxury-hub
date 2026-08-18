import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate, SHIPMENT_STATUSES, SHIPMENT_STATUS_LABELS } from "@/lib/utils";
import type { Shipment, SampleOpportunity } from "@/lib/types";
import { createShipment } from "./actions";

export default async function ShippingPage() {
  const supabase = await createClient();
  const [{ data: shipmentsData }, { data: opportunitiesData }] = await Promise.all([
    supabase
      .from("shipments")
      .select("*, sample_opportunities(id, brand, product, estimated_value, category)")
      .order("created_at", { ascending: false }),
    supabase
      .from("sample_opportunities")
      .select("*")
      .in("status", ["approved", "address_requested", "address_sent", "processing", "shipped"])
      .order("brand"),
  ]);

  const shipments = (shipmentsData ?? []) as Shipment[];
  const opportunities = (opportunitiesData ?? []) as SampleOpportunity[];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Shipping</h1>
        <p className="text-sm text-muted-foreground">Track approved samples from shipment through delivery.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log a Shipment</CardTitle>
        </CardHeader>
        <CardContent>
          {opportunities.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No approved opportunities yet. Move something to Approved in{" "}
              <Link href="/samples" className="underline">
                Samples
              </Link>{" "}
              first.
            </p>
          ) : (
            <form action={createShipment} className="grid gap-4 sm:grid-cols-2">
              <div className="col-span-full flex flex-col gap-1.5">
                <Label htmlFor="opportunity_id">Opportunity *</Label>
                <Select id="opportunity_id" name="opportunity_id" required defaultValue="">
                  <option value="">— Select —</option>
                  {opportunities.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.brand} — {o.product}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="carrier">Carrier</Label>
                <Input id="carrier" name="carrier" placeholder="e.g. UPS, FedEx" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tracking_number">Tracking Number</Label>
                <Input id="tracking_number" name="tracking_number" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shipment_date">Shipment Date</Label>
                <Input id="shipment_date" name="shipment_date" type="date" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="expected_delivery">Expected Delivery</Label>
                <Input id="expected_delivery" name="expected_delivery" type="date" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="delivery_status">Status</Label>
                <Select id="delivery_status" name="delivery_status" defaultValue="processing">
                  {SHIPMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {SHIPMENT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="col-span-full flex justify-end">
                <Button type="submit" variant="gold">
                  Log Shipment
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {shipments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No shipments logged yet.</div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand / Product</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Link href={`/shipping/${s.id}`} className="font-medium hover:underline">
                      {s.sample_opportunities?.brand ?? "—"}
                    </Link>
                    <p className="text-xs text-muted-foreground">{s.sample_opportunities?.product}</p>
                  </TableCell>
                  <TableCell className="text-sm">{formatCurrency(s.sample_opportunities?.estimated_value)}</TableCell>
                  <TableCell className="text-sm">{s.carrier ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.tracking_number ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={s.delivery_status === "delivered" || s.received ? "gold" : "outline"}>
                      {SHIPMENT_STATUS_LABELS[s.delivery_status] ?? s.delivery_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(s.expected_delivery)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
