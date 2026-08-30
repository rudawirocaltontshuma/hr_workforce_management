"use client";

import { Ellipsis, Mail, Pencil, UserX } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Department, Employee } from "@/lib/hr";

import { getAvatarTone } from "../../../_components/hr/avatar-tone";
import { demoActionToast } from "../../../_components/hr/demo-toast";
import { StatusBadge } from "../../../_components/hr/status-badge";

export function ProfileHeader({ employee, department }: { employee: Employee; department?: Department }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar size="lg" className={`size-16 font-medium sm:size-20 ${getAvatarTone(employee.id)}`}>
          <AvatarFallback className="text-lg">{employee.initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <h1 className="truncate font-heading font-semibold text-xl leading-6 tracking-tight sm:text-2xl sm:leading-7">
              {employee.name}
            </h1>
            <p className="truncate text-muted-foreground text-sm leading-5">
              {employee.jobTitle} · {department?.name ?? "Unassigned"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={employee.status} />
            <Badge variant="outline" className="rounded-sm">
              {employee.employmentType}
            </Badge>
            <Badge variant="outline" className="rounded-sm">
              {employee.location}
            </Badge>
            <Badge variant="outline" className="rounded-sm font-mono">
              {employee.id}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" asChild>
          <a href={`mailto:${employee.email}`}>
            <Mail data-icon="inline-start" />
            Email
          </a>
        </Button>
        <Button size="sm" onClick={() => demoActionToast(`Editing ${employee.name}`)}>
          <Pencil data-icon="inline-start" />
          Edit profile
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="More profile actions" size="icon-sm" variant="outline">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onSelect={() => demoActionToast("Export started", `Preparing a PDF for ${employee.name}.`)}
            >
              Export profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => demoActionToast(`${employee.name} marked inactive`)}
            >
              <UserX />
              Deactivate profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
