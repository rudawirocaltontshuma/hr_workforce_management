"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type {
  DepartmentForecast,
  headcountForecastSeries,
  hiringForecastByQuarter,
  workforceCostForecast,
} from "@/lib/hr";

export function HeadcountForecastChart({ data }: { data: ReturnType<typeof headcountForecastSeries> }) {
  const config = { headcount: { label: "Projected headcount", color: "var(--chart-1)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Headcount Forecast</CardTitle>
        <CardDescription>Projected active headcount over the next four quarters</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <AreaChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillHeadcountForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-headcount)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-headcount)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="headcount"
              type="monotone"
              fill="url(#fillHeadcountForecast)"
              stroke="var(--color-headcount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function HiringPlanChart({ data }: { data: ReturnType<typeof hiringForecastByQuarter> }) {
  const config = { hires: { label: "Planned hires", color: "var(--chart-2)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Hiring Plan</CardTitle>
        <CardDescription>Planned new hires by quarter</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="quarter" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="hires" fill="var(--color-hires)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function WorkforceCostChart({ data }: { data: ReturnType<typeof workforceCostForecast> }) {
  const config = { cost: { label: "Projected payroll cost", color: "var(--chart-5)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Workforce Costs</CardTitle>
        <CardDescription>Projected total payroll cost by quarter</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <AreaChart data={data} margin={{ left: 0, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillWorkforceCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-cost)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-cost)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={60}
              tickFormatter={(v: number) => `$${Math.round(v / 1_000_000)}M`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="cost"
              type="monotone"
              fill="url(#fillWorkforceCost)"
              stroke="var(--color-cost)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function DepartmentGrowthChart({ data }: { data: DepartmentForecast[] }) {
  const chartData = data
    .filter((row) => row.currentHeadcount > 0)
    .sort((a, b) => b.plannedHeadcount - a.plannedHeadcount);
  const config = {
    currentHeadcount: { label: "Current", color: "var(--chart-3)" },
    plannedHeadcount: { label: "Planned", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Department Growth</CardTitle>
        <CardDescription>Current vs. planned headcount by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-96 w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24, top: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="4 4" />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="departmentName"
              tickLine={false}
              axisLine={false}
              width={150}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="currentHeadcount" fill="var(--color-currentHeadcount)" radius={4} />
            <Bar dataKey="plannedHeadcount" fill="var(--color-plannedHeadcount)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
