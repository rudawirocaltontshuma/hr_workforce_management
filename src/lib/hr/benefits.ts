import { BENEFIT_PLAN_DEFINITIONS } from "./constants";
import { activeEmployees } from "./employees";
import type { BenefitPlan } from "./types";

const fullTimeCount = activeEmployees.filter((employee) => employee.employmentType === "Full-time").length;

export const benefitPlans: BenefitPlan[] = BENEFIT_PLAN_DEFINITIONS.map((plan, index) => ({
  id: `BEN-${1000 + index}`,
  ...plan,
  enrolledCount: Math.round(fullTimeCount * plan.participationRate),
}));

export const benefitPlanById = new Map(benefitPlans.map((plan) => [plan.id, plan]));

export function benefitsByCategory() {
  const categories = [...new Set(benefitPlans.map((plan) => plan.category))];
  return categories.map((category) => ({
    category,
    plans: benefitPlans.filter((plan) => plan.category === category),
  }));
}

export function isEmployeeEnrolled(employeeId: string, planId: string) {
  const plan = benefitPlanById.get(planId);
  if (!plan) return false;
  const seed = `${employeeId}-${planId}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash % 100 < plan.participationRate * 100;
}

export function benefitsForEmployee(employeeId: string) {
  return benefitPlans.filter((plan) => isEmployeeEnrolled(employeeId, plan.id));
}
