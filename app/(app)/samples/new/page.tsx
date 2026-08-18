import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OpportunityForm } from "@/components/samples/opportunity-form";
import { createOpportunity } from "../actions";

export default function NewOpportunityPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/samples" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Back to Samples
        </Link>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">Add Sample Opportunity</h1>
        <p className="text-sm text-muted-foreground">Manually log a discovered opportunity — quick-entry, no automated crawler.</p>
      </div>
      <OpportunityForm action={createOpportunity} submitLabel="Add Opportunity" />
    </div>
  );
}
