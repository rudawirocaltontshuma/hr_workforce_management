import { candidates } from "./candidates";
import { openPositions, positions } from "./positions";
import { formatMonthLabel, NOW } from "./rng";
import type { CandidateStage } from "./types";

export const STAGE_ORDER: CandidateStage[] = [
  "Applied",
  "Screening",
  "Interview",
  "Assessment",
  "Offer",
  "Hired",
  "Rejected",
];

export function recruitmentKpis() {
  const applications = candidates.length;
  const activeCandidates = candidates.filter((c) => c.status === "Active").length;
  const interviews = candidates.filter((c) => c.stage === "Interview" || c.stage === "Assessment").length;
  const offers = candidates.filter((c) => c.stage === "Offer" || c.status === "Hired").length;
  const hires = candidates.filter((c) => c.status === "Hired").length;
  const openPositionsCount = openPositions.reduce((sum, position) => sum + position.openings, 0);

  return { openPositions: openPositionsCount, applications, activeCandidates, interviews, offers, hires };
}

export function hiringFunnel() {
  const funnelStages: CandidateStage[] = ["Applied", "Screening", "Interview", "Assessment", "Offer", "Hired"];
  return funnelStages.map((stage) => ({
    stage,
    count: candidates.filter((c) => STAGE_ORDER.indexOf(c.stage) >= STAGE_ORDER.indexOf(stage) || c.status === "Hired")
      .length,
  }));
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function applicationsTrend() {
  const months: Date[] = [];
  const cursor = new Date(NOW.getFullYear(), NOW.getMonth(), 1);
  for (let i = 5; i >= 0; i--) months.push(new Date(cursor.getFullYear(), cursor.getMonth() - i, 1));

  return months.map((month) => {
    const key = monthKey(month);
    return {
      month: formatMonthLabel(month),
      applications: candidates.filter((c) => monthKey(new Date(c.appliedDate)) === key).length,
    };
  });
}

export function candidateSources() {
  const sources = [...new Set(candidates.map((c) => c.source))];
  return sources
    .map((source) => ({ source, count: candidates.filter((c) => c.source === source).length }))
    .sort((a, b) => b.count - a.count);
}

export function averageTimeToHire() {
  const hired = candidates.filter((c) => c.status === "Hired");
  if (hired.length === 0) return 0;
  const totalDays = hired.reduce((sum, candidate) => {
    const finalEvent = candidate.interviewTimeline[candidate.interviewTimeline.length - 1];
    if (!finalEvent) return sum;
    const days = Math.round(
      (new Date(finalEvent.date).getTime() - new Date(candidate.appliedDate).getTime()) / 86400000,
    );
    return sum + days;
  }, 0);
  return Math.round(totalDays / hired.length);
}

export function timeToHireByDepartment() {
  const departmentIds = [...new Set(candidates.filter((c) => c.status === "Hired").map((c) => c.departmentId))];
  return departmentIds.map((departmentId) => {
    const hired = candidates.filter((c) => c.status === "Hired" && c.departmentId === departmentId);
    const avgDays =
      hired.reduce((sum, candidate) => {
        const finalEvent = candidate.interviewTimeline[candidate.interviewTimeline.length - 1];
        if (!finalEvent) return sum;
        return (
          sum + Math.round((new Date(finalEvent.date).getTime() - new Date(candidate.appliedDate).getTime()) / 86400000)
        );
      }, 0) / Math.max(1, hired.length);
    return { departmentId, days: Math.round(avgDays) };
  });
}

export function recruiterPerformance() {
  const recruiterIds = [...new Set(candidates.map((c) => c.recruiterId))];
  return recruiterIds.map((recruiterId) => {
    const assigned = candidates.filter((c) => c.recruiterId === recruiterId);
    return {
      recruiterId,
      applications: assigned.length,
      hires: assigned.filter((c) => c.status === "Hired").length,
      offers: assigned.filter((c) => c.stage === "Offer" || c.status === "Hired").length,
    };
  });
}

export function positionsFillRate() {
  const closed = positions.filter((p) => p.status === "Closed").length;
  return positions.length > 0 ? Math.round((closed / positions.length) * 100) : 0;
}
