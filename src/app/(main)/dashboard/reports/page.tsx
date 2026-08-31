import { PageHeader } from "../_components/hr/page-header";
import { buildReportCatalog } from "./_components/report-catalog";
import { ReportCenter } from "./_components/report-center";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports"
        description="Generate and preview standard HR reports across every function."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Reports" }]}
      />
      <ReportCenter reports={buildReportCatalog()} />
    </div>
  );
}
