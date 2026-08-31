"use client";

import * as React from "react";

import {
  Banknote,
  Briefcase,
  CalendarClock,
  Clock,
  Download,
  type LucideIcon,
  TrendingDown,
  TrendingUp,
  UserSearch,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { demoActionToast } from "../../_components/hr/demo-toast";
import { formatDate } from "../../_components/hr/format";
import type { ReportDefinition, ReportId } from "./report-catalog";

// Icons live here (client-only) rather than on the report data itself: component references
// can't be sent from a Server Component to a Client Component as plain props.
const REPORT_ICONS: Record<ReportId, LucideIcon> = {
  headcount: Users,
  recruitment: UserSearch,
  attendance: Clock,
  leave: CalendarClock,
  performance: TrendingUp,
  training: Briefcase,
  compensation: Banknote,
  turnover: TrendingDown,
  benefits: Users,
};

export function ReportCenter({ reports }: { reports: ReportDefinition[] }) {
  const [selected, setSelected] = React.useState<ReportDefinition | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => {
          const Icon = REPORT_ICONS[report.id];
          return (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <Badge variant="outline" className="rounded-sm">
                    {report.category}
                  </Badge>
                </div>
                <CardTitle className="text-base">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-xs">
                Last generated {formatDate(report.lastGenerated)}
              </CardContent>
              <CardFooter className="justify-between">
                <Button size="sm" variant="outline" onClick={() => setSelected(report)}>
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    demoActionToast(`Downloading ${report.title}`, "This demo does not generate a real file.")
                  }
                >
                  <Download /> Download
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = REPORT_ICONS[selected.id];
                    return <Icon className="size-4" />;
                  })()} {selected.title}
                </DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                {selected.stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border p-3 text-center">
                    <div className="font-heading text-xl">{stat.value}</div>
                    <div className="text-muted-foreground text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-xs">
                Last generated {formatDate(selected.lastGenerated)}. This preview summarizes live demo data — the full
                report would include detailed tables and charts.
              </p>
              <DialogFooter className="gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() =>
                    demoActionToast(`Exporting ${selected.title} as CSV`, "This demo does not generate a real file.")
                  }
                >
                  Export CSV
                </Button>
                <Button
                  onClick={() =>
                    demoActionToast(`Downloading ${selected.title} as PDF`, "This demo does not generate a real file.")
                  }
                >
                  <Download /> Download PDF
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
