import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CreatorProfile } from "@/lib/types";
import { updateProfile, updateShippingAddress, updateSizingProfile } from "./actions";

export default async function SettingsPage() {
  const supabase=await createClient(); const {data}=await supabase.from("creator_profile").select("*").limit(1).single(); const profile=data as CreatorProfile|null;
  if(!profile)return <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No creator profile found — run the seed migration.</div>;
  const hasSizingInfo=Boolean(profile.dress_size||profile.top_size||profile.bottom_size||profile.shoe_size); const missingMetrics=!profile.instagram_followers&&!profile.tiktok_followers;
  const addressSaved=Boolean(profile.shipping_address&&Object.values(profile.shipping_address).some(v=>typeof v==="string"&&v.trim().length>0));
  return <div className="flex flex-col gap-6">
    <div><h1 className="text-xl font-semibold tracking-tight">Settings</h1><p className="text-sm text-muted-foreground">Creator profile, Gmail, platform accounts, sizing, and private shipping information.</p></div>

    <div className="grid gap-4 md:grid-cols-2">
      <Card><CardHeader><CardTitle>Creator Gmail</CardTitle></CardHeader><CardContent className="flex flex-col gap-3"><p className="text-sm text-muted-foreground">Connect the Gmail account that should send PR/sample requests and receive brand replies.</p><Button asChild variant="gold" className="w-fit"><Link href="/settings/gmail">Manage Gmail</Link></Button></CardContent></Card>
      <Card><CardHeader><CardTitle>Creator Platforms</CardTitle></CardHeader><CardContent className="flex flex-col gap-3"><p className="text-sm text-muted-foreground">Fohr is already marked as an active source. Track other creator/gifting platforms here later.</p><Button asChild variant="outline" className="w-fit"><Link href="/settings/platforms">Manage Platforms</Link></Button></CardContent></Card>
    </div>

    {missingMetrics?<Card className="border-accent/40 bg-accent/5"><CardContent className="pt-5 text-sm">Follower counts are empty. Add your real Instagram/TikTok numbers when known.</CardContent></Card>:null}

    <Card><CardHeader><CardTitle>Creator Profile</CardTitle></CardHeader><CardContent><form action={updateProfile.bind(null,profile.id)} className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={profile.name} required/></div>
      <div className="flex flex-col gap-1.5"><Label htmlFor="creator_handle">Creator Handle</Label><Input id="creator_handle" name="creator_handle" defaultValue={profile.creator_handle} required/></div>
      <div className="flex flex-col gap-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" defaultValue={profile.email} required/></div>
      <div className="flex flex-col gap-1.5"><Label htmlFor="location">Location</Label><Input id="location" name="location" defaultValue={profile.location??""}/></div>
      <div className="flex flex-col gap-1.5"><Label htmlFor="instagram_handle">Instagram Handle</Label><Input id="instagram_handle" name="instagram_handle" defaultValue={profile.instagram_handle??""} placeholder="lifeaszoetaylor"/></div>
      <div className="flex flex-col gap-1.5"><Label htmlFor="tiktok_handle">TikTok Handle</Label><Input id="tiktok_handle" name="tiktok_handle" defaultValue={profile.tiktok_handle??""} placeholder="Zoettaylor14"/></div>
      <div className="flex flex-col gap-1.5"><Label htmlFor="instagram_followers">Instagram Followers</Label><Input id="instagram_followers" name="instagram_followers" type="number" min={0} defaultValue={profile.instagram_followers??""}/></div>
      <div className="flex flex-col gap-1.5"><Label htmlFor="tiktok_followers">TikTok Followers</Label><Input id="tiktok_followers" name="tiktok_followers" type="number" min={0} defaultValue={profile.tiktok_followers??""}/></div>
      <div className="flex flex-col gap-1.5"><Label htmlFor="media_kit_url">Media Kit URL</Label><Input id="media_kit_url" name="media_kit_url" defaultValue={profile.media_kit_url??""}/></div>
      <div className="flex flex-col gap-1.5"><Label htmlFor="categories">Categories (comma-separated)</Label><Input id="categories" name="categories" defaultValue={profile.categories?.join(", ")??""}/></div>
      <div className="col-span-full flex flex-col gap-1.5"><Label htmlFor="bio">Creator Bio</Label><Textarea id="bio" name="bio" rows={3} defaultValue={profile.bio??""}/></div>
      <div className="col-span-full flex justify-end"><Button type="submit" variant="gold">Save Changes</Button></div>
    </form></CardContent></Card>

    <Card><CardHeader><CardTitle>Sizing Profile</CardTitle></CardHeader><CardContent className="flex flex-col gap-3">
      <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Status:</span><Badge variant={hasSizingInfo?"gold":"outline"}>{hasSizingInfo?"On File":"Not Set"}</Badge></div>
      <p className="text-xs text-muted-foreground">Private. Used only to avoid guessing clothing/shoe sizes.</p>
      <form action={updateSizingProfile.bind(null,profile.id)} className="grid gap-4 sm:grid-cols-2">
        {[["dress_size","Dress Size"],["top_size","Top Size"],["bottom_size","Bottom Size"],["denim_size","Denim Size"],["bra_size","Bra Size (optional)"],["swim_size","Swim Size"],["shoe_size","Shoe Size"],["height","Height"],["preferred_fit","Preferred Fit"],["preferred_heel_height","Preferred Heel Height"]].map(([k,l])=><div key={k} className="flex flex-col gap-1.5"><Label htmlFor={k}>{l}</Label><Input id={k} name={k} defaultValue={(profile as any)[k]??""}/></div>)}
        <div className="flex flex-col gap-1.5"><Label htmlFor="preferred_colors">Preferred Colors</Label><Input id="preferred_colors" name="preferred_colors" defaultValue={profile.preferred_colors?.join(", ")??""}/></div>
        <div className="flex flex-col gap-1.5"><Label htmlFor="preferred_styles">Styles Actually Worn</Label><Input id="preferred_styles" name="preferred_styles" defaultValue={profile.preferred_styles?.join(", ")??""}/></div>
        <div className="col-span-full flex flex-col gap-1.5"><Label htmlFor="measurements">Measurements</Label><Textarea id="measurements" name="measurements" rows={2} defaultValue={profile.measurements??""}/></div>
        <div className="col-span-full flex justify-end"><Button type="submit" variant="gold">Save Sizing Profile</Button></div>
      </form>
    </CardContent></Card>

    <Card><CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader><CardContent className="flex flex-col gap-3">
      <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Status:</span><Badge variant={addressSaved?"gold":"outline"}>{addressSaved?"Saved ✓":"Not Set"}</Badge></div>
      <p className="text-xs text-muted-foreground">The saved address is not re-displayed. It is only released to a verified brand after the safety checks pass.</p>
      <details className="rounded-md border border-border"><summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium">{addressSaved?"Overwrite Shipping Address":"Set Shipping Address"}</summary><form action={updateShippingAddress.bind(null,profile.id)} className="grid gap-3 border-t border-border p-3 sm:grid-cols-2">
        <div className="col-span-full flex flex-col gap-1.5"><Label htmlFor="line1">Address Line 1</Label><Input id="line1" name="line1" autoComplete="off"/></div><div className="col-span-full flex flex-col gap-1.5"><Label htmlFor="line2">Address Line 2</Label><Input id="line2" name="line2" autoComplete="off"/></div>
        <div className="flex flex-col gap-1.5"><Label htmlFor="city">City</Label><Input id="city" name="city" autoComplete="off"/></div><div className="flex flex-col gap-1.5"><Label htmlFor="state">State</Label><Input id="state" name="state" autoComplete="off"/></div><div className="flex flex-col gap-1.5"><Label htmlFor="zip">ZIP</Label><Input id="zip" name="zip" autoComplete="off"/></div><div className="flex flex-col gap-1.5"><Label htmlFor="country">Country</Label><Input id="country" name="country" autoComplete="off" defaultValue="United States"/></div>
        <div className="col-span-full flex justify-end"><Button type="submit" variant="gold">Save Address</Button></div>
      </form></details>
    </CardContent></Card>

    <div className="flex flex-wrap gap-3"><Link href="/settings/search-log"><Button type="button" variant="outline" size="sm">Search History</Button></Link><Link href="/settings/audit-log"><Button type="button" variant="outline" size="sm">Audit Log</Button></Link></div>
  </div>;
}
