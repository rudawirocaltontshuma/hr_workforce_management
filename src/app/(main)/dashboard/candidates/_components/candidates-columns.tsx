"use client";
import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { type Candidate, departmentById, employeeById, positionById } from "@/lib/hr";

import { demoActionToast } from "../../_components/hr/demo-toast";
import { formatDate } from "../../_components/hr/format";
import { PersonCell } from "../../_components/hr/person-cell";
import { StatusBadge } from "../../_components/hr/status-badge";

function scoreTone(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function ScoreCell({ score }: { score: number }) {
  return <span className={`font-medium text-sm tabular-nums ${scoreTone(score)}`}>{score}</span>;
}

export const candidatesColumns: ColumnDef<DataTableFeatures, Candidate>[] = [
  {
    id: "search",
    accessorFn: (row) => `${row.name} ${row.email}`,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "Candidate",
    cell: ({ row }) => (
      <Link href={`/dashboard/candidates/${row.original.id}`} className="block">
        <PersonCell
          id={row.original.id}
          name={row.original.name}
          initials={row.original.initials}
          subtitle={row.original.currentTitle}
        />
      </Link>
    ),
    enableHiding: false,
  },
  {
    id: "position",
    accessorFn: (row) => positionById.get(row.positionId)?.title ?? "—",
    header: "Position",
    filterFn: "equalsString",
    cell: ({ row }) => <span className="text-sm">{positionById.get(row.original.positionId)?.title ?? "—"}</span>,
  },
  {
    id: "department",
    accessorFn: (row) => departmentById.get(row.departmentId)?.name ?? "—",
    header: "Department",
    filterFn: "equalsString",
    cell: ({ row }) => <span className="text-sm">{departmentById.get(row.original.departmentId)?.name ?? "—"}</span>,
  },
  {
    id: "recruiter",
    accessorFn: (row) => employeeById.get(row.recruiterId)?.name ?? "—",
    header: "Recruiter",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{employeeById.get(row.original.recruiterId)?.name ?? "—"}</span>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    filterFn: "equalsString",
    cell: ({ row }) => <StatusBadge status={row.original.stage} />,
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => <ScoreCell score={row.original.score} />,
  },
  {
    accessorKey: "appliedDate",
    header: "Applied Date",
    sortFn: "datetime",
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.appliedDate)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={`Open actions for ${row.original.name}`}
              className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
              size="icon-sm"
              variant="ghost"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/candidates/${row.original.id}`}>
                <Eye />
                View profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => demoActionToast(`${row.original.name} advanced to the next stage`)}>
              <ThumbsUp />
              Advance stage
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => demoActionToast(`${row.original.name} rejected`)}>
              <ThumbsDown />
              Reject candidate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
];
