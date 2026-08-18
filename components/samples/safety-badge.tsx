import { ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SAFETY_BADGE_LABELS, SAFETY_BADGE_COLORS, type SafetyBadge } from "@/lib/safety";

const ICONS: Record<SafetyBadge, typeof ShieldCheck> = {
  SAFE: ShieldCheck,
  REVIEW: ShieldQuestion,
  HIGH_RISK: ShieldAlert,
  REJECTED: ShieldX,
};

export function SafetyBadgePill({ badge, className }: { badge: SafetyBadge; className?: string }) {
  const Icon = ICONS[badge];
  return (
    <Badge className={cn("gap-1 border-none", SAFETY_BADGE_COLORS[badge], className)}>
      <Icon className="size-3" />
      {SAFETY_BADGE_LABELS[badge]}
    </Badge>
  );
}
