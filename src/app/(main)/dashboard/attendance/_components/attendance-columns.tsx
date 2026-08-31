"use client";
import type { ColumnDef } from "@tanstack/react-table";

import type { DataTableFeatures } from "@/lib/data-table-features";
import { type AttendanceRecord, departmentById, employeeById } from "@/lib/hr";

import { formatDate } from "../../_components/hr/format";
import { PersonCell } from "../../_components/hr/person-cell";
import { StatusBadge } from "../../_components/hr/status-badge";

export const attendanceColumns: ColumnDef<DataTableFeatures, AttendanceRecord>[] = [
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
    accessorFn: (row) => departmentById.get(employeeById.get(row.employeeId)?.departmentId ?? "")?.name ?? "—",
    header: "Department",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <span className="text-sm">
        {departmentById.get(employeeById.get(row.original.employeeId)?.departmentId ?? "")?.name ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    sortFn: "datetime",
    filterFn: "equalsString",
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.date)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "checkIn",
    header: "Check-in",
    cell: ({ row }) => <span className="text-sm">{row.original.checkIn ?? "—"}</span>,
  },
  {
    accessorKey: "checkOut",
    header: "Check-out",
    cell: ({ row }) => <span className="text-sm">{row.original.checkOut ?? "—"}</span>,
  },
  {
    accessorKey: "hours",
    header: () => <div className="text-right">Hours</div>,
    cell: ({ row }) => <div className="text-right text-sm tabular-nums">{row.original.hours}</div>,
  },
];
