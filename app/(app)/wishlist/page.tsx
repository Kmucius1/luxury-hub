import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, CATEGORY_LABELS, formatCurrency } from "@/lib/utils";
import type { WishlistItem } from "@/lib/types";
import { createWishlistItem } from "./actions";

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("wish_list")
    .select("*")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  const items = (data ?? []) as WishlistItem[];
  const priorityRank: Record<string, number> = { high: 0, medium: 1, low: 2 };
  items.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Wish List</h1>
        <p className="text-sm text-muted-foreground">The research engine prioritizes finding legitimate free opportunities for these.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add to Wish List</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createWishlistItem} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="brand">Brand *</Label>
              <Input id="brand" name="brand" required placeholder="e.g. Creed" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product">Product *</Label>
              <Input id="product" name="product" required placeholder="e.g. Aventus for Her" />
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
              <Label htmlFor="retail_price">Retail Price ($)</Label>
              <Input id="retail_price" name="retail_price" type="number" min={0} step="1" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product_url">Product URL</Label>
              <Input id="product_url" name="product_url" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="size">Size</Label>
              <Input id="size" name="size" placeholder="e.g. Size 8, or M" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" name="priority" defaultValue="medium">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="why_wanted">Why Wanted</Label>
              <Textarea id="why_wanted" name="why_wanted" rows={2} />
            </div>
            <div className="col-span-full flex justify-end">
              <Button type="submit" variant="gold">
                Add to Wish List
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Wish list is empty.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={`/wishlist/${item.id}`}>
              <Card className="h-full transition-colors hover:bg-secondary/40">
                <CardContent className="flex flex-col gap-2 pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{item.brand}</p>
                      <p className="text-sm text-muted-foreground">{item.product}</p>
                    </div>
                    <Badge variant={item.priority === "high" ? "gold" : "outline"} className="capitalize">
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.retail_price)}</p>
                  {item.size || item.color ? (
                    <p className="text-xs text-muted-foreground">{[item.size, item.color].filter(Boolean).join(" · ")}</p>
                  ) : null}
                  {item.why_wanted ? <p className="line-clamp-2 text-xs text-muted-foreground">{item.why_wanted}</p> : null}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
