import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { SafetyBadgePill } from "@/components/samples/safety-badge";
import { ScoreBadge } from "@/components/samples/score-badge";
import { formatCurrency, formatDate, PIPELINE_STATUSES, PIPELINE_STATUS_LABELS, CATEGORY_LABELS } from "@/lib/utils";
import type { SampleOpportunity } from "@/lib/types";
import { cn } from "@/lib/utils";

export default async function SamplesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("sample_opportunities").select("*").order("date_found", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  const opportunities = (data ?? []) as SampleOpportunity[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Samples Pipeline</h1>
          <p className="text-sm text-muted-foreground">Every luxury sample opportunity, from Found through Received.</p>
        </div>
        <Button asChild variant="gold">
          <Link href="/samples/new">
            <Plus className="size-4" />
            Add Opportunity
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Link href="/samples">
          <Badge variant={!status ? "default" : "outline"} className="cursor-pointer">
            All
          </Badge>
        </Link>
        {PIPELINE_STATUSES.map((s) => (
          <Link key={s} href={`/samples?status=${s}`}>
            <Badge variant={status === s ? "default" : "outline"} className="cursor-pointer">
              {PIPELINE_STATUS_LABELS[s]}
            </Badge>
          </Link>
        ))}
      </div>

      {opportunities.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No opportunities yet. Add one to start the pipeline — nothing here is fabricated data.
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand / Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Fulfillment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Safety</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Posting</TableHead>
                <TableHead>Found</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((o) => (
                <TableRow key={o.id} className={cn(o.safety_badge === "REJECTED" && "opacity-60")}>
                  <TableCell>
                    <Link href={`/samples/${o.id}`} className="font-medium hover:underline">
                      {o.brand}
                    </Link>
                    <p className="text-xs text-muted-foreground">{o.product}</p>
                  </TableCell>
                  <TableCell className="text-sm">{CATEGORY_LABELS[o.category]}</TableCell>
                  <TableCell className="text-sm">{formatCurrency(o.estimated_value)}</TableCell>
                  <TableCell>
                    {o.fulfillment_type === "loan_showroom_pull" ? (
                      <Badge className="bg-orange-500/15 text-orange-700 dark:text-orange-400">Return Required</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Keep</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{PIPELINE_STATUS_LABELS[o.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    <SafetyBadgePill badge={o.safety_badge} />
                  </TableCell>
                  <TableCell>
                    <ScoreBadge score={o.opportunity_score} />
                  </TableCell>
                  <TableCell className="text-sm">{o.posting_required ? "Required" : "None"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(o.date_found)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
