"use client";

import * as React from "react";

import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Candidate, CandidateStage } from "@/lib/hr";
import { departmentById, positionById, STAGE_ORDER } from "@/lib/hr";

import { getAvatarTone } from "../../_components/hr/avatar-tone";
import { demoActionToast } from "../../_components/hr/demo-toast";

const COLUMN_STAGES: CandidateStage[] = STAGE_ORDER;

function groupByStage(candidates: Candidate[]) {
  const board = {} as Record<CandidateStage, Candidate[]>;
  for (const stage of COLUMN_STAGES) board[stage] = [];
  for (const candidate of candidates) board[candidate.stage]?.push(candidate);
  return board;
}

function CandidateCard({ candidate, onDragStart }: { candidate: Candidate; onDragStart: (id: string) => void }) {
  const position = positionById.get(candidate.positionId);
  const department = departmentById.get(candidate.departmentId);

  return (
    <Card
      size="sm"
      draggable
      onDragStart={() => onDragStart(candidate.id)}
      className="cursor-grab gap-2 px-3 py-3 active:cursor-grabbing"
    >
      <Link href={`/dashboard/candidates/${candidate.id}`} className="flex items-start gap-2.5">
        <Avatar size="sm" className={getAvatarTone(candidate.id)}>
          <AvatarFallback className="text-xs">{candidate.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-sm">{candidate.name}</div>
          <div className="truncate text-muted-foreground text-xs">{position?.title}</div>
          <div className="mt-1.5 flex items-center justify-between">
            <Badge variant="outline" className="rounded-sm text-[10px]">
              {department?.code}
            </Badge>
            <span className="font-medium text-xs tabular-nums">{candidate.score}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export function CandidatesKanban({ candidates }: { candidates: Candidate[] }) {
  const [board, setBoard] = React.useState(() => groupByStage(candidates));
  const draggingId = React.useRef<string | null>(null);

  function handleDrop(targetStage: CandidateStage) {
    const id = draggingId.current;
    // biome-ignore lint/suspicious/noUnnecessaryConditions: draggingId.current is set right before a drop and reset to null after, so it is legitimately nullable here.
    if (!id) return;

    setBoard((current) => {
      let moved: Candidate | undefined;
      const next: Record<CandidateStage, Candidate[]> = { ...current };
      for (const stage of COLUMN_STAGES) {
        const index = next[stage].findIndex((c) => c.id === id);
        if (index !== -1) {
          [moved] = next[stage].splice(index, 1);
          next[stage] = [...next[stage]];
          break;
        }
      }
      if (moved && moved.stage !== targetStage) {
        next[targetStage] = [{ ...moved, stage: targetStage }, ...next[targetStage]];
        demoActionToast(`${moved.name} moved to ${targetStage}`, "Board changes in this demo are not saved.");
      } else if (moved) {
        next[moved.stage] = [moved, ...next[moved.stage]];
      }
      return next;
    });
    draggingId.current = null;
  }

  return (
    <div className="scrollbar-thin -mx-1 flex gap-3 overflow-x-auto px-1 pb-3 [scrollbar-color:var(--border)_transparent]">
      {COLUMN_STAGES.map((stage) => (
        // biome-ignore lint/a11y/noStaticElementInteractions: native HTML5 drag-and-drop drop target; drag handles (the cards) remain focusable and reachable via their own links.
        <div
          key={stage}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => handleDrop(stage)}
          className="flex w-64 shrink-0 flex-col gap-2 rounded-lg bg-muted/40 p-2"
        >
          <div className="flex items-center justify-between px-1.5 pt-1">
            <span className="font-medium text-sm">{stage}</span>
            <Badge variant="outline" className="rounded-sm">
              {board[stage].length}
            </Badge>
          </div>
          <div className="flex min-h-24 flex-col gap-2">
            {board[stage].map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} onDragStart={(id) => (draggingId.current = id)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
