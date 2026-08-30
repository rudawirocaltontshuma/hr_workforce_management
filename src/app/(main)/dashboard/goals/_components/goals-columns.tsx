"use client";
import type { ColumnDef } from "@tanstack/react-table";

import { Progress } from "@/components/ui/progress";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { departmentById, employeeById, type Goal } from "@/lib/hr";

import { formatDate } from "../../_components/hr/format";
import { StatusBadge, type StatusTone } from "../../_components/hr/status-badge";

function priorityTone(priority: Goal["priority"]): StatusTone {
  if (priority === "High") return "rose";
  if (priority === "Medium") return "amber";
  return "slate";
}

export const goalsColumns: ColumnDef<DataTableFeatures, Goal>[] = [
  {
    id: "search",
    accessorFn: (row) => `${row.title} ${employeeById.get(row.employeeId)?.name ?? ""}`,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "title",
    header: "Goal",
    cell: ({ row }) => (
      <div className="max-w-64">
        <div className="truncate font-medium text-sm">{row.original.title}</div>
        <div className="truncate text-muted-foreground text-xs">{row.original.category}</div>
      </div>
    ),
    enableHiding: false,
  },
  {
    id: "employee",
    accessorFn: (row) => employeeById.get(row.employeeId)?.name ?? "—",
    header: "Employee",
    cell: ({ row }) => <span className="text-sm">{employeeById.get(row.original.employeeId)?.name ?? "—"}</span>,
  },
  {
    id: "department",
    accessorFn: (row) => departmentById.get(row.departmentId)?.name ?? "—",
    header: "Department",
    filterFn: "equalsString",
    cell: ({ row }) => <span className="text-sm">{departmentById.get(row.original.departmentId)?.name ?? "—"}</span>,
  },
  {
    id: "manager",
    accessorFn: (row) => (row.managerId ? (employeeById.get(row.managerId)?.name ?? "—") : "—"),
    header: "Manager",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.managerId ? (employeeById.get(row.original.managerId)?.name ?? "—") : "—"}
      </span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    sortFn: "datetime",
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.dueDate)}</span>,
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <div className="flex w-32 items-center gap-2">
        <Progress value={row.original.progress} className="h-1.5" />
        <span className="w-8 shrink-0 text-right text-muted-foreground text-xs tabular-nums">
          {row.original.progress}%
        </span>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    filterFn: "equalsString",
    cell: ({ row }) => <StatusBadge status={row.original.priority} tone={priorityTone(row.original.priority)} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];
