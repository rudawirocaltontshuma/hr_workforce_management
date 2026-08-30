"use client";
import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { departmentById, type Employee, employeeById } from "@/lib/hr";

import { demoActionToast } from "../../_components/hr/demo-toast";
import { formatDate } from "../../_components/hr/format";
import { PersonCell } from "../../_components/hr/person-cell";
import { StatusBadge } from "../../_components/hr/status-badge";

export const employeesColumns: ColumnDef<DataTableFeatures, Employee>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Subscribe
          source={table.atoms.rowSelection}
          selector={() =>
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected() && "indeterminate")
          }
        >
          {(checked) => (
            <Checkbox
              aria-label="Select all employees"
              checked={checked}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
          )}
        </Subscribe>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => Boolean(selection?.[row.id])}>
          {(checked) => (
            <Checkbox
              aria-label={`Select ${row.original.name}`}
              checked={checked}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
          )}
        </Subscribe>
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "search",
    accessorFn: (row) => `${row.name} ${row.email} ${row.id} ${row.jobTitle}`,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "Employee",
    cell: ({ row }) => (
      <Link href={`/dashboard/employees/${row.original.id}`} className="block">
        <PersonCell
          id={row.original.id}
          name={row.original.name}
          initials={row.original.initials}
          subtitle={row.original.email}
        />
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Employee ID",
    cell: ({ row }) => <span className="font-mono text-muted-foreground text-xs">{row.original.id}</span>,
  },
  {
    id: "department",
    accessorFn: (row) => departmentById.get(row.departmentId)?.name ?? "Unassigned",
    header: "Department",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <span className="text-sm">{departmentById.get(row.original.departmentId)?.name ?? "Unassigned"}</span>
    ),
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    cell: ({ row }) => <span className="text-sm">{row.original.jobTitle}</span>,
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
    accessorKey: "location",
    header: "Location",
    filterFn: "equalsString",
    cell: ({ row }) => <span className="text-sm">{row.original.location}</span>,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    sortFn: "datetime",
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.startDate)}</span>,
  },
  {
    accessorKey: "employmentType",
    header: "Employment Type",
    filterFn: "equalsString",
    cell: ({ row }) => <span className="text-sm">{row.original.employmentType}</span>,
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
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={`Open actions for ${row.original.name}`}
              className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
              size="icon-sm"
              variant="ghost"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/employees/${row.original.id}`}>
                <Eye />
                View profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => demoActionToast(`Editing ${row.original.name}`)}>
              <Pencil />
              Edit employee
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => demoActionToast(`${row.original.name} marked inactive`)}
            >
              <UserX />
              Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
];
