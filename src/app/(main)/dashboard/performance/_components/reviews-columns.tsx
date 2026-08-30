"use client";
import type { ColumnDef } from "@tanstack/react-table";

import type { DataTableFeatures } from "@/lib/data-table-features";
import { departmentById, employeeById, type PerformanceReview } from "@/lib/hr";

import { formatDate } from "../../_components/hr/format";
import { PersonCell } from "../../_components/hr/person-cell";
import { StatusBadge } from "../../_components/hr/status-badge";

export const reviewsColumns: ColumnDef<DataTableFeatures, PerformanceReview>[] = [
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
    id: "department",
    accessorFn: (row) => departmentById.get(row.departmentId)?.name ?? "—",
    header: "Department",
    filterFn: "equalsString",
    cell: ({ row }) => <span className="text-sm">{departmentById.get(row.original.departmentId)?.name ?? "—"}</span>,
  },
  {
    accessorKey: "period",
    header: "Period",
    filterFn: "equalsString",
    cell: ({ row }) => <span className="text-sm">{row.original.period}</span>,
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
    accessorKey: "score",
    header: () => <div className="text-right">Score</div>,
    cell: ({ row }) => (
      <div className="text-right text-sm tabular-nums">
        {row.original.status === "Completed" ? row.original.score : "—"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "reviewDate",
    header: "Review Date",
    sortFn: "datetime",
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.reviewDate)}</span>,
  },
];
