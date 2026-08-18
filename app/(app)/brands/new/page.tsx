import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { CATEGORIES, CATEGORY_LABELS, RELATIONSHIP_STAGES, RELATIONSHIP_STAGE_LABELS } from "@/lib/utils";
import type { PrAgency } from "@/lib/types";
import { createBrand } from "../actions";

export default async function NewBrandPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("pr_agencies").select("id, name").order("name");
  const agencies = (data ?? []) as Pick<PrAgency, "id" | "name">[];

  return (
    <div className="flex flex-col gap-6">
      <Link href="/brands" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Brands
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createBrand} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Brand Name *</Label>
              <Input id="name" name="name" required />
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
              <Label htmlFor="luxury_tier">Luxury Tier</Label>
              <Select id="luxury_tier" name="luxury_tier" defaultValue="luxury">
                <option value="luxury">Luxury</option>
                <option value="premium">Premium</option>
                <option value="unverified">Unverified</option>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="relationship_stage">Relationship Stage</Label>
              <Select id="relationship_stage" name="relationship_stage" defaultValue="target">
                {RELATIONSHIP_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {RELATIONSHIP_STAGE_LABELS[s]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Official Website</Label>
              <Input id="website" name="website" placeholder="https://" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pr_agency_id">PR Agency</Label>
              <Select id="pr_agency_id" name="pr_agency_id" defaultValue="">
                <option value="">— None —</option>
                {agencies.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" name="instagram" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tiktok">TikTok</Label>
              <Input id="tiktok" name="tiktok" />
            </div>
            <div className="col-span-full">
              <CheckboxField name="sampling_program" label="Confirmed sampling/creator gifting program" hint="Only check once verified — leave unchecked until confirmed real" />
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} />
            </div>
            <div className="col-span-full flex justify-end">
              <Button type="submit" variant="gold">
                Add Brand
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
