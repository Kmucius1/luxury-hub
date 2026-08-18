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
import type { PrAgency, PrContact } from "@/lib/types";
import { RELATIONSHIP_STAGES, RELATIONSHIP_STAGE_LABELS } from "@/lib/utils";
import { updateAgency, deleteAgency, addAgencyContact, deleteAgencyContact } from "../actions";

export default async function AgencyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: agency }, { data: contactsData }] = await Promise.all([
    supabase.from("pr_agencies").select("*").eq("id", id).single(),
    supabase.from("pr_contacts").select("*").eq("agency_id", id).order("created_at", { ascending: false }),
  ]);

  if (!agency) notFound();
  const a = agency as PrAgency;
  const contacts = (contactsData ?? []) as PrContact[];

  const boundUpdate = updateAgency.bind(null, id);
  const boundDelete = deleteAgency.bind(null, id);
  const boundAddContact = addAgencyContact.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/pr-agencies" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to PR Agencies
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{a.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={boundUpdate} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Agency Name *</Label>
              <Input id="name" name="name" required defaultValue={a.name} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={a.city ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" defaultValue={a.website ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="relationship_stage">Relationship Stage</Label>
              <Select id="relationship_stage" name="relationship_stage" defaultValue={a.relationship_stage}>
                {RELATIONSHIP_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {RELATIONSHIP_STAGE_LABELS[s]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="submission_process">Submission Process</Label>
              <Textarea id="submission_process" name="submission_process" rows={2} defaultValue={a.submission_process ?? ""} />
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="past_response">Past Response</Label>
              <Textarea id="past_response" name="past_response" rows={2} defaultValue={a.past_response ?? ""} />
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={2} defaultValue={a.notes ?? ""} />
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
          <CardTitle>Agency Contacts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contacts logged yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3 text-sm">
                  <div>
                    <p className="font-medium">{c.name ?? "Unnamed contact"}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.role ?? "—"} · {c.email ?? "no email on file"}
                    </p>
                    {c.notes ? <p className="mt-1 text-xs text-muted-foreground">{c.notes}</p> : null}
                  </div>
                  <form action={deleteAgencyContact.bind(null, id, c.id)}>
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
              <Input id="contact_role" name="role" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact_email">Email</Label>
              <Input id="contact_email" name="email" type="email" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact_notes">Notes</Label>
              <Input id="contact_notes" name="notes" />
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
          Delete Agency
        </Button>
      </form>
    </div>
  );
}
