import { SEED } from "./constants";
import { activeEmployees } from "./employees";
import { addDays, NOW, Rng, toISODate } from "./rng";
import type { PerformanceReview, ReviewStatus } from "./types";

const rng = new Rng(SEED + 10);

const STRENGTHS_POOL = [
  "Clear, proactive communication",
  "Strong ownership of outcomes",
  "Reliable execution under pressure",
  "Effective cross-team collaboration",
  "Sound technical/functional judgment",
  "Mentors teammates well",
  "Brings a customer-first mindset",
  "Comfortable with ambiguity",
];

const GROWTH_POOL = [
  "Delegate more to scale impact",
  "Sharpen prioritization under competing deadlines",
  "Build stronger cross-functional relationships",
  "Develop deeper domain expertise",
  "Improve written documentation habits",
  "Grow influence with senior stakeholders",
];

function periodsCovered(): string[] {
  return ["2025 H2", "2026 H1"];
}

function reviewSummary(status: ReviewStatus, employeeName: string, goalsCompleted: number, goalsTotal: number) {
  if (status === "Completed") {
    return `${employeeName} delivered solid results against ${goalsCompleted}/${goalsTotal} key goals this period, with consistently strong feedback from stakeholders.`;
  }
  if (status === "In Progress") {
    return "Self-assessment submitted; manager review in progress.";
  }
  return "Review cycle has not started yet.";
}

function ratingFromScore(score: number) {
  if (score >= 90) return 5;
  if (score >= 78) return 4;
  if (score >= 62) return 3;
  if (score >= 45) return 2;
  return 1;
}

export function generatePerformanceReviews(): PerformanceReview[] {
  const reviews: PerformanceReview[] = [];
  let idCounter = 9000;

  for (const employee of activeEmployees) {
    const tenureDays = Math.round((NOW.getTime() - new Date(employee.startDate).getTime()) / 86400000);
    if (tenureDays < 60) continue;

    for (const period of periodsCovered()) {
      const isCurrentPeriod = period === "2026 H1";
      const status: ReviewStatus = isCurrentPeriod
        ? rng.pickWeighted<ReviewStatus>([
            ["Completed", 64],
            ["In Progress", 24],
            ["Not Started", 12],
          ])
        : "Completed";

      const score = Math.max(30, Math.min(99, Math.round(employee.performanceScore + rng.float(-10, 10))));
      const goalsTotal = rng.int(2, 5);
      const goalsCompleted =
        status === "Not Started" ? 0 : Math.min(goalsTotal, rng.int(Math.floor(goalsTotal * 0.4), goalsTotal));

      reviews.push({
        id: `REV-${idCounter++}`,
        employeeId: employee.id,
        departmentId: employee.departmentId,
        managerId: employee.managerId,
        period,
        reviewDate: toISODate(
          status === "Not Started"
            ? addDays(NOW, rng.int(5, 30))
            : rng.date(
                isCurrentPeriod ? addDays(NOW, -60) : new Date("2025-12-01"),
                isCurrentPeriod ? NOW : new Date("2026-01-15"),
              ),
        ),
        status,
        rating: status === "Not Started" ? 0 : ratingFromScore(score),
        score: status === "Not Started" ? 0 : score,
        goalsCompleted,
        goalsTotal,
        strengths: status === "Completed" ? rng.pickMany(STRENGTHS_POOL, 3) : [],
        growthAreas: status === "Completed" ? rng.pickMany(GROWTH_POOL, 2) : [],
        summary: reviewSummary(status, employee.name, goalsCompleted, goalsTotal),
      });
    }
  }

  return reviews;
}

export const performanceReviews: PerformanceReview[] = generatePerformanceReviews();

export function reviewsForEmployee(employeeId: string) {
  return performanceReviews.filter((review) => review.employeeId === employeeId);
}

export function latestReviewForEmployee(employeeId: string) {
  const reviews = reviewsForEmployee(employeeId).filter((r) => r.status === "Completed");
  return reviews.sort((a, b) => (a.reviewDate < b.reviewDate ? 1 : -1))[0];
}

export const CURRENT_REVIEW_PERIOD = "2026 H1";

export function performanceKpis() {
  const current = performanceReviews.filter((review) => review.period === CURRENT_REVIEW_PERIOD);
  const completed = current.filter((review) => review.status === "Completed");
  const reviewCompletion = current.length > 0 ? Math.round((completed.length / current.length) * 100) : 0;
  const averagePerformance =
    completed.length > 0 ? Math.round(completed.reduce((sum, r) => sum + r.score, 0) / completed.length) : 0;
  const goalsCompleted = completed.reduce((sum, r) => sum + r.goalsCompleted, 0);
  const employeesReviewed = completed.length;

  return { reviewCompletion, averagePerformance, goalsCompleted, employeesReviewed, totalCycle: current.length };
}

export function reviewCompletionTrend() {
  return ["2025 H2", "2026 H1"].map((period) => {
    const reviews = performanceReviews.filter((r) => r.period === period);
    const completed = reviews.filter((r) => r.status === "Completed").length;
    return { period, completionRate: reviews.length > 0 ? Math.round((completed / reviews.length) * 100) : 0 };
  });
}

export function departmentPerformanceScores() {
  const departmentIds = [...new Set(performanceReviews.map((review) => review.departmentId))];
  return departmentIds.map((departmentId) => {
    const completed = performanceReviews.filter(
      (r) => r.departmentId === departmentId && r.status === "Completed" && r.period === CURRENT_REVIEW_PERIOD,
    );
    const avg =
      completed.length > 0 ? Math.round(completed.reduce((sum, r) => sum + r.score, 0) / completed.length) : 0;
    return { departmentId, score: avg };
  });
}
