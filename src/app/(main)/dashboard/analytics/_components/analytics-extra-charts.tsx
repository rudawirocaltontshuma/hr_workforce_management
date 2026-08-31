"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { courseCompletionRates, turnoverByDepartment } from "@/lib/hr";

export function TurnoverByDepartmentChart({ data }: { data: ReturnType<typeof turnoverByDepartment> }) {
  const config = { rate: { label: "Turnover rate", color: "var(--chart-5)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Turnover by Department</CardTitle>
        <CardDescription>Trailing 12-month turnover rate</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-80 w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="4 4" />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} unit="%" />
            <YAxis
              type="category"
              dataKey="department"
              tickLine={false}
              axisLine={false}
              width={150}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="rate" fill="var(--color-rate)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function CourseCompletionChart({ data }: { data: ReturnType<typeof courseCompletionRates> }) {
  const config = { completionRate: { label: "Completion rate", color: "var(--chart-2)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Course Completion Rates</CardTitle>
        <CardDescription>Completion rate by course</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-96 w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="4 4" />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="course"
              tickLine={false}
              axisLine={false}
              width={190}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="completionRate" fill="var(--color-completionRate)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
