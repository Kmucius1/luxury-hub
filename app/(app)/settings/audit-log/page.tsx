import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import type { AuditLogRow } from "@/lib/types";

export default async function AuditLogPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200);
  const logs = (data ?? []) as AuditLogRow[];

  return (
    <div className="flex flex-col gap-6">
      <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Settings
      </Link>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Read-only record of every meaningful action taken in the app — most recent first.</p>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Nothing logged yet.</div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(l.created_at)}</TableCell>
                  <TableCell className="text-sm">{l.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.entity_type}</TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                    {l.details && Object.keys(l.details).length > 0 ? JSON.stringify(l.details) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
