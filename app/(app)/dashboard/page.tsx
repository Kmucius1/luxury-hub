import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { SafetyBadgePill } from "@/components/samples/safety-badge";
import { ScoreBadge } from "@/components/samples/score-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  PIPELINE_STATUSES,
  PIPELINE_STATUS_LABELS,
  formatCurrency,
} from "@/lib/utils";
import type { SampleOpportunity } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ data }, { count: sentCount }, { count: repliedCount }] = await Promise.all([
    supabase.from("sample_opportunities").select("*"),
    supabase.from("sample_requests").select("*", { count: "exact", head: true }).eq("status", "sent"),
    supabase.from("conversation_messages").select("*", { count: "exact", head: true }).eq("direction", "inbound"),
  ]);
  const opportunities = (data ?? []) as SampleOpportunity[];

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthApprovedValue = opportunities
    .filter((o) => {
      if (o.status !== "approved" || !o.approval_date) return false;
      const d = new Date(o.approval_date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, o) => sum + (o.estimated_value ?? 0), 0);

  // Headline value totals only count kept GIFTs — a loan/showroom pull must
  // be returned, so it never counts as free product Zoe actually keeps.
  const keptReceived = (o: SampleOpportunity) => o.status === "received" && o.fulfillment_type !== "loan_showroom_pull";

  const lifetimeReceivedValue = opportunities.filter(keptReceived).reduce((sum, o) => sum + (o.estimated_value ?? 0), 0);

  const categoryTotals = CATEGORIES.map((c) => ({
    category: c,
    value: opportunities.filter((o) => o.category === c && keptReceived(o)).reduce((sum, o) => sum + (o.estimated_value ?? 0), 0),
  }));

  const onLoanCount = opportunities.filter((o) => o.fulfillment_type === "loan_showroom_pull" && o.status === "received").length;

  const statusCounts = PIPELINE_STATUSES.map((s) => ({
    status: s,
    count: opportunities.filter((o) => o.status === s).length,
  }));

  const newToday = opportunities
    .filter((o) => o.date_found === todayStr)
    .sort((a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0));

  const scamAlerts = opportunities.filter((o) => o.safety_badge === "HIGH_RISK" || o.safety_badge === "REJECTED");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Zoe&apos;s free luxury sample concierge — live from real data only.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/conversations">
          <StatCard label="Requests Sent" value={String(sentCount ?? 0)} hint="Real emails/applications actually sent — click to see the threads" />
        </Link>
        <Link href="/conversations">
          <StatCard
            label="Replies Received"
            value={String(repliedCount ?? 0)}
            hint={repliedCount ? "Click to read what came back" : "Nothing back yet — check back after a few business days"}
            className={repliedCount ? "border-primary/40" : undefined}
          />
        </Link>
        <StatCard label="Total Opportunities" value={String(opportunities.length)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="This Month — Approved" value={formatCurrency(thisMonthApprovedValue)} hint="Sum of estimated value, approved this month" />
        <StatCard label="Lifetime — Received" value={formatCurrency(lifetimeReceivedValue)} hint="Sum of estimated value, marked Received" />
        <StatCard label="Scam / High-Risk Alerts" value={String(scamAlerts.length)} className={scamAlerts.length ? "border-destructive/40" : undefined} />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold tracking-tight text-foreground">Category Value (Received, Kept Only)</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Excludes loans/showroom pulls{onLoanCount ? ` (${onLoanCount} received on loan, must be returned — not counted here)` : ""}.
        </p>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categoryTotals.map((c) => (
            <StatCard key={c.category} label={CATEGORY_LABELS[c.category]} value={formatCurrency(c.value)} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold tracking-tight text-foreground">Pipeline</h2>
        <div className="flex flex-wrap gap-2">
          {statusCounts.map((s) => (
            <Link key={s.status} href={`/samples?status=${s.status}`}>
              <Badge variant="outline" className="cursor-pointer gap-1.5">
                {PIPELINE_STATUS_LABELS[s.status]}
                <span className="font-semibold">{s.count}</span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Today ({newToday.length})</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {newToday.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing logged today yet.</p>
          ) : (
            newToday.map((o) => (
              <Link
                key={o.id}
                href={`/samples/${o.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border p-3 text-sm hover:bg-secondary/50"
              >
                <div>
                  <p className="font-medium">{o.brand}</p>
                  <p className="text-xs text-muted-foreground">{o.product}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{formatCurrency(o.estimated_value)}</span>
                  <SafetyBadgePill badge={o.safety_badge} />
                  <ScoreBadge score={o.opportunity_score} />
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
