import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function PlatformsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("creator_platform_accounts").select("*").order("platform");
  const accounts = data ?? [];
  return <div className="flex flex-col gap-6">
    <div><h1 className="text-xl font-semibold tracking-tight">Creator Platforms</h1><p className="text-sm text-muted-foreground">Track the external creator accounts that feed luxury gifting and sample opportunities into this CRM.</p></div>
    <div className="grid gap-4 md:grid-cols-2">{accounts.map((a)=><Card key={a.id}><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle>{a.platform}</CardTitle><Badge variant={a.status==="active"?"gold":"outline"}>{a.status}</Badge></div></CardHeader><CardContent className="flex flex-col gap-3"><p className="text-sm text-muted-foreground">{a.notes}</p>{a.account_url?<Button asChild variant="outline" className="w-fit"><a href={a.account_url} target="_blank" rel="noreferrer">Open {a.platform}</a></Button>:null}</CardContent></Card>)}</div>
    <Card><CardHeader><CardTitle>Fohr Rules</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-muted-foreground"><p>Fohr is treated as a primary source for Bulletins, gifting opportunities, campaign invitations, and creator work.</p><p>When a Fohr opportunity is added, record Fohr as the source, attach the campaign/product imagery, preserve the opportunity link, and track the application status in the same timeline as email requests.</p><p>Do not claim Fohr applications were viewed unless Fohr itself exposes a real view/status signal.</p></CardContent></Card>
  </div>;
}
