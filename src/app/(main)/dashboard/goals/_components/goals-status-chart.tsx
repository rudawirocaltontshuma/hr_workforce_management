"use client";

import { Cell, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { GoalStatus } from "@/lib/hr";

const STATUS_COLORS: Record<GoalStatus, string> = {
  Completed: "var(--chart-1)",
  "In Progress": "var(--chart-2)",
  "At Risk": "var(--chart-4)",
  "Not Started": "#94a3b8",
};

export function GoalsStatusChart({ data }: { data: { status: GoalStatus; count: number }[] }) {
  const config = Object.fromEntries(
    data.map((row) => [row.status, { label: row.status, color: STATUS_COLORS[row.status] }]),
  ) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Goals by Status</CardTitle>
        <CardDescription>Where every tracked goal stands right now</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto h-56 w-full max-w-xs">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
            <Pie data={data} dataKey="count" nameKey="status" innerRadius={45} outerRadius={75} strokeWidth={2}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {data.map((row) => (
            <div key={row.status} className="flex items-center gap-1.5 truncate">
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: STATUS_COLORS[row.status] }} />
              <span className="truncate text-muted-foreground">
                {row.status} ({row.count})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
