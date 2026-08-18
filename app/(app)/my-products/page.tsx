import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { StatCard } from "@/components/dashboard/stat-card";
import { CATEGORIES, CATEGORY_LABELS, FULFILLMENT_TYPES, FULFILLMENT_TYPE_LABELS, formatCurrency, formatDate } from "@/lib/utils";
import type { ReceivedProduct } from "@/lib/types";
import { createReceivedProduct, togglePosted, deleteReceivedProduct } from "./actions";

export default async function MyProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("received_products").select("*").order("date_received", { ascending: false });
  const products = (data ?? []) as ReceivedProduct[];

  const kept = (p: ReceivedProduct) => p.fulfillment_type !== "loan_showroom_pull";
  const totalValue = products.filter(kept).reduce((sum, p) => sum + (p.retail_value ?? 0), 0);
  const onLoanCount = products.filter((p) => !kept(p)).length;
  const byCategory = CATEGORIES.map((c) => ({
    category: c,
    items: products.filter((p) => p.category === c),
    value: products.filter((p) => p.category === c && kept(p)).reduce((sum, p) => sum + (p.retail_value ?? 0), 0),
  })).filter((c) => c.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My Products</h1>
        <p className="text-sm text-muted-foreground">Everything Zoe has actually received, for free, from real brands.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Value Received (Kept)" value={formatCurrency(totalValue)} hint="Excludes loans/showroom pulls" />
        <StatCard label="Products Received" value={String(products.length)} />
        <StatCard label="On Loan (Must Return)" value={String(onLoanCount)} className={onLoanCount ? "border-orange-500/40" : undefined} />
        <StatCard label="Awaiting Posting" value={String(products.filter((p) => p.posting_required && !p.posted).length)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log a Received Product</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-muted-foreground">
            Shipments marked &ldquo;Received&rdquo; in Shipping are logged here automatically — use this form only for gifts received outside the
            shipment tracker (e.g. hand-delivered event gifts).
          </p>
          <form action={createReceivedProduct} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="brand">Brand *</Label>
              <Input id="brand" name="brand" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product">Product *</Label>
              <Input id="product" name="product" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select id="category" name="category" defaultValue="fragrance">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="retail_value">Retail Value ($)</Label>
              <Input id="retail_value" name="retail_value" type="number" min={0} step="1" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date_received">Date Received</Label>
              <Input id="date_received" name="date_received" type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="source">Source</Label>
              <Input id="source" name="source" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pr_agency">PR Agency</Label>
              <Input id="pr_agency" name="pr_agency" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fulfillment_type">Fulfillment Type</Label>
              <Select id="fulfillment_type" name="fulfillment_type" defaultValue="gift">
                {FULFILLMENT_TYPES.map((f) => (
                  <option key={f} value={f}>
                    {FULFILLMENT_TYPE_LABELS[f]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-end">
              <CheckboxField name="posting_required" label="Posting required" />
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={2} />
            </div>
            <div className="col-span-full flex justify-end">
              <Button type="submit" variant="gold">
                Log Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {byCategory.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Nothing received yet.</div>
      ) : (
        byCategory.map((group) => (
          <div key={group.category}>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
              {CATEGORY_LABELS[group.category]}
              <span className="font-normal text-muted-foreground">{formatCurrency(group.value)}</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((p) => (
                <Card key={p.id}>
                  <CardContent className="flex flex-col gap-2 pt-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{p.brand}</p>
                        <p className="text-sm text-muted-foreground">{p.product}</p>
                      </div>
                      <Badge variant="gold">{formatCurrency(p.retail_value)}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Received {formatDate(p.date_received)}</p>
                    {p.fulfillment_type === "loan_showroom_pull" ? (
                      <Badge className="w-fit bg-orange-500/15 text-orange-700 dark:text-orange-400">Return Required — Loan</Badge>
                    ) : null}
                    {p.posting_required ? (
                      <form action={togglePosted.bind(null, p.id)} className="flex items-center justify-between gap-2 rounded-md border border-accent/40 bg-accent/5 p-2">
                        <span className="text-xs">
                          {p.posted ? "Posted — disclosure used" : "Posting Required — FTC disclosure reminder: Gifted / PR / Brand Gift"}
                        </span>
                        <input type="hidden" name="posted" value={p.posted ? "" : "on"} />
                        <Button type="submit" variant="outline" size="sm">
                          {p.posted ? "Mark Unposted" : "Mark Posted"}
                        </Button>
                      </form>
                    ) : (
                      <Badge variant="outline" className="w-fit">No Posting Required</Badge>
                    )}
                    <form action={deleteReceivedProduct.bind(null, p.id)} className="flex justify-end">
                      <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
                        Remove
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
