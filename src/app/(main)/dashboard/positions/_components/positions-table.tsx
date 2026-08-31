"use client";

import * as React from "react";

import Link from "next/link";

import { ArrowUpDown, Download, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { demoActionToast } from "../../_components/hr/demo-toast";
import { formatDate } from "../../_components/hr/format";
import { StatusBadge } from "../../_components/hr/status-badge";

export interface PositionRow {
  id: string;
  title: string;
  departmentName: string;
  location: string;
  hiringManagerName: string;
  openings: number;
  candidateCount: number;
  postedDate: string;
  status: string;
}

type SortKey = "title" | "openings" | "candidateCount" | "postedDate";

function SortableHead({
  column,
  label,
  className,
  onSort,
}: {
  column: SortKey;
  label: string;
  className?: string;
  onSort: (c: SortKey) => void;
}) {
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-1 font-medium text-xs uppercase tracking-wide hover:text-foreground"
      >
        {label}
        <ArrowUpDown className="size-3" />
      </button>
    </TableHead>
  );
}

export function PositionsTable({ rows, statuses }: { rows: PositionRow[]; statuses: string[] }) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("All");
  const [sortKey, setSortKey] = React.useState<SortKey>("postedDate");
  const [sortDesc, setSortDesc] = React.useState(true);

  const filtered = rows.filter(
    (row) =>
      (status === "All" || row.status === status) &&
      (row.title.toLowerCase().includes(query.toLowerCase()) ||
        row.departmentName.toLowerCase().includes(query.toLowerCase())),
  );

  const sorted = [...filtered].sort((a, b) => {
    const direction = sortDesc ? -1 : 1;
    if (sortKey === "title") return a.title.localeCompare(b.title) * direction * -1;
    if (sortKey === "postedDate") return (a.postedDate < b.postedDate ? -1 : 1) * direction * -1;
    return (a[sortKey] - b[sortKey]) * direction * -1;
  });

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDesc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Job Positions</CardTitle>
        <CardDescription>{rows.length} requisitions across every department</CardDescription>
        <CardAction className="col-start-1 flex w-full flex-wrap gap-2 md:col-start-2 md:row-span-2 md:w-auto md:justify-end">
          <InputGroup className="h-8 w-full md:w-56">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search positions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Status:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                {["All", ...statuses].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => demoActionToast("Export started", "Preparing a requisition export.")}
          >
            <Download /> Export
          </Button>
          <Button
            size="sm"
            onClick={() => demoActionToast("Post a job", "This demo does not create real requisitions.")}
          >
            <Plus /> Post a Job
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4">
            <TableHeader>
              <TableRow>
                <SortableHead column="title" label="Position" onSort={toggleSort} />
                <TableHead className="text-xs uppercase tracking-wide">Department</TableHead>
                <TableHead className="text-xs uppercase tracking-wide">Location</TableHead>
                <TableHead className="text-xs uppercase tracking-wide">Hiring Manager</TableHead>
                <SortableHead column="openings" label="Openings" className="text-right" onSort={toggleSort} />
                <SortableHead column="candidateCount" label="Candidates" className="text-right" onSort={toggleSort} />
                <SortableHead column="postedDate" label="Posted" onSort={toggleSort} />
                <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No positions match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/40">
                    <TableCell>
                      <Link href={`/dashboard/positions/${row.id}`} className="font-medium text-sm hover:underline">
                        {row.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{row.departmentName}</TableCell>
                    <TableCell className="text-sm">{row.location}</TableCell>
                    <TableCell className="text-sm">{row.hiringManagerName}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums">{row.openings}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums">{row.candidateCount}</TableCell>
                    <TableCell className="text-sm">{formatDate(row.postedDate)}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
