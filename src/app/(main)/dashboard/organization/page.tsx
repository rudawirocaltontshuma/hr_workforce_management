import { Network } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activeEmployees, departments, orgTree } from "@/lib/hr";

import { EmptyState } from "../_components/hr/empty-state";
import { PageHeader } from "../_components/hr/page-header";
import { OrgChart } from "./_components/org-chart";

export default function Page() {
  const executiveCount = activeEmployees.filter((e) => e.level === "Executive").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Organization"
        description="Reporting lines from executive leadership down through every department."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Organization" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-xs">Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl">{activeEmployees.length.toLocaleString()}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-xs">Departments</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl">{departments.length}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-xs">Executive Leadership</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl">{executiveCount}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Reporting Structure</CardTitle>
        </CardHeader>
        <CardContent>
          {orgTree ? (
            <>
              <OrgChart root={orgTree} maxDepth={2} />
              <p className="mt-4 text-center text-muted-foreground text-xs">
                Showing leadership through department heads. Open a department card, or visit Departments, to see full
                teams.
              </p>
            </>
          ) : (
            <EmptyState
              icon={Network}
              title="No org data"
              description="No reporting hierarchy could be built from the current dataset."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
