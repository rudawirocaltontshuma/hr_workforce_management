import { ClipboardCheck, UserPlus, Users } from "lucide-react";

import { onboardingProgress, onboardingRecords } from "@/lib/hr";

import { EmptyState } from "../_components/hr/empty-state";
import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import { OnboardingBoard } from "./_components/onboarding-board";

export default function Page() {
  const totalNewHires = onboardingRecords.length;
  const avgProgress =
    totalNewHires > 0
      ? Math.round(onboardingRecords.reduce((sum, record) => sum + onboardingProgress(record), 0) / totalNewHires)
      : 0;
  const completedCount = onboardingRecords.filter((record) => onboardingProgress(record) === 100).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Onboarding"
        description="Track every new hire's onboarding checklist from day one to fully ramped."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Onboarding" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="New Hires (45 days)" value={totalNewHires.toLocaleString()} icon={UserPlus} />
        <KpiCard label="Avg. Onboarding Progress" value={`${avgProgress}%`} icon={ClipboardCheck} />
        <KpiCard label="Fully Onboarded" value={completedCount.toLocaleString()} icon={Users} />
      </div>

      {totalNewHires === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No new hires"
          description="No employees have started within the last 45 days."
        />
      ) : (
        <OnboardingBoard records={onboardingRecords} />
      )}
    </div>
  );
}
