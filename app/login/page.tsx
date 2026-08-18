import { signIn } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Luxury Free Samples Hub</CardTitle>
          <CardDescription>Sign in to Zoe&apos;s concierge dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signIn} className="flex flex-col gap-4">
            <input type="hidden" name="redirectTo" value={params.redirectTo ?? "/dashboard"} />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" placeholder="Zoettaylor14@gmail.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            {params.error ? <p className="text-sm text-destructive">{params.error}</p> : null}
            <Button type="submit" className="mt-2">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
