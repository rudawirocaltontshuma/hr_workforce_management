import { SEED } from "./constants";
import { activeEmployees } from "./employees";
import { NOW, Rng } from "./rng";

const rng = new Rng(SEED + 13);

export type OnboardingCategory =
  | "Employment Documents"
  | "Company Policies"
  | "Equipment"
  | "Orientation"
  | "Training"
  | "Team Introduction"
  | "Access Setup"
  | "Benefits";

export interface OnboardingTask {
  id: string;
  category: OnboardingCategory;
  label: string;
  completed: boolean;
}

export interface OnboardingRecord {
  employeeId: string;
  startDate: string;
  buddyId: string | null;
  tasks: OnboardingTask[];
}

const TASK_TEMPLATES: { category: OnboardingCategory; label: string; order: number }[] = [
  { category: "Employment Documents", label: "Sign offer letter", order: 1 },
  { category: "Employment Documents", label: "Complete tax and I-9 paperwork", order: 1 },
  { category: "Access Setup", label: "Create email and SSO accounts", order: 2 },
  { category: "Equipment", label: "Provision laptop and peripherals", order: 2 },
  { category: "Equipment", label: "Assign desk and building badge", order: 3 },
  { category: "Company Policies", label: "Acknowledge employee handbook", order: 3 },
  { category: "Orientation", label: "Attend new hire orientation session", order: 4 },
  { category: "Team Introduction", label: "Meet the immediate team", order: 4 },
  { category: "Team Introduction", label: "Schedule recurring 1:1 with manager", order: 5 },
  { category: "Access Setup", label: "Grant department system access", order: 5 },
  { category: "Training", label: "Complete onboarding e-learning path", order: 6 },
  { category: "Benefits", label: "Enroll in benefits plans", order: 6 },
];

function isNewHire(startDate: string) {
  const days = Math.round((NOW.getTime() - new Date(startDate).getTime()) / 86400000);
  return days >= 0 && days <= 45;
}

export function generateOnboardingRecords(): OnboardingRecord[] {
  const newHires = activeEmployees.filter((employee) => isNewHire(employee.startDate));
  const potentialBuddies = activeEmployees.filter(
    (employee) => employee.level === "Mid" || employee.level === "Senior",
  );

  return newHires.map((employee) => {
    const tenureDays = Math.round((NOW.getTime() - new Date(employee.startDate).getTime()) / 86400000);
    const progressWindow = Math.min(6, Math.max(1, Math.round(tenureDays / 6) + 1));

    const tasks: OnboardingTask[] = TASK_TEMPLATES.map((template, index) => ({
      id: `${employee.id}-task-${index}`,
      category: template.category,
      label: template.label,
      completed: template.order <= progressWindow,
    }));

    return {
      employeeId: employee.id,
      startDate: employee.startDate,
      buddyId: potentialBuddies.length > 0 ? rng.pick(potentialBuddies).id : null,
      tasks,
    };
  });
}

export const onboardingRecords: OnboardingRecord[] = generateOnboardingRecords();

export function onboardingProgress(record: OnboardingRecord) {
  const completed = record.tasks.filter((task) => task.completed).length;
  return Math.round((completed / record.tasks.length) * 100);
}

export function getOnboardingRecord(employeeId: string) {
  return onboardingRecords.find((record) => record.employeeId === employeeId);
}
