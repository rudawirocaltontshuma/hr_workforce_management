"use client";
import * as React from "react";

import {
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import { Columns3, Download, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dataTableFeatures } from "@/lib/data-table-features";
import type { Employee } from "@/lib/hr";

import { demoActionToast } from "../../_components/hr/demo-toast";
import { HrDataTable } from "../../_components/hr/hr-data-table";
import { employeesColumns } from "./employees-columns";

const COLUMN_LABELS: Record<string, string> = {
  id: "Employee ID",
  department: "Department",
  jobTitle: "Job Title",
  manager: "Manager",
  location: "Location",
  startDate: "Start Date",
  employmentType: "Employment Type",
  status: "Status",
};

export function EmployeesDirectory({
  employees,
  filters,
}: {
  employees: Employee[];
  filters: { departments: string[]; statuses: string[]; locations: string[]; employmentTypes: string[] };
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "startDate", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({ search: false });
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const table = useTable({
    features: dataTableFeatures,
    data: employees,
    columns: employeesColumns,
    state: { rowSelection, sorting, columnFilters, columnVisibility, pagination },
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  const searchQuery = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const departmentFilter = (table.getColumn("department")?.getFilterValue() as string | undefined) ?? "All";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string | undefined) ?? "All";
  const locationFilter = (table.getColumn("location")?.getFilterValue() as string | undefined) ?? "All";
  const employmentTypeFilter = (table.getColumn("employmentType")?.getFilterValue() as string | undefined) ?? "All";
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  function setColumnSelectFilter(columnId: string, value: string) {
    table.getColumn(columnId)?.setFilterValue(value === "All" ? undefined : value);
    table.setPageIndex(0);
  }

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Employee Directory</CardTitle>
        <CardDescription className="max-w-sm leading-snug">
          {employees.length.toLocaleString()} employees across every department and location.
        </CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-8 w-full md:w-64">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    onSelect={(event) => event.preventDefault()}
                  >
                    {COLUMN_LABELS[column.id] ?? column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              demoActionToast("Export started", `Preparing a CSV export of ${employees.length} employees.`)
            }
          >
            <Download /> Export
          </Button>
          <Button size="sm" onClick={() => demoActionToast("Add employee", "This demo does not persist new records.")}>
            <Plus /> Add Employee
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4">
          <div className="flex flex-wrap items-center gap-3">
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

            <Select value={locationFilter} onValueChange={(value) => setColumnSelectFilter("location", value)}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Location:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {["All", ...filters.locations].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={employmentTypeFilter}
              onValueChange={(value) => setColumnSelectFilter("employmentType", value)}
            >
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Type:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {["All", ...filters.employmentTypes].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {selectedCount > 0 ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground tabular-nums">{selectedCount} selected</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => demoActionToast(`${selectedCount} employees updated`, "This is a demo bulk action.")}
              >
                Bulk edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => demoActionToast(`Exported ${selectedCount} selected employees`)}
              >
                Export selected
              </Button>
            </div>
          ) : null}
        </div>

        <HrDataTable table={table} emptyMessage="No employees match these filters." />
      </CardContent>
    </Card>
  );
}
