import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  delta?: { value: string; direction: "up" | "down" | "flat"; tone?: "positive" | "negative" | "neutral" };
  hint?: string;
}

const DELTA_ICON = { up: ArrowUp, down: ArrowDown, flat: Minus };

function toneForDirection(direction: "up" | "down" | "flat"): "positive" | "negative" | "neutral" {
  if (direction === "up") return "positive";
  if (direction === "down") return "negative";
  return "neutral";
}

function deltaClasses(tone: "positive" | "negative" | "neutral") {
  if (tone === "positive") {
    return "border-emerald-600/50 bg-emerald-500/10 text-emerald-700 dark:border-emerald-800/50 dark:text-emerald-300";
  }
  if (tone === "negative") {
    return "border-rose-600/50 bg-rose-500/10 text-rose-700 dark:border-rose-800/50 dark:text-rose-300";
  }
  return "border-border bg-muted text-muted-foreground";
}

export function KpiCard({ label, value, icon: Icon, delta, hint }: KpiCardProps) {
  const DeltaIcon = delta ? DELTA_ICON[delta.direction] : null;
  const tone = delta?.tone ?? (delta ? toneForDirection(delta.direction) : "neutral");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 font-medium text-muted-foreground text-sm">
          {Icon ? <Icon className="size-3.5" /> : null}
          {label}
        </CardTitle>
        {delta ? (
          <CardAction>
            <Badge className={cn("gap-1 rounded-sm border px-1.5 font-normal text-xs", deltaClasses(tone))}>
              {DeltaIcon ? <DeltaIcon className="size-3" /> : null}
              {delta.value}
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5">
        <span className="font-heading text-2xl text-foreground leading-none tracking-tight sm:text-3xl">{value}</span>
        {hint ? <span className="text-muted-foreground text-xs">{hint}</span> : null}
      </CardContent>
    </Card>
  );
}
