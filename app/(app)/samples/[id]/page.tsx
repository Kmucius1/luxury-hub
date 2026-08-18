import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { OpportunityForm } from "@/components/samples/opportunity-form";
import { SafetyBadgePill } from "@/components/samples/safety-badge";
import { ScoreBadge } from "@/components/samples/score-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { ApplicationEvent, SampleOpportunity } from "@/lib/types";
import { updateOpportunity, updateVisualEvidence, deleteOpportunity, sendShippingAddress } from "../actions";

const CONFIDENCE: Record<string,{label:string;description:string}> = {
  exact_confirmed:{label:"Exact item confirmed",description:"The source specifically identifies this exact product/package as what recipients receive."},
  high:{label:"Highly likely",description:"Strong official or campaign evidence points to this product, but the exact shipment is not guaranteed."},
  medium:{label:"Likely / partial evidence",description:"The campaign or brand evidence suggests this item or set, but contents may vary."},
  low:{label:"Possible",description:"This is a best-supported estimate only. Do not treat it as promised."},
  unknown:{label:"Not confirmed",description:"We do not yet have enough evidence to say what the shipment will contain."},
};

export default async function EditOpportunityPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{blocked?:string}>}) {
  const {id}=await params; const {blocked}=await searchParams; const supabase=await createClient();
  const [{data:opportunity},{data:events}]=await Promise.all([
    supabase.from("sample_opportunities").select("*").eq("id",id).single(),
    supabase.from("application_events").select("*").eq("opportunity_id",id).order("event_at",{ascending:false}),
  ]);
  if(!opportunity)notFound();
  const o=opportunity as SampleOpportunity; const history=(events??[]) as ApplicationEvent[];
  const confidence=CONFIDENCE[o.receipt_confidence??"unknown"];
  const images=[o.pr_package_image_url?{url:o.pr_package_image_url,label:"PR package / campaign image"}:null,o.evidence_image_url?{url:o.evidence_image_url,label:"Evidence image"}:null,o.product_image_url?{url:o.product_image_url,label:"Official / product image"}:null].filter(Boolean) as Array<{url:string;label:string}>;

  return <div className="flex flex-col gap-6">
    <div><Link href="/samples" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5"/>Back to Samples</Link><div className="mt-2 flex flex-wrap items-center gap-3"><h1 className="text-xl font-semibold tracking-tight">{o.brand} — {o.product}</h1><SafetyBadgePill badge={o.safety_badge}/><ScoreBadge score={o.opportunity_score}/>{o.fulfillment_type==="loan_showroom_pull"?<span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:text-orange-400">RETURN REQUIRED — Loan / Showroom Pull</span>:null}</div></div>

    <Card><CardHeader><CardTitle>What You Are Most Likely to Receive</CardTitle></CardHeader><CardContent className="flex flex-col gap-5">
      {images.length?<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{images.map((img,i)=><div key={`${img.url}-${i}`} className="overflow-hidden rounded-lg border border-border"><div className="aspect-square bg-secondary/40"><img src={img.url} alt={img.label} className="h-full w-full object-cover"/></div><p className="p-2 text-xs text-muted-foreground">{img.label}</p></div>)}</div>:<div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No verified visual evidence has been attached yet.</div>}
      <div className="grid gap-4 md:grid-cols-[220px_1fr]"><div><p className="text-xs text-muted-foreground">Receipt confidence</p><Badge variant="gold" className="mt-1">{confidence.label}</Badge></div><p className="text-sm text-muted-foreground">{o.receipt_confidence_reason||confidence.description}</p></div>
      <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Expected contents</p><p className="mt-1 text-sm">{o.expected_contents||"Not confirmed yet. The CRM should keep researching before describing specific contents as expected."}</p></div>
      {o.evidence_source_url?<a href={o.evidence_source_url} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-1 text-sm font-medium underline underline-offset-4">Open evidence source <ExternalLink className="size-3.5"/></a>:null}
      <p className="text-xs text-muted-foreground">Images are evidence, not a guarantee. “Exact item confirmed” is reserved for sources that explicitly identify the shipment contents.</p>

      <details className="rounded-lg border border-border"><summary className="cursor-pointer px-4 py-3 text-sm font-medium">Edit visual evidence</summary><form action={updateVisualEvidence.bind(null,o.id)} className="grid gap-4 border-t border-border p-4 sm:grid-cols-2">
        <div><Label htmlFor="pr_package_image_url">PR Package Image URL</Label><Input id="pr_package_image_url" name="pr_package_image_url" defaultValue={o.pr_package_image_url??""}/></div>
        <div><Label htmlFor="evidence_image_url">Evidence Image URL</Label><Input id="evidence_image_url" name="evidence_image_url" defaultValue={o.evidence_image_url??""}/></div>
        <div className="sm:col-span-2"><Label htmlFor="evidence_source_url">Evidence Source URL</Label><Input id="evidence_source_url" name="evidence_source_url" defaultValue={o.evidence_source_url??""}/></div>
        <div><Label htmlFor="evidence_source_type">Evidence Source Type</Label><Select id="evidence_source_type" name="evidence_source_type" defaultValue={o.evidence_source_type??""}><option value="">Select</option><option value="official_product">Official Product</option><option value="official_pr_package">Official PR Package</option><option value="official_campaign">Official Campaign</option><option value="brand_social">Brand Social</option><option value="pr_agency">PR Agency</option><option value="creator_platform">Creator Platform</option><option value="email_attachment">Email Attachment</option><option value="other">Other</option></Select></div>
        <div><Label htmlFor="receipt_confidence">Receipt Confidence</Label><Select id="receipt_confidence" name="receipt_confidence" defaultValue={o.receipt_confidence??"unknown"}><option value="exact_confirmed">Exact item confirmed</option><option value="high">Highly likely</option><option value="medium">Likely / partial evidence</option><option value="low">Possible</option><option value="unknown">Not confirmed</option></Select></div>
        <div className="sm:col-span-2"><Label htmlFor="expected_contents">Expected Contents</Label><Textarea id="expected_contents" name="expected_contents" defaultValue={o.expected_contents??""} rows={3}/></div>
        <div className="sm:col-span-2"><Label htmlFor="receipt_confidence_reason">Why This Confidence Level?</Label><Textarea id="receipt_confidence_reason" name="receipt_confidence_reason" defaultValue={o.receipt_confidence_reason??""} rows={3}/></div>
        <div className="sm:col-span-2 flex justify-end"><Button type="submit" variant="gold">Save Visual Evidence</Button></div>
      </form></details>
    </CardContent></Card>

    <Card><CardHeader><CardTitle>Application / Request Activity</CardTitle></CardHeader><CardContent>{history.length?<div className="flex flex-col gap-3">{history.map(e=><div key={e.id} className="grid gap-1 border-b border-border pb-3 last:border-0 last:pb-0 sm:grid-cols-[160px_1fr]"><div><Badge variant="outline">{e.event_type.replaceAll("_"," ")}</Badge><p className="mt-1 text-xs text-muted-foreground">{new Date(e.event_at).toLocaleString()}</p></div><div><p className="text-sm">{e.details||"Status event recorded"}</p><p className="mt-1 text-xs text-muted-foreground">Source: {e.source}</p></div></div>)}</div>:<p className="text-sm text-muted-foreground">No application events recorded yet.</p>}<p className="mt-4 text-xs text-muted-foreground">“Viewed” is only recorded when a supported source provides a real signal. Gmail reply activity alone does not prove an email was opened.</p></CardContent></Card>

    {blocked?<Card className="border-destructive/40 bg-destructive/5"><CardContent className="pt-5 text-sm text-destructive">This opportunity&apos;s safety check blocked the selected status. Review the Safety Check below.</CardContent></Card>:null}
    {["approved","address_requested"].includes(o.status)?<Card className="border-accent/40 bg-accent/5"><CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5"><div className="text-sm"><p className="font-medium">Send Shipping Address</p><p className="text-muted-foreground">Re-verifies safety before confirming your address was sent.</p></div><form action={sendShippingAddress.bind(null,o.id)}><Button type="submit" variant="gold" size="sm">Confirm Address Sent</Button></form></CardContent></Card>:null}
    {o.safety_reasons?.length?<Card><CardHeader><CardTitle>Why this badge</CardTitle></CardHeader><CardContent><ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">{o.safety_reasons.map((r,i)=><li key={i}>{r}</li>)}</ul></CardContent></Card>:null}
    <OpportunityForm action={updateOpportunity.bind(null,id)} defaultValues={o} submitLabel="Save Changes"/>
    <form action={deleteOpportunity.bind(null,id)} className="flex justify-end"><Button type="submit" variant="destructive" size="sm">Delete Opportunity</Button></form>
  </div>;
}
