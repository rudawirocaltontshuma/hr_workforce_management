"use client";

import * as React from "react";

import Link from "next/link";

import { ArrowUpDown, Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

import { demoActionToast } from "../../_components/hr/demo-toast";
import { StatusBadge } from "../../_components/hr/status-badge";

export interface DepartmentRow {
  id: string;
  name: string;
  code: string;
  managerName: string;
  headcount: number;
  openPositions: number;
  budget: number;
  performance: number;
  status: string;
}

type SortKey = "name" | "headcount" | "openPositions" | "budget" | "performance";

function SortableHead({
  column,
  label,
  className,
  onSort,
}: {
  column: SortKey;
  label: string;
  className?: string;
  onSort: (column: SortKey) => void;
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

export function DepartmentsTable({ rows }: { rows: DepartmentRow[] }) {
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("headcount");
  const [sortDesc, setSortDesc] = React.useState(true);

  const filtered = rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => {
    const direction = sortDesc ? -1 : 1;
    if (sortKey === "name") return a.name.localeCompare(b.name) * direction * -1;
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
        <CardTitle className="text-xl leading-none">Departments</CardTitle>
        <CardDescription>{rows.length} departments across the organization</CardDescription>
        <CardAction className="col-start-1 flex w-full flex-wrap gap-2 md:col-start-2 md:row-span-2 md:w-auto md:justify-end">
          <InputGroup className="h-8 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search departments..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={() => demoActionToast("Export started", "Preparing a department summary export.")}
          >
            <Download /> Export
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4">
            <TableHeader>
              <TableRow>
                <SortableHead column="name" label="Department" onSort={toggleSort} />
                <TableHead className="text-xs uppercase tracking-wide">Manager</TableHead>
                <SortableHead column="headcount" label="Employees" className="text-right" onSort={toggleSort} />
                <SortableHead
                  column="openPositions"
                  label="Open Positions"
                  className="text-right"
                  onSort={toggleSort}
                />
                <SortableHead column="budget" label="Budget" className="text-right" onSort={toggleSort} />
                <SortableHead column="performance" label="Performance" className="w-40" onSort={toggleSort} />
                <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No departments match your search.
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/40">
                    <TableCell>
                      <Link href={`/dashboard/departments/${row.id}`} className="hover:underline">
                        <div className="font-medium text-sm">{row.name}</div>
                        <div className="text-muted-foreground text-xs">{row.code}</div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{row.managerName}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums">{row.headcount}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums">{row.openPositions}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {formatCurrency(row.budget, { noDecimals: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={row.performance} className="h-1.5 w-20" />
                        <span className="text-muted-foreground text-xs tabular-nums">{row.performance}</span>
                      </div>
                    </TableCell>
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
