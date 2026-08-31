"use client";
import * as React from "react";

import { type ColumnFiltersState, type PaginationState, type SortingState, useTable } from "@tanstack/react-table";
import { Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dataTableFeatures } from "@/lib/data-table-features";
import type { PerformanceReview } from "@/lib/hr";

import { demoActionToast } from "../../_components/hr/demo-toast";
import { HrDataTable } from "../../_components/hr/hr-data-table";
import { reviewsColumns } from "./reviews-columns";

export function ReviewsTable({
  reviews,
  filters,
}: {
  reviews: PerformanceReview[];
  filters: { departments: string[]; periods: string[]; statuses: string[] };
}) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "reviewDate", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    { id: "period", value: filters.periods[filters.periods.length - 1] },
  ]);
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const table = useTable({
    features: dataTableFeatures,
    data: reviews,
    columns: reviewsColumns,
    state: { sorting, columnFilters, pagination },
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  const searchQuery = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const departmentFilter = (table.getColumn("department")?.getFilterValue() as string | undefined) ?? "All";
  const periodFilter = (table.getColumn("period")?.getFilterValue() as string | undefined) ?? "All";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string | undefined) ?? "All";

  function setColumnSelectFilter(columnId: string, value: string) {
    table.getColumn(columnId)?.setFilterValue(value === "All" ? undefined : value);
    table.setPageIndex(0);
  }

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Performance Reviews</CardTitle>
        <CardDescription>{reviews.length.toLocaleString()} reviews across every cycle</CardDescription>
        <CardAction className="col-start-1 flex w-full flex-wrap gap-2 md:col-start-2 md:row-span-2 md:w-auto md:justify-end">
          <InputGroup className="h-8 w-full md:w-56">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search employees..."
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
            onClick={() => demoActionToast("Export started", "Preparing a performance review export.")}
          >
            <Download /> Export
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="flex flex-wrap items-center gap-3 px-4">
          <Select value={periodFilter} onValueChange={(value) => setColumnSelectFilter("period", value)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">Period:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                {["All", ...filters.periods].map((option) => (
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
        <HrDataTable table={table} emptyMessage="No reviews match these filters." />
      </CardContent>
    </Card>
  );
}
