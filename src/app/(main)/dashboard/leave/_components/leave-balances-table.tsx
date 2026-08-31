"use client";

import * as React from "react";

import { Search } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { activeEmployees, getLeaveBalancesForEmployee } from "@/lib/hr";

import { PersonCell } from "../../_components/hr/person-cell";

export function LeaveBalancesTable() {
  const [query, setQuery] = React.useState("");

  const rows = activeEmployees
    .filter((employee) => employee.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 60)
    .map((employee) => {
      const balances = getLeaveBalancesForEmployee(employee.id);
      return {
        employee,
        annual: balances.find((b) => b.type === "Annual"),
        sick: balances.find((b) => b.type === "Sick"),
        personal: balances.find((b) => b.type === "Personal"),
      };
    });

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Leave Balances</CardTitle>
        <CardDescription>Remaining days by employee and leave type</CardDescription>
        <CardAction className="col-start-1 md:col-start-2 md:row-span-2 md:justify-self-end">
          <InputGroup className="h-8 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search employees..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4">
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs uppercase tracking-wide">Employee</TableHead>
                <TableHead className="text-xs uppercase tracking-wide">Annual</TableHead>
                <TableHead className="text-xs uppercase tracking-wide">Sick</TableHead>
                <TableHead className="text-xs uppercase tracking-wide">Personal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No employees match your search.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(({ employee, annual, sick, personal }) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <PersonCell
                        id={employee.id}
                        name={employee.name}
                        initials={employee.initials}
                        subtitle={employee.jobTitle}
                      />
                    </TableCell>
                    {[annual, sick, personal].map((balance, index) => (
                      <TableCell key={["annual", "sick", "personal"][index]} className="w-40">
                        {balance ? (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{balance.remaining} left</span>
                              <span className="text-muted-foreground">of {balance.entitlement}</span>
                            </div>
                            <Progress value={(balance.used / balance.entitlement) * 100} className="h-1.5" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
