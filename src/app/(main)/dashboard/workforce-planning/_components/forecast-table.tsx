import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DepartmentForecast } from "@/lib/hr";

function growthTone(growthRate: number) {
  if (growthRate > 0) return "text-emerald-600 dark:text-emerald-400";
  if (growthRate < 0) return "text-rose-600 dark:text-rose-400";
  return "";
}

export function ForecastTable({ forecasts }: { forecasts: DepartmentForecast[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Department Forecast</CardTitle>
        <CardDescription>Planned headcount and open roles by department for the next fiscal year</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Planned</TableHead>
                <TableHead className="text-right">Open Roles</TableHead>
                <TableHead className="text-right">Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecasts.map((row) => (
                <TableRow key={row.departmentId}>
                  <TableCell className="font-medium text-sm">{row.departmentName}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums">{row.currentHeadcount}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums">{row.plannedHeadcount}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums">{row.openRoles}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`rounded-sm ${growthTone(row.growthRate)}`}>
                      {row.growthRate > 0 ? "+" : ""}
                      {row.growthRate}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
