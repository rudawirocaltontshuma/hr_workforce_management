import { HeartHandshake, Percent, ShieldCheck, Users } from "lucide-react";

import { benefitPlans, benefitsByCategory } from "@/lib/hr";

import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import { BenefitsGrid } from "./_components/benefits-grid";

export default function Page() {
  const activePlans = benefitPlans.filter((plan) => plan.status === "Active");
  const avgParticipation =
    activePlans.length > 0
      ? Math.round((activePlans.reduce((sum, plan) => sum + plan.participationRate, 0) / activePlans.length) * 100)
      : 0;
  const totalEnrollments = benefitPlans.reduce((sum, plan) => sum + plan.enrolledCount, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Benefits"
        description="Health, retirement, insurance, allowances and wellness programs offered company-wide."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Benefits" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Benefit Plans" value={benefitPlans.length.toLocaleString()} icon={HeartHandshake} />
        <KpiCard label="Active Plans" value={activePlans.length.toLocaleString()} icon={ShieldCheck} />
        <KpiCard label="Avg. Participation" value={`${avgParticipation}%`} icon={Percent} />
        <KpiCard label="Total Enrollments" value={totalEnrollments.toLocaleString()} icon={Users} />
      </div>

      <BenefitsGrid groups={benefitsByCategory()} />
    </div>
  );
}
