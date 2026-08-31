import { departmentById } from "./departments";
import { employees } from "./employees";
import { addDays, NOW } from "./rng";
import { courseStats, courses } from "./training";

export function turnoverByDepartment() {
  const cutoff = addDays(NOW, -365);
  const departedByDept = new Map<string, number>();
  const activeByDept = new Map<string, number>();

  for (const employee of employees) {
    const isDeparted = Boolean(employee.endDate && new Date(employee.endDate) >= cutoff);
    if (isDeparted) {
      departedByDept.set(employee.departmentId, (departedByDept.get(employee.departmentId) ?? 0) + 1);
    }
    if (employee.status !== "Terminated") {
      activeByDept.set(employee.departmentId, (activeByDept.get(employee.departmentId) ?? 0) + 1);
    }
  }

  return [...activeByDept.entries()]
    .map(([departmentId, active]) => {
      const departed = departedByDept.get(departmentId) ?? 0;
      const base = active + departed || 1;
      return {
        department: departmentById.get(departmentId)?.name ?? departmentId,
        rate: Math.round((departed / base) * 1000) / 10,
      };
    })
    .sort((a, b) => b.rate - a.rate);
}

export function courseCompletionRates() {
  return courses
    .map((course) => ({ course: course.title, ...courseStats(course.id) }))
    .filter((row) => row.enrolled > 0)
    .sort((a, b) => b.completionRate - a.completionRate);
}

export function averageTenureYears() {
  const active = employees.filter((employee) => employee.status !== "Terminated");
  if (active.length === 0) return 0;
  const totalYears = active.reduce(
    (sum, employee) => sum + (NOW.getTime() - new Date(employee.startDate).getTime()) / (365.25 * 86400000),
    0,
  );
  return Math.round((totalYears / active.length) * 10) / 10;
}
