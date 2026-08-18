import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { encryptSecret } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expected = cookieStore.get("gmail_oauth_state")?.value;
  cookieStore.delete("gmail_oauth_state");

  if (!code || !state || !expected || state !== expected) {
    return NextResponse.redirect(new URL("/settings/gmail?error=state", origin));
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", origin));

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/settings/gmail?error=oauth_config", origin));
  }

  const redirectUri = `${origin}/api/gmail/callback`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/settings/gmail?error=token", origin));
  }

  const tokens = await tokenRes.json() as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope?: string;
  };

  const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!infoRes.ok) {
    return NextResponse.redirect(new URL("/settings/gmail?error=profile", origin));
  }

  const info = await infoRes.json() as { email: string; sub: string };
  const { data: existing } = await supabase
    .from("gmail_connections")
    .select("encrypted_refresh_token")
    .eq("user_id", user.id)
    .eq("email", info.email)
    .maybeSingle();

  const encryptedRefresh = tokens.refresh_token
    ? encryptSecret(tokens.refresh_token)
    : existing?.encrypted_refresh_token;

  if (!encryptedRefresh) {
    return NextResponse.redirect(new URL("/settings/gmail?error=refresh", origin));
  }

  await supabase.from("gmail_connections").upsert({
    user_id: user.id,
    email: info.email,
    google_sub: info.sub,
    encrypted_refresh_token: encryptedRefresh,
    access_token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    scopes: tokens.scope?.split(" ") ?? [],
    status: "connected",
    connected_at: new Date().toISOString(),
  }, { onConflict: "user_id,email" });

  return NextResponse.redirect(new URL("/settings/gmail?connected=1", origin));
}
