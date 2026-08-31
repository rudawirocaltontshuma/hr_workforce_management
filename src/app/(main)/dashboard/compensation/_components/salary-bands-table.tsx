"use client";

import * as React from "react";

import { Search } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SalaryBand } from "@/lib/hr";
import { formatCurrency } from "@/lib/utils";

export function SalaryBandsTable({ bands }: { bands: SalaryBand[] }) {
  const [query, setQuery] = React.useState("");
  const filtered = bands.filter((band) => band.departmentName.toLowerCase().includes(query.toLowerCase()));

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">Salary Bands</CardTitle>
        <CardDescription>Min, median and max salary by department and level</CardDescription>
        <CardAction className="col-start-1 md:col-start-2 md:row-span-2 md:justify-self-end">
          <InputGroup className="h-8 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search departments..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <div className="max-h-[28rem] overflow-x-auto overflow-y-auto">
          <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4">
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs uppercase tracking-wide">Department</TableHead>
                <TableHead className="text-xs uppercase tracking-wide">Level</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wide">Min</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wide">Median</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wide">Max</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wide">Headcount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No salary bands match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((band) => (
                  <TableRow key={`${band.departmentId}-${band.level}`}>
                    <TableCell className="text-sm">{band.departmentName}</TableCell>
                    <TableCell className="text-sm">{band.level}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {formatCurrency(band.min, { noDecimals: true })}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {formatCurrency(band.median, { noDecimals: true })}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {formatCurrency(band.max, { noDecimals: true })}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">{band.headcount}</TableCell>
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
