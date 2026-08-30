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
import type { absenceDistribution, attendanceTrend, departmentAttendanceRates, lateArrivalsTrend } from "@/lib/hr";

const DONUT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "#94a3b8",
];

export function AttendanceTrendChart({ data }: { data: ReturnType<typeof attendanceTrend> }) {
  const config = { rate: { label: "Attendance rate", color: "var(--chart-1)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Attendance Trend</CardTitle>
        <CardDescription>Present or remote share by day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <AreaChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillAttendanceRate" x1="0" y1="0" x2="0" y2="1">
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
              tickFormatter={(v: string) => v.slice(5)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} domain={[60, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="rate"
              type="monotone"
              fill="url(#fillAttendanceRate)"
              stroke="var(--color-rate)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function DepartmentAttendanceChart({ data }: { data: ReturnType<typeof departmentAttendanceRates> }) {
  const config = { rate: { label: "Attendance rate", color: "var(--chart-2)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Department Attendance</CardTitle>
        <CardDescription>Attendance rate by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-72 w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="4 4" />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="department"
              tickLine={false}
              axisLine={false}
              width={140}
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

export function LateArrivalsChart({ data }: { data: ReturnType<typeof lateArrivalsTrend> }) {
  const config = { count: { label: "Late arrivals", color: "var(--chart-4)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Late Arrivals</CardTitle>
        <CardDescription>Late check-ins per day</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground text-sm">No late arrivals recorded.</p>
        ) : (
          <ChartContainer config={config} className="h-64 w-full">
            <LineChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="count" type="monotone" stroke="var(--color-count)" strokeWidth={2} dot />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function AbsenceDistributionChart({ data }: { data: ReturnType<typeof absenceDistribution> }) {
  const config = Object.fromEntries(
    data.map((row, index) => [
      row.department,
      { label: row.department, color: DONUT_COLORS[index % DONUT_COLORS.length] },
    ]),
  ) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Absence Distribution</CardTitle>
        <CardDescription>Where absences are concentrated</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground text-sm">No absences recorded.</p>
        ) : (
          <ChartContainer config={config} className="mx-auto h-64 w-full max-w-xs">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="department" />} />
              <Pie data={data} dataKey="count" nameKey="department" innerRadius={50} outerRadius={80} strokeWidth={2}>
                {data.map((entry, index) => (
                  <Cell key={entry.department} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
