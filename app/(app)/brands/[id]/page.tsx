import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { CATEGORIES, CATEGORY_LABELS, RELATIONSHIP_STAGES, RELATIONSHIP_STAGE_LABELS } from "@/lib/utils";
import type { LuxuryBrand, PrAgency, BrandContact } from "@/lib/types";
import { updateBrand, deleteBrand, addBrandContact, deleteBrandContact } from "../actions";

export default async function BrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: brand }, { data: agenciesData }, { data: contactsData }] = await Promise.all([
    supabase.from("luxury_brands").select("*").eq("id", id).single(),
    supabase.from("pr_agencies").select("id, name").order("name"),
    supabase.from("brand_contacts").select("*").eq("brand_id", id).order("created_at", { ascending: false }),
  ]);

  if (!brand) notFound();
  const b = brand as LuxuryBrand;
  const agencies = (agenciesData ?? []) as Pick<PrAgency, "id" | "name">[];
  const contacts = (contactsData ?? []) as BrandContact[];

  const boundUpdate = updateBrand.bind(null, id);
  const boundDelete = deleteBrand.bind(null, id);
  const boundAddContact = addBrandContact.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/brands" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Brands
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{b.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={boundUpdate} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Brand Name *</Label>
              <Input id="name" name="name" required defaultValue={b.name} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select id="category" name="category" defaultValue={b.category ?? "fragrance"}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="luxury_tier">Luxury Tier</Label>
              <Select id="luxury_tier" name="luxury_tier" defaultValue={b.luxury_tier}>
                <option value="luxury">Luxury</option>
                <option value="premium">Premium</option>
                <option value="unverified">Unverified</option>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="relationship_stage">Relationship Stage</Label>
              <Select id="relationship_stage" name="relationship_stage" defaultValue={b.relationship_stage}>
                {RELATIONSHIP_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {RELATIONSHIP_STAGE_LABELS[s]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Official Website</Label>
              <Input id="website" name="website" defaultValue={b.website ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pr_agency_id">PR Agency</Label>
              <Select id="pr_agency_id" name="pr_agency_id" defaultValue={b.pr_agency_id ?? ""}>
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
              <Input id="instagram" name="instagram" defaultValue={b.instagram ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tiktok">TikTok</Label>
              <Input id="tiktok" name="tiktok" defaultValue={b.tiktok ?? ""} />
            </div>
            <div className="col-span-full">
              <CheckboxField
                name="sampling_program"
                label="Confirmed sampling/creator gifting program"
                hint="Only check once verified"
                defaultChecked={b.sampling_program}
              />
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} defaultValue={b.notes ?? ""} />
            </div>
            <div className="col-span-full flex justify-end">
              <Button type="submit" variant="gold">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Contacts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contacts logged yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3 text-sm">
                  <div>
                    <p className="font-medium">
                      {c.name ?? "Unnamed contact"} {c.verified ? <Badge variant="gold" className="ml-1">Verified</Badge> : null}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.role ?? "—"} · {c.email ?? "no email on file"}
                    </p>
                    {c.notes ? <p className="mt-1 text-xs text-muted-foreground">{c.notes}</p> : null}
                  </div>
                  <form action={deleteBrandContact.bind(null, id, c.id)}>
                    <Button type="submit" variant="ghost" size="icon" aria-label="Delete contact">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}

          <form action={boundAddContact} className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact_name">Name</Label>
              <Input id="contact_name" name="name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact_role">Role</Label>
              <Input id="contact_role" name="role" placeholder="e.g. PR Coordinator" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact_email">Email</Label>
              <Input id="contact_email" name="email" type="email" />
            </div>
            <div className="flex items-end">
              <CheckboxField name="verified" label="Verified real contact" />
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="contact_notes">Notes</Label>
              <Textarea id="contact_notes" name="notes" rows={2} />
            </div>
            <div className="col-span-full flex justify-end">
              <Button type="submit" variant="outline" size="sm">
                Add Contact
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <form action={boundDelete} className="flex justify-end">
        <Button type="submit" variant="destructive" size="sm">
          Delete Brand
        </Button>
      </form>
    </div>
  );
}
