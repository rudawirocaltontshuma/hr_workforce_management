"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { employeeById, type LeaveRequest } from "@/lib/hr";

import { formatDate } from "../../_components/hr/format";
import { PersonCell } from "../../_components/hr/person-cell";
import { StatusBadge } from "../../_components/hr/status-badge";

export interface LeaveTableMeta {
  onView: (request: LeaveRequest) => void;
}

export const leaveColumns: ColumnDef<DataTableFeatures, LeaveRequest>[] = [
  {
    id: "search",
    accessorFn: (row) => employeeById.get(row.employeeId)?.name ?? "",
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    id: "employee",
    header: "Employee",
    cell: ({ row }) => {
      const employee = employeeById.get(row.original.employeeId);
      if (!employee) return null;
      return (
        <PersonCell id={employee.id} name={employee.name} initials={employee.initials} subtitle={employee.jobTitle} />
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    filterFn: "equalsString",
    cell: ({ row }) => <span className="text-sm">{row.original.type}</span>,
  },
  {
    id: "dates",
    header: "Dates",
    cell: ({ row }) => (
      <span className="text-sm">
        {formatDate(row.original.startDate)} – {formatDate(row.original.endDate)}
      </span>
    ),
  },
  {
    accessorKey: "days",
    header: () => <div className="text-right">Days</div>,
    cell: ({ row }) => <div className="text-right text-sm tabular-nums">{row.original.days}</div>,
  },
  {
    accessorKey: "appliedDate",
    header: "Applied",
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
    cell: ({ row, table }) => (
      <div className="text-right">
        <Button
          size="sm"
          variant="outline"
          onClick={() => (table.options.meta as LeaveTableMeta | undefined)?.onView(row.original)}
        >
          <Eye /> Review
        </Button>
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
];
