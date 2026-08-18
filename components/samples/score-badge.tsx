import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ScoreBadge({ score, className }: { score: number | null; className?: string }) {
  if (score === null) return <Badge variant="outline" className={className}>—</Badge>;
  const tier = score >= 9 ? "gold" : score >= 7 ? "secondary" : "outline";
  return (
    <Badge variant={tier as "gold" | "secondary" | "outline"} className={cn("font-semibold", className)}>
      {score.toFixed(1)}/10
    </Badge>
  );
}
