import { Briefcase, ClipboardCheck, FileText, Handshake, UserCheck, Users } from "lucide-react";

import {
  applicationsTrend,
  candidateSources,
  hiringFunnel,
  recruiterPerformance,
  recruitmentKpis,
  timeToHireByDepartment,
} from "@/lib/hr";

import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import {
  ApplicationsTrendChart,
  CandidateSourcesChart,
  HiringFunnelChart,
  RecruitmentPerformanceChart,
  TimeToHireChart,
} from "./_components/recruitment-charts";

export default function Page() {
  const kpis = recruitmentKpis();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Recruitment"
        description="Track pipeline health from open requisitions through to signed offers."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Recruitment" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Open Positions" value={kpis.openPositions.toLocaleString()} icon={Briefcase} />
        <KpiCard label="Applications" value={kpis.applications.toLocaleString()} icon={FileText} />
        <KpiCard label="Active Candidates" value={kpis.activeCandidates.toLocaleString()} icon={Users} />
        <KpiCard label="In Interviews" value={kpis.interviews.toLocaleString()} icon={UserCheck} />
        <KpiCard label="Offers Extended" value={kpis.offers.toLocaleString()} icon={Handshake} />
        <KpiCard label="Hires (all time)" value={kpis.hires.toLocaleString()} icon={ClipboardCheck} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <HiringFunnelChart data={hiringFunnel()} />
        <ApplicationsTrendChart data={applicationsTrend()} />
        <TimeToHireChart data={timeToHireByDepartment()} />
        <CandidateSourcesChart data={candidateSources()} />
      </div>

      <RecruitmentPerformanceChart data={recruiterPerformance()} />
    </div>
  );
}
