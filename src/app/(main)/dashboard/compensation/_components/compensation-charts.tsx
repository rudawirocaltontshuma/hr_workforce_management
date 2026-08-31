"use client";

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { compensationDistribution, departmentCompensationSummary } from "@/lib/hr";

export function DepartmentCompensationChart({ data }: { data: ReturnType<typeof departmentCompensationSummary> }) {
  const chartData = data.filter((row) => row.headcount > 0).sort((a, b) => b.avgComp - a.avgComp);
  const config = { avgComp: { label: "Avg. compensation", color: "var(--chart-1)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Department Compensation</CardTitle>
        <CardDescription>Average annual salary by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-80 w-full">
          <ComposedChart data={chartData} layout="vertical" margin={{ left: 8, right: 24, top: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="4 4" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
            />
            <YAxis
              type="category"
              dataKey="departmentName"
              tickLine={false}
              axisLine={false}
              width={150}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="avgComp" fill="var(--color-avgComp)" radius={4} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function CompensationDistributionChart({ data }: { data: ReturnType<typeof compensationDistribution> }) {
  const config = { count: { label: "Employees", color: "var(--chart-2)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Compensation Distribution</CardTitle>
        <CardDescription>Employees by salary band</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <ComposedChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function PerformanceComparisonChart({ data }: { data: ReturnType<typeof departmentCompensationSummary> }) {
  const chartData = data.filter((row) => row.headcount > 0);
  const config = {
    avgComp: { label: "Avg. compensation ($k)", color: "var(--chart-1)" },
    avgPerformance: { label: "Avg. performance", color: "var(--chart-4)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Compensation vs. Performance</CardTitle>
        <CardDescription>Average salary compared with average performance score, by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-72 w-full">
          <ComposedChart
            data={chartData.map((row) => ({ ...row, avgCompK: Math.round(row.avgComp / 1000) }))}
            margin={{ left: -10, right: 12, top: 8 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="departmentName"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 10 }}
            />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} width={40} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={30} domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar yAxisId="left" dataKey="avgCompK" name="Avg. comp ($k)" fill="var(--color-avgComp)" radius={4} />
            <Line
              yAxisId="right"
              dataKey="avgPerformance"
              name="Avg. performance"
              stroke="var(--color-avgPerformance)"
              strokeWidth={2}
              dot
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
