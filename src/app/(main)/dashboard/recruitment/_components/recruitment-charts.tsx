"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type {
  applicationsTrend,
  candidateSources,
  hiringFunnel,
  recruiterPerformance,
  timeToHireByDepartment,
} from "@/lib/hr";
import { departmentById, employeeById } from "@/lib/hr";

const DONUT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "#94a3b8",
];

export function HiringFunnelChart({ data }: { data: ReturnType<typeof hiringFunnel> }) {
  const config = { count: { label: "Candidates", color: "var(--chart-1)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Hiring Funnel</CardTitle>
        <CardDescription>Candidates who have reached each stage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="4 4" />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="stage"
              tickLine={false}
              axisLine={false}
              width={80}
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

export function ApplicationsTrendChart({ data }: { data: ReturnType<typeof applicationsTrend> }) {
  const config = { applications: { label: "Applications", color: "var(--chart-2)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Applications Trend</CardTitle>
        <CardDescription>New applications per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <AreaChart data={data} margin={{ left: -20, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillApplications" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-applications)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-applications)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="applications"
              type="monotone"
              fill="url(#fillApplications)"
              stroke="var(--color-applications)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function TimeToHireChart({ data }: { data: ReturnType<typeof timeToHireByDepartment> }) {
  const chartData = data.map((row) => ({
    department: departmentById.get(row.departmentId)?.name ?? row.departmentId,
    days: row.days,
  }));
  const config = { days: { label: "Days to hire", color: "var(--chart-3)" } } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Time to Hire</CardTitle>
        <CardDescription>Average days from application to hire, by department</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground text-sm">No completed hires yet.</p>
        ) : (
          <ChartContainer config={config} className="h-64 w-full">
            <BarChart data={chartData} margin={{ left: -20, right: 12, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis
                dataKey="department"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="days" fill="var(--color-days)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function CandidateSourcesChart({ data }: { data: ReturnType<typeof candidateSources> }) {
  const config = Object.fromEntries(
    data.map((row, index) => [row.source, { label: row.source, color: DONUT_COLORS[index % DONUT_COLORS.length] }]),
  ) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Candidate Sources</CardTitle>
        <CardDescription>Where applicants are coming from</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto h-64 w-full max-w-xs">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="source" />} />
            <Pie data={data} dataKey="count" nameKey="source" innerRadius={50} outerRadius={80} strokeWidth={2}>
              {data.map((entry, index) => (
                <Cell key={entry.source} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {data.map((row, index) => (
            <div key={row.source} className="flex items-center gap-1.5 truncate">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}
              />
              <span className="truncate text-muted-foreground">{row.source}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecruitmentPerformanceChart({ data }: { data: ReturnType<typeof recruiterPerformance> }) {
  const chartData = data
    .map((row) => ({
      recruiter: employeeById.get(row.recruiterId)?.name ?? row.recruiterId,
      hires: row.hires,
      applications: row.applications,
    }))
    .sort((a, b) => b.hires - a.hires)
    .slice(0, 8);
  const config = {
    hires: { label: "Hires", color: "var(--chart-1)" },
    applications: { label: "Applications", color: "var(--chart-4)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recruitment Performance</CardTitle>
        <CardDescription>Applications handled and hires made per recruiter</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-72 w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24, top: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="4 4" />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="recruiter"
              tickLine={false}
              axisLine={false}
              width={120}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="applications" fill="var(--color-applications)" radius={4} />
            <Bar dataKey="hires" fill="var(--color-hires)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
