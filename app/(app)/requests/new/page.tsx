import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createRequest } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { REQUEST_METHODS, REQUEST_METHOD_LABELS } from "@/lib/utils";
import type { SampleOpportunity } from "@/lib/types";

export default async function NewRequestPage({ searchParams }: { searchParams: Promise<{ opportunity?: string }> }) {
  const { opportunity: preselected } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("sample_opportunities")
    .select("*")
    .neq("safety_badge", "REJECTED")
    .not("status", "in", "(found,researching)")
    .order("opportunity_score", { ascending: false });

  const opportunities = (data ?? []) as SampleOpportunity[];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/requests" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Back to Requests
        </Link>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">New Request</h1>
        <p className="text-sm text-muted-foreground">
          Generates a Draft-Only message from your exact template — nothing is auto-sent. You review, copy, and send it yourself.
        </p>
      </div>

      {opportunities.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No verified (non-rejected) opportunities yet past &ldquo;Researching&rdquo;. Move something to Verified or later in{" "}
          <Link href="/samples" className="underline">
            Samples
          </Link>{" "}
          first.
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createRequest} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="opportunity_id">Opportunity *</Label>
                <Select id="opportunity_id" name="opportunity_id" required defaultValue={preselected ?? ""}>
                  <option value="">— Select —</option>
                  {opportunities.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.brand} — {o.product}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="priority">Priority</Label>
                  <Select id="priority" name="priority" defaultValue="medium">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="method">Method</Label>
                  <Select id="method" name="method" defaultValue="email">
                    {REQUEST_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {REQUEST_METHOD_LABELS[m]}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contact_name">Contact Name</Label>
                  <Input id="contact_name" name="contact_name" placeholder="Leave blank to use opportunity contact" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input id="contact_email" name="contact_email" type="email" placeholder="Leave blank to use opportunity contact" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reason_fits">Why this fits Zoe&apos;s content</Label>
                <Textarea
                  id="reason_fits"
                  name="reason_fits"
                  placeholder="e.g. it lines up with the fall fragrance layering content I've been posting"
                  rows={2}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="gold">
                  Generate Draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
