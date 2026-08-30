import { GOAL_TEMPLATES, SEED } from "./constants";
import { activeEmployees } from "./employees";
import { addDays, NOW, Rng, toISODate } from "./rng";
import type { Goal, GoalPriority, GoalStatus } from "./types";

const rng = new Rng(SEED + 7);

const CATEGORIES = ["Strategic", "Operational", "Team Development", "Customer Impact", "Efficiency", "Growth"];

function deriveStatus(progress: number, dueDate: Date): GoalStatus {
  if (progress >= 100) return "Completed";
  if (progress === 0) return "Not Started";
  if (dueDate < NOW && progress < 70) return "At Risk";
  if (rng.bool(0.12) && progress < 60) return "At Risk";
  return "In Progress";
}

export function generateGoals(): Goal[] {
  const goals: Goal[] = [];
  let idCounter = 6000;

  const assignments: { employeeId: string }[] = activeEmployees.map((employee) => ({ employeeId: employee.id }));
  for (const employee of rng.pickMany(activeEmployees, Math.round(activeEmployees.length * 0.28))) {
    assignments.push({ employeeId: employee.id });
  }

  for (const assignment of assignments) {
    const employee = activeEmployees.find((e) => e.id === assignment.employeeId);
    if (!employee) continue;

    const templates = GOAL_TEMPLATES[employee.departmentId] ?? GOAL_TEMPLATES["dept-executive"];
    const title = rng.pick(templates);
    const dueDate = rng.date(addDays(NOW, -45), addDays(NOW, 150));
    const progress = rng.pickWeighted([
      [0, 8],
      [rng.int(5, 35), 20],
      [rng.int(36, 65), 26],
      [rng.int(66, 95), 28],
      [100, 18],
    ]);

    goals.push({
      id: `GOAL-${idCounter++}`,
      title,
      description: `${title}. Progress is tracked jointly with the manager during regular 1:1s and quarterly check-ins.`,
      employeeId: employee.id,
      departmentId: employee.departmentId,
      managerId: employee.managerId,
      category: rng.pick(CATEGORIES),
      dueDate: toISODate(dueDate),
      progress,
      priority: rng.pickWeighted<GoalPriority>([
        ["High", 30],
        ["Medium", 48],
        ["Low", 22],
      ]),
      status: deriveStatus(progress, dueDate),
    });
  }

  return goals;
}

export const goals: Goal[] = generateGoals();

export function goalsForEmployee(employeeId: string) {
  return goals.filter((goal) => goal.employeeId === employeeId);
}
