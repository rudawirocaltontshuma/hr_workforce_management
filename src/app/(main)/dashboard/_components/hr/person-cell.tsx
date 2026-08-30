import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { getAvatarTone } from "./avatar-tone";

export function PersonCell({
  id,
  name,
  initials,
  subtitle,
  size = "lg",
}: {
  id: string;
  name: string;
  initials: string;
  subtitle?: string;
  size?: "sm" | "default" | "lg";
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar size={size} className={cn("font-medium", getAvatarTone(id))}>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground text-sm">{name}</div>
        {subtitle ? <div className="truncate text-muted-foreground text-xs">{subtitle}</div> : null}
      </div>
    </div>
  );
}
