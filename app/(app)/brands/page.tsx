import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CATEGORY_LABELS, RELATIONSHIP_STAGE_LABELS } from "@/lib/utils";
import type { LuxuryBrand } from "@/lib/types";

export default async function BrandsPage({ searchParams }: { searchParams: Promise<{ category?: string; stage?: string }> }) {
  const { category, stage } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("luxury_brands").select("*, pr_agencies(id, name)").order("name");
  if (category) query = query.eq("category", category);
  if (stage) query = query.eq("relationship_stage", stage);
  const { data } = await query;
  const brands = (data ?? []) as LuxuryBrand[];

  const categories = Array.from(new Set(brands.map((b) => b.category).filter(Boolean))) as string[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Luxury Brand Database</h1>
          <p className="text-sm text-muted-foreground">Target list of real luxury/prestige brands — track relationship stage as outreach progresses.</p>
        </div>
        <Button asChild variant="gold">
          <Link href="/brands/new">
            <Plus className="size-4" />
            Add Brand
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Link href="/brands">
          <Badge variant={!category ? "default" : "outline"} className="cursor-pointer">
            All Categories
          </Badge>
        </Link>
        {categories.map((c) => (
          <Link key={c} href={`/brands?category=${c}`}>
            <Badge variant={category === c ? "default" : "outline"} className="cursor-pointer">
              {CATEGORY_LABELS[c as keyof typeof CATEGORY_LABELS] ?? c}
            </Badge>
          </Link>
        ))}
      </div>

      {brands.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No brands yet. Add real, verifiable luxury brands to build your target list.
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>PR Agency</TableHead>
                <TableHead>Website</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <Link href={`/brands/${b.id}`} className="font-medium hover:underline">
                      {b.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{b.category ? CATEGORY_LABELS[b.category as keyof typeof CATEGORY_LABELS] ?? b.category : "—"}</TableCell>
                  <TableCell className="text-sm capitalize">{b.luxury_tier}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{RELATIONSHIP_STAGE_LABELS[b.relationship_stage] ?? b.relationship_stage}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.pr_agencies?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm">
                    {b.website ? (
                      <a href={b.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:underline">
                        {b.website.replace(/^https?:\/\/(www\.)?/, "")}
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
