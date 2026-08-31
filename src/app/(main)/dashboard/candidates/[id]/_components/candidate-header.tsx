"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Candidate } from "@/lib/hr";

import { getAvatarTone } from "../../../_components/hr/avatar-tone";
import { demoActionToast } from "../../../_components/hr/demo-toast";
import { StatusBadge } from "../../../_components/hr/status-badge";

export function CandidateHeader({ candidate, positionTitle }: { candidate: Candidate; positionTitle: string }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar size="lg" className={`size-16 font-medium sm:size-20 ${getAvatarTone(candidate.id)}`}>
          <AvatarFallback className="text-lg">{candidate.initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-2">
          <div>
            <h1 className="truncate font-heading font-semibold text-xl tracking-tight sm:text-2xl">{candidate.name}</h1>
            <p className="truncate text-muted-foreground text-sm">
              Applying for {positionTitle} · {candidate.currentTitle} at {candidate.currentCompany}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={candidate.stage} />
            <StatusBadge status={candidate.status} />
            <Badge variant="outline" className="rounded-sm">
              Score {candidate.score}
            </Badge>
            <Badge variant="outline" className="rounded-sm">
              {candidate.source}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => demoActionToast(`${candidate.name} rejected`)}>
          <ThumbsDown data-icon="inline-start" />
          Reject
        </Button>
        <Button size="sm" onClick={() => demoActionToast(`${candidate.name} advanced to the next stage`)}>
          <ThumbsUp data-icon="inline-start" />
          Advance stage
        </Button>
      </div>
    </div>
  );
}
