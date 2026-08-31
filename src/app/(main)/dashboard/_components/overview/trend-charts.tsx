"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type {
  attendanceTrend,
  departmentDistribution,
  headcountTrend,
  hiringTrend,
  performanceDistribution,
  trainingCompletionTrend,
  turnoverTrend,
} from "@/lib/hr";

const DONUT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "#94a3b8",
];

export function HeadcountChart({ data }: { data: ReturnType<typeof headcountTrend> }) {
  const config = { headcount: { label: "Headcount", color: "var(--chart-1)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Headcount Trend</CardTitle>
        <CardDescription>Active employees over the last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <AreaChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillHeadcount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-headcount)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-headcount)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="headcount"
              type="monotone"
              fill="url(#fillHeadcount)"
              stroke="var(--color-headcount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function HiringChart({ data }: { data: ReturnType<typeof hiringTrend> }) {
  const config = { hires: { label: "New hires", color: "var(--chart-2)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Hiring Trend</CardTitle>
        <CardDescription>New hires per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="hires" fill="var(--color-hires)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function TurnoverChart({ data }: { data: ReturnType<typeof turnoverTrend> }) {
  const config = { departures: { label: "Departures", color: "var(--chart-5)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Employee Turnover</CardTitle>
        <CardDescription>Departures per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <LineChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="departures" type="monotone" stroke="var(--color-departures)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function DepartmentDistributionChart({ data }: { data: ReturnType<typeof departmentDistribution> }) {
  const sorted = [...data].sort((a, b) => b.headcount - a.headcount);
  const top = sorted.slice(0, 6);
  const rest = sorted.slice(6);
  const restTotal = rest.reduce((sum, item) => sum + item.headcount, 0);
  const chartData = restTotal > 0 ? [...top, { department: "Other", headcount: restTotal }] : top;

  const config = Object.fromEntries(
    chartData.map((item, index) => [
      item.department,
      { label: item.department, color: DONUT_COLORS[index % DONUT_COLORS.length] },
    ]),
  ) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Department Distribution</CardTitle>
        <CardDescription>Active headcount by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto h-64 w-full max-w-xs">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="department" />} />
            <Pie
              data={chartData}
              dataKey="headcount"
              nameKey="department"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.department} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-3">
          {chartData.map((item, index) => (
            <div key={item.department} className="flex items-center gap-1.5 truncate">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}
              />
              <span className="truncate text-muted-foreground">{item.department}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AttendanceTrendChart({ data }: { data: ReturnType<typeof attendanceTrend> }) {
  const config = { rate: { label: "Attendance rate", color: "var(--chart-3)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Attendance Trend</CardTitle>
        <CardDescription>Present or remote share, last 20 working days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <AreaChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillAttendance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(5)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} domain={[70, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="rate"
              type="monotone"
              fill="url(#fillAttendance)"
              stroke="var(--color-rate)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function PerformanceDistributionChart({ data }: { data: ReturnType<typeof performanceDistribution> }) {
  const config = { count: { label: "Employees", color: "var(--chart-4)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Performance Distribution</CardTitle>
        <CardDescription>Active employees by performance band</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 20, top: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="4 4" />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={140}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function TrainingCompletionChart({ data }: { data: ReturnType<typeof trainingCompletionTrend> }) {
  const config = { completionRate: { label: "Completion rate", color: "var(--chart-2)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Training Completion</CardTitle>
        <CardDescription>Course completion rate, last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <LineChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="completionRate" type="monotone" stroke="var(--color-completionRate)" strokeWidth={2} dot />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
