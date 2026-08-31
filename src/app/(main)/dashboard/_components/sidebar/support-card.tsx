import { LifeBuoy } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportCard() {
  return (
    <Card size="sm" className="overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="min-w-0 px-4">
        <CardTitle className="flex items-center gap-1.5 truncate text-sm">
          <LifeBuoy className="size-3.5 text-muted-foreground" />
          Need a hand?
        </CardTitle>
        <CardDescription className="line-clamp-3">
          Visit the Help Center from the top bar for guided tours, shortcuts and answers from People Ops.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
