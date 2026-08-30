"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Employee } from "@/lib/hr";

const LEVEL_ORDER = ["Junior", "Mid", "Senior", "Manager", "Head", "Executive"] as const;
const DONUT_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

export function DepartmentCharts({ employees }: { employees: Employee[] }) {
  const byLevel = LEVEL_ORDER.map((level) => ({
    level,
    count: employees.filter((e) => e.level === level).length,
  })).filter((row) => row.count > 0);

  const byType = [...new Set(employees.map((e) => e.employmentType))].map((type) => ({
    type,
    count: employees.filter((e) => e.employmentType === type).length,
  }));

  const levelConfig = { count: { label: "Employees", color: "var(--chart-1)" } } satisfies ChartConfig;
  const typeConfig = Object.fromEntries(
    byType.map((row, index) => [row.type, { label: row.type, color: DONUT_COLORS[index % DONUT_COLORS.length] }]),
  ) satisfies ChartConfig;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Headcount by Level</CardTitle>
          <CardDescription>Distribution of seniority levels</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={levelConfig} className="h-56 w-full">
            <BarChart data={byLevel} margin={{ left: -20, right: 12, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis dataKey="level" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Employment Type</CardTitle>
          <CardDescription>Full-time, part-time, contract and intern mix</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={typeConfig} className="mx-auto h-56 w-full max-w-xs">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
              <Pie data={byType} dataKey="count" nameKey="type" innerRadius={45} outerRadius={75} strokeWidth={2}>
                {byType.map((entry, index) => (
                  <Cell key={entry.type} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
