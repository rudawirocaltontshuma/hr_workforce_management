import {
  APPLICATION_SOURCES,
  COMPANIES,
  DEGREES,
  FIRST_NAMES,
  LAST_NAMES,
  LOCATIONS,
  SEED,
  SKILLS_POOL,
  UNIVERSITIES,
} from "./constants";
import { departmentById } from "./departments";
import { employees } from "./employees";
import { positions } from "./positions";
import { addDays, NOW, Rng, toISODate } from "./rng";
import type { Candidate, CandidateStage, CandidateStatus, InterviewEvent } from "./types";

const rng = new Rng(SEED + 4);

const STAGE_ORDER: CandidateStage[] = ["Applied", "Screening", "Interview", "Assessment", "Offer", "Hired"];

const recruiters = employees.filter((employee) => employee.departmentId === "dept-talent");

function makeStageAndStatus(): { stage: CandidateStage; status: CandidateStatus; reachedIndex: number } {
  const outcome = rng.pickWeighted<"active" | "hired" | "rejected" | "withdrawn">([
    ["active", 46],
    ["hired", 12],
    ["rejected", 34],
    ["withdrawn", 8],
  ]);

  if (outcome === "hired") {
    return { stage: "Hired", status: "Hired", reachedIndex: STAGE_ORDER.length - 1 };
  }

  const reachedIndex = rng.pickWeighted([
    [0, 30],
    [1, 28],
    [2, 22],
    [3, 12],
    [4, 8],
  ]);

  if (outcome === "rejected") {
    return { stage: "Rejected", status: "Rejected", reachedIndex };
  }
  if (outcome === "withdrawn") {
    return { stage: STAGE_ORDER[reachedIndex], status: "Withdrawn", reachedIndex };
  }
  return { stage: STAGE_ORDER[reachedIndex], status: "Active", reachedIndex };
}

function buildTimeline(
  appliedDate: Date,
  reachedIndex: number,
  finalStage: CandidateStage,
  departmentName: string,
): InterviewEvent[] {
  const timeline: InterviewEvent[] = [];
  let cursor = appliedDate;

  for (let i = 0; i <= reachedIndex; i++) {
    cursor = addDays(cursor, rng.int(2, 9));
    const stageName = STAGE_ORDER[i];
    const isLast = i === reachedIndex;
    let outcome: InterviewEvent["outcome"] = "Passed";
    if (isLast && finalStage === "Rejected") {
      outcome = "Failed";
    } else if (isLast && (finalStage === "Applied" || cursor > NOW)) {
      outcome = "Scheduled";
    }

    timeline.push({
      stage: stageName === "Applied" ? "Application Review" : stageName,
      date: toISODate(cursor > NOW ? NOW : cursor),
      interviewer: rng.pick(employees.filter((e) => e.level === "Manager" || e.level === "Head")).name,
      outcome,
      notes: interviewNote(stageName, outcome, departmentName),
    });
  }

  return timeline;
}

function interviewNote(stage: CandidateStage, outcome: InterviewEvent["outcome"], departmentName: string) {
  if (outcome === "Failed")
    return `Did not meet the bar for the ${departmentName} team at the ${stage.toLowerCase()} stage.`;
  if (outcome === "Scheduled") return `Upcoming ${stage.toLowerCase()} scheduled with the ${departmentName} team.`;
  if (stage === "Applied") return "Application reviewed and moved forward by the recruiting team.";
  if (stage === "Screening") return "Completed an initial phone screen with the recruiting team.";
  if (stage === "Interview") return `Completed panel interviews with the ${departmentName} team.`;
  if (stage === "Assessment") return "Submitted a take-home assessment, reviewed favorably by the hiring panel.";
  if (stage === "Offer") return "Offer extended and under review by the candidate.";
  return "Offer accepted; onboarding kicked off with People Operations.";
}

export function generateCandidates(): Candidate[] {
  const candidates: Candidate[] = [];
  let idCounter = 3000;
  const usedNames = new Set<string>();

  const eligiblePositions = positions.filter((position) => position.status !== "Closed" || rng.bool(0.4));
  const pool = eligiblePositions.length > 0 ? eligiblePositions : positions;
  const targetCount = 118;

  for (let i = 0; i < targetCount; i++) {
    const position = rng.pick(pool);
    let first = rng.pick(FIRST_NAMES);
    let last = rng.pick(LAST_NAMES);
    for (let attempt = 0; attempt < 10 && usedNames.has(`${first} ${last}`); attempt++) {
      first = rng.pick(FIRST_NAMES);
      last = rng.pick(LAST_NAMES);
    }
    usedNames.add(`${first} ${last}`);
    const name = `${first} ${last}`;

    const appliedDate = rng.date(addDays(NOW, -120), addDays(NOW, -1));
    const { stage, status, reachedIndex } = makeStageAndStatus();
    const departmentName = departmentById.get(position.departmentId)?.name ?? "hiring";
    const experienceYears = rng.int(0, 14);
    const score = Math.max(
      35,
      Math.min(99, Math.round(rng.float(40, 96) + reachedIndex * 2 - (status === "Rejected" ? 8 : 0))),
    );

    candidates.push({
      id: `CAND-${idCounter++}`,
      name,
      initials: `${first[0]}${last[0]}`.toUpperCase(),
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, "")}@personalmail.com`,
      phone: `+1 (${rng.int(200, 989)}) ${rng.int(200, 999)}-${rng.int(1000, 9999)}`,
      positionId: position.id,
      departmentId: position.departmentId,
      recruiterId: recruiters.length > 0 ? rng.pick(recruiters).id : employees[0].id,
      stage,
      status,
      score,
      appliedDate: toISODate(appliedDate),
      source: rng.pick(APPLICATION_SOURCES),
      experienceYears,
      currentTitle: position.title.replace(/^Senior |^Staff |^Associate |^Junior /, ""),
      currentCompany: rng.pick(COMPANIES),
      location: rng.pick(LOCATIONS),
      education: `${rng.pick(DEGREES)}, ${rng.pick(UNIVERSITIES)}`,
      skills: rng.pickMany(SKILLS_POOL, rng.int(3, 6)),
      resumeSummary: `${experienceYears} years of experience in roles similar to ${position.title}, most recently at ${rng.pick(COMPANIES)}. Known for reliable delivery and strong collaboration with cross-functional partners.`,
      expectedSalary: Math.round(rng.int(position.salaryMin, position.salaryMax + 15000) / 1000) * 1000,
      interviewTimeline: buildTimeline(appliedDate, reachedIndex, stage, departmentName),
    });
  }

  return candidates;
}

export const candidates: Candidate[] = generateCandidates();

export const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));

export function getCandidate(id: string) {
  return candidateById.get(id);
}
