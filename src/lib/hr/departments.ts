import { DEPARTMENT_DEFINITIONS, SEED } from "./constants";
import { activeEmployees, employeeById, employees } from "./employees";
import { Rng } from "./rng";
import type { Department } from "./types";

const rng = new Rng(SEED + 2);

function findDepartmentHead(departmentId: string) {
  return employees.find(
    (employee) =>
      employee.departmentId === departmentId && (employee.level === "Head" || employee.level === "Executive"),
  );
}

export const departments: Department[] = DEPARTMENT_DEFINITIONS.map((def) => {
  const head =
    def.id === "dept-executive"
      ? employees.find((e) => e.jobTitle === "Chief Executive Officer")
      : findDepartmentHead(def.id);

  return {
    id: def.id,
    name: def.name,
    code: def.code,
    description: def.description,
    managerId: head?.id ?? null,
    budget: def.budget,
    location: rng.pick(["San Francisco, CA", "New York, NY", "Austin, TX", "Multiple locations"]),
    status: rng.pickWeighted<Department["status"]>([
      ["Active", 90],
      ["Hiring Freeze", 6],
      ["Restructuring", 4],
    ]),
    foundedYear: rng.int(2013, 2021),
  };
});

export const departmentById = new Map(departments.map((department) => [department.id, department]));

export function getDepartment(id: string) {
  return departmentById.get(id);
}

export function departmentHeadcount(departmentId: string) {
  return activeEmployees.filter((employee) => employee.departmentId === departmentId).length;
}

export function departmentEmployees(departmentId: string) {
  return employees.filter((employee) => employee.departmentId === departmentId);
}

export function departmentAveragePerformance(departmentId: string) {
  const members = activeEmployees.filter((employee) => employee.departmentId === departmentId);
  if (members.length === 0) return 0;
  return Math.round(members.reduce((sum, employee) => sum + employee.performanceScore, 0) / members.length);
}

export function departmentManagerName(departmentId: string) {
  const department = getDepartment(departmentId);
  if (!department?.managerId) return "Unassigned";
  return employeeById.get(department.managerId)?.name ?? "Unassigned";
}
