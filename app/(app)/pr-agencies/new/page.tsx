import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RELATIONSHIP_STAGES, RELATIONSHIP_STAGE_LABELS } from "@/lib/utils";
import { createAgency } from "../actions";

export default function NewAgencyPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link href="/pr-agencies" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to PR Agencies
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add PR Agency</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAgency} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Agency Name *</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" placeholder="https://" />
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
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="submission_process">Submission Process</Label>
              <Textarea id="submission_process" name="submission_process" rows={2} placeholder="How to submit for consideration, if published" />
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="past_response">Past Response</Label>
              <Textarea id="past_response" name="past_response" rows={2} />
            </div>
            <div className="col-span-full flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={2} />
            </div>
            <div className="col-span-full flex justify-end">
              <Button type="submit" variant="gold">
                Add Agency
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
