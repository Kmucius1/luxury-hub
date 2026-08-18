import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CATEGORIES, CATEGORY_LABELS, formatDate } from "@/lib/utils";
import type { SearchQueryRow, SearchRunRow } from "@/lib/types";
import { logSearchQuery, logSearchRun } from "./actions";

export default async function SearchLogPage() {
  const supabase = await createClient();
  const [{ data: queriesData }, { data: runsData }] = await Promise.all([
    supabase.from("search_queries").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("search_runs").select("*").order("run_date", { ascending: false }).limit(20),
  ]);
  const queries = (queriesData ?? []) as SearchQueryRow[];
  const runs = (runsData ?? []) as SearchRunRow[];

  return (
    <div className="flex flex-col gap-6">
      <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Settings
      </Link>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Search History</h1>
        <p className="text-sm text-muted-foreground">
          Record what a research session searched and found — helps future sessions (Zoe&apos;s or Claude&apos;s) learn what actually works.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log a Search Run</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={logSearchRun} className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="run_date">Date</Label>
                <Input id="run_date" name="run_date" type="date" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="queries_run">Queries Run</Label>
                <Input id="queries_run" name="queries_run" type="number" min={0} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="results_found">Results Found</Label>
                <Input id="results_found" name="results_found" type="number" min={0} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="verified">Verified</Label>
                <Input id="verified" name="verified" type="number" min={0} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rejected">Rejected</Label>
                <Input id="rejected" name="rejected" type="number" min={0} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="scam">Scam</Label>
                <Input id="scam" name="scam" type="number" min={0} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="added">Added</Label>
                <Input id="added" name="added" type="number" min={0} />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={2} />
              </div>
              <div className="col-span-2 flex justify-end">
                <Button type="submit" variant="gold">
                  Log Run
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log a Search Query</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={logSearchQuery} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="query">Query *</Label>
                <Input id="query" name="query" required placeholder="e.g. luxury fragrance creator gifting" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category">Category</Label>
                <Select id="category" name="category" defaultValue="">
                  <option value="">— None —</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="outline" size="sm">
                  Log Query
                </Button>
              </div>
            </form>

            <div className="mt-4 flex max-h-64 flex-col gap-1 overflow-y-auto border-t border-border pt-3">
              {queries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No queries logged yet.</p>
              ) : (
                queries.map((q) => (
                  <p key={q.id} className="text-xs text-muted-foreground">
                    {formatDate(q.created_at)} — {q.query} {q.category ? `(${q.category})` : ""}
                  </p>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {runs.length > 0 ? (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Queries</TableHead>
                <TableHead>Found</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Rejected</TableHead>
                <TableHead>Scam</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm">{formatDate(r.run_date)}</TableCell>
                  <TableCell className="text-sm">{r.queries_run}</TableCell>
                  <TableCell className="text-sm">{r.results_found}</TableCell>
                  <TableCell className="text-sm">{r.verified}</TableCell>
                  <TableCell className="text-sm">{r.rejected}</TableCell>
                  <TableCell className="text-sm">{r.scam}</TableCell>
                  <TableCell className="text-sm">{r.added}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
