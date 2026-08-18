import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { OpportunityForm } from "@/components/samples/opportunity-form";
import { SafetyBadgePill } from "@/components/samples/safety-badge";
import { ScoreBadge } from "@/components/samples/score-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SampleOpportunity } from "@/lib/types";
import { updateOpportunity, deleteOpportunity, sendShippingAddress } from "../actions";

export default async function EditOpportunityPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ blocked?: string }>;
}) {
  const { id } = await params;
  const { blocked } = await searchParams;
  const supabase = await createClient();
  const { data: opportunity } = await supabase.from("sample_opportunities").select("*").eq("id", id).single();

  if (!opportunity) notFound();
  const o = opportunity as SampleOpportunity;

  const boundUpdate = updateOpportunity.bind(null, id);
  const boundDelete = deleteOpportunity.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/samples" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Back to Samples
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            {o.brand} — {o.product}
          </h1>
          <SafetyBadgePill badge={o.safety_badge} />
          <ScoreBadge score={o.opportunity_score} />
          {o.fulfillment_type === "loan_showroom_pull" ? (
            <span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:text-orange-400">
              RETURN REQUIRED — Loan / Showroom Pull
            </span>
          ) : null}
        </div>
      </div>

      {blocked ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="pt-5 text-sm text-destructive">
            This opportunity&apos;s safety check blocked the status you chose — it was reset to a safe stage in the pipeline. Review the
            Safety Check section below.
          </CardContent>
        </Card>
      ) : null}

      {["approved", "address_requested"].includes(o.status) ? (
        <Card className="border-accent/40 bg-accent/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
            <div className="text-sm">
              <p className="font-medium">Send Shipping Address</p>
              <p className="text-muted-foreground">
                Re-verifies safety (must be SAFE, no payment/card required) before confirming you sent your address to this brand.
              </p>
            </div>
            <form action={sendShippingAddress.bind(null, o.id)}>
              <Button type="submit" variant="gold" size="sm">
                Confirm Address Sent
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {o.safety_reasons?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Why this badge</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {o.safety_reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <OpportunityForm action={boundUpdate} defaultValues={o} submitLabel="Save Changes" />

      <form action={boundDelete} className="flex justify-end">
        <Button type="submit" variant="destructive" size="sm">
          Delete Opportunity
        </Button>
      </form>
    </div>
  );
}
