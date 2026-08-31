"use client";
import * as React from "react";

import { type ColumnFiltersState, type PaginationState, type SortingState, useTable } from "@tanstack/react-table";
import { Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dataTableFeatures } from "@/lib/data-table-features";
import { employeeById, type LeaveRequest, type LeaveStatus } from "@/lib/hr";

import { demoActionToast } from "../../_components/hr/demo-toast";
import { formatDate } from "../../_components/hr/format";
import { HrDataTable } from "../../_components/hr/hr-data-table";
import { PersonCell } from "../../_components/hr/person-cell";
import { StatusBadge } from "../../_components/hr/status-badge";
import { type LeaveTableMeta, leaveColumns } from "./leave-columns";

export function LeaveRequestsPanel({
  requests: initialRequests,
  filters,
}: {
  requests: LeaveRequest[];
  filters: { types: string[]; statuses: string[] };
}) {
  const [requests, setRequests] = React.useState(initialRequests);
  const [selected, setSelected] = React.useState<LeaveRequest | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "appliedDate", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const meta: LeaveTableMeta = { onView: (request) => setSelected(request) };

  const table = useTable({
    features: dataTableFeatures,
    data: requests,
    columns: leaveColumns,
    state: { sorting, columnFilters, pagination },
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    meta,
  });

  const searchQuery = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const typeFilter = (table.getColumn("type")?.getFilterValue() as string | undefined) ?? "All";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string | undefined) ?? "All";

  function setColumnSelectFilter(columnId: string, value: string) {
    table.getColumn(columnId)?.setFilterValue(value === "All" ? undefined : value);
    table.setPageIndex(0);
  }

  function updateStatus(id: string, status: LeaveStatus) {
    setRequests((current) => current.map((request) => (request.id === id ? { ...request, status } : request)));
    setSelected((current) => (current && current.id === id ? { ...current, status } : current));
  }

  const selectedEmployee = selected ? employeeById.get(selected.employeeId) : undefined;

  return (
    <>
      <Card>
        <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
          <CardTitle className="text-xl leading-none">Leave Requests</CardTitle>
          <CardDescription>{requests.length.toLocaleString()} requests across every leave type</CardDescription>
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
              onClick={() => demoActionToast("Export started", "Preparing a leave requests export.")}
            >
              <Download /> Export
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-0">
          <div className="flex flex-wrap items-center gap-3 px-4">
            <Select value={typeFilter} onValueChange={(value) => setColumnSelectFilter("type", value)}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">Type:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {["All", ...filters.types].map((option) => (
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
          <HrDataTable table={table} emptyMessage="No leave requests match these filters." />
        </CardContent>
      </Card>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected && selectedEmployee ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.type} Leave Request</DialogTitle>
                <DialogDescription>Submitted {formatDate(selected.appliedDate)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <PersonCell
                  id={selectedEmployee.id}
                  name={selectedEmployee.name}
                  initials={selectedEmployee.initials}
                  subtitle={selectedEmployee.jobTitle}
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Dates</div>
                    <div>
                      {formatDate(selected.startDate)} – {formatDate(selected.endDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Duration</div>
                    <div>{selected.days} day(s)</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Status</div>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Reason</div>
                    <div>{selected.reason}</div>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-wrap gap-2 sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    updateStatus(selected.id, "Cancelled");
                    demoActionToast("Request cancelled");
                  }}
                >
                  Cancel Request
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateStatus(selected.id, "Rejected");
                      demoActionToast("Request rejected");
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      updateStatus(selected.id, "Approved");
                      demoActionToast("Request approved");
                    }}
                  >
                    Approve
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
