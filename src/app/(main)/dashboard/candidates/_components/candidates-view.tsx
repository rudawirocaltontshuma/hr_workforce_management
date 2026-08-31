"use client";
import * as React from "react";

import { type ColumnFiltersState, type PaginationState, type SortingState, useTable } from "@tanstack/react-table";
import { Download, Kanban, Rows3, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataTableFeatures } from "@/lib/data-table-features";
import type { Candidate } from "@/lib/hr";

import { demoActionToast } from "../../_components/hr/demo-toast";
import { HrDataTable } from "../../_components/hr/hr-data-table";
import { candidatesColumns } from "./candidates-columns";
import { CandidatesKanban } from "./candidates-kanban";

export function CandidatesView({
  candidates,
  filters,
}: {
  candidates: Candidate[];
  filters: { positions: string[]; departments: string[]; stages: string[]; statuses: string[] };
}) {
  const [view, setView] = React.useState<"list" | "board">("list");
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "appliedDate", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const table = useTable({
    features: dataTableFeatures,
    data: candidates,
    columns: candidatesColumns,
    state: { sorting, columnFilters, pagination },
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  const searchQuery = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const positionFilter = (table.getColumn("position")?.getFilterValue() as string | undefined) ?? "All";
  const departmentFilter = (table.getColumn("department")?.getFilterValue() as string | undefined) ?? "All";
  const stageFilter = (table.getColumn("stage")?.getFilterValue() as string | undefined) ?? "All";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string | undefined) ?? "All";

  function setColumnSelectFilter(columnId: string, value: string) {
    table.getColumn(columnId)?.setFilterValue(value === "All" ? undefined : value);
    table.setPageIndex(0);
  }

  const filteredCandidates = table.getFilteredRowModel().rows.map((row) => row.original);

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Candidates</CardTitle>
        <CardDescription>{candidates.length.toLocaleString()} candidates across every open requisition</CardDescription>
        <CardAction className="col-start-1 flex w-full flex-wrap gap-2 md:col-start-2 md:row-span-2 md:w-auto md:justify-end">
          <InputGroup className="h-8 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(event) => {
                table.getColumn("search")?.setFilterValue(event.target.value || undefined);
                table.setPageIndex(0);
              }}
            />
          </InputGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              demoActionToast("Export started", `Preparing a CSV export of ${candidates.length} candidates.`)
            }
          >
            <Download /> Export
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={positionFilter} onValueChange={(value) => setColumnSelectFilter("position", value)}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Position:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {["All", ...filters.positions].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={(value) => setColumnSelectFilter("department", value)}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Department:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {["All", ...filters.departments].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={(value) => setColumnSelectFilter("stage", value)}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Stage:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {["All", ...filters.stages].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setColumnSelectFilter("status", value)}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Status:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {["All", ...filters.statuses].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={view} onValueChange={(value) => setView(value as "list" | "board")}>
            <TabsList>
              <TabsTrigger value="list" aria-label="List view">
                <Rows3 />
              </TabsTrigger>
              <TabsTrigger value="board" aria-label="Board view">
                <Kanban />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {view === "list" ? (
          <HrDataTable table={table} emptyMessage="No candidates match these filters." />
        ) : (
          <div className="px-4">
            <CandidatesKanban candidates={filteredCandidates} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
