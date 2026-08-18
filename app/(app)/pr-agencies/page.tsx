import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { RELATIONSHIP_STAGE_LABELS } from "@/lib/utils";
import type { PrAgency } from "@/lib/types";

export default async function PrAgenciesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("pr_agencies").select("*").order("name");
  const agencies = (data ?? []) as PrAgency[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">PR Agencies</h1>
          <p className="text-sm text-muted-foreground">One PR relationship can open the door to multiple luxury brands.</p>
        </div>
        <Button asChild variant="gold">
          <Link href="/pr-agencies/new">
            <Plus className="size-4" />
            Add Agency
          </Link>
        </Button>
      </div>

      {agencies.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No PR agencies yet. Add real agencies with publicly listed luxury/prestige clients.
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Website</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agencies.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <Link href={`/pr-agencies/${a.id}`} className="font-medium hover:underline">
                      {a.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.city ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{RELATIONSHIP_STAGE_LABELS[a.relationship_stage] ?? a.relationship_stage}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {a.website ? (
                      <a href={a.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:underline">
                        {a.website.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
