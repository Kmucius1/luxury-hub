import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/utils";
import type { WishlistItem } from "@/lib/types";
import { updateWishlistItem, deleteWishlistItem } from "../actions";

export default async function WishlistItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("wish_list").select("*").eq("id", id).single();
  if (!data) notFound();
  const item = data as WishlistItem;

  const boundUpdate = updateWishlistItem.bind(null, id);
  const boundDelete = deleteWishlistItem.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/wishlist" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Wish List
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{item.brand} — {item.product}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={boundUpdate} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="brand">Brand *</Label>
              <Input id="brand" name="brand" required defaultValue={item.brand} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product">Product *</Label>
              <Input id="product" name="product" required defaultValue={item.product} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select id="category" name="category" defaultValue={item.category ?? "fragrance"}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="retail_price">Retail Price ($)</Label>
              <Input id="retail_price" name="retail_price" type="number" min={0} step="1" defaultValue={item.retail_price ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product_url">Product URL</Label>
              <Input id="product_url" name="product_url" defaultValue={item.product_url ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="size">Size</Label>
              <Input id="size" name="size" defaultValue={item.size ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" defaultValue={item.color ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" name="priority" defaultValue={item.priority}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="why_wanted">Why Wanted</Label>
              <Textarea id="why_wanted" name="why_wanted" rows={3} defaultValue={item.why_wanted ?? ""} />
            </div>
            <div className="col-span-full flex justify-end">
              <Button type="submit" variant="gold">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <form action={boundDelete} className="flex justify-end">
        <Button type="submit" variant="destructive" size="sm">
          Remove from Wish List
        </Button>
      </form>
    </div>
  );
}
