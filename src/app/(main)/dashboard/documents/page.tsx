import { FileCheck, FileClock, FileText, Lock } from "lucide-react";

import { documents } from "@/lib/hr";

import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import { DocumentsBrowser } from "./_components/documents-browser";

export default function Page() {
  const active = documents.filter((doc) => doc.status === "Active").length;
  const pending = documents.filter((doc) => doc.status === "Pending Signature").length;
  const confidential = documents.filter((doc) => doc.confidential).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Documents"
        description="Every contract, policy, certificate and company document in one place."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Documents" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Documents" value={documents.length.toLocaleString()} icon={FileText} />
        <KpiCard label="Active" value={active.toLocaleString()} icon={FileCheck} />
        <KpiCard label="Pending Signature" value={pending.toLocaleString()} icon={FileClock} />
        <KpiCard label="Confidential" value={confidential.toLocaleString()} icon={Lock} />
      </div>

      <DocumentsBrowser documents={documents} />
    </div>
  );
}
