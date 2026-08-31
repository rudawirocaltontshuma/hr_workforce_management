import { departments } from "./departments";
import { activeEmployees } from "./employees";
import type { Employee, EmployeeLevel } from "./types";

const LEVEL_ORDER: EmployeeLevel[] = ["Junior", "Mid", "Senior", "Manager", "Head", "Executive"];

export interface SalaryBand {
  departmentId: string;
  departmentName: string;
  level: EmployeeLevel;
  min: number;
  max: number;
  median: number;
  headcount: number;
}

export function computeSalaryBands(): SalaryBand[] {
  const bands: SalaryBand[] = [];

  for (const department of departments) {
    for (const level of LEVEL_ORDER) {
      const members = activeEmployees.filter((e) => e.departmentId === department.id && e.level === level);
      if (members.length === 0) continue;
      const salaries = members.map((m) => m.salary).sort((a, b) => a - b);
      bands.push({
        departmentId: department.id,
        departmentName: department.name,
        level,
        min: salaries[0],
        max: salaries[salaries.length - 1],
        median: salaries[Math.floor(salaries.length / 2)],
        headcount: members.length,
      });
    }
  }

  return bands;
}

export const salaryBands = computeSalaryBands();

export function departmentCompensationSummary() {
  return departments.map((department) => {
    const members = activeEmployees.filter((e) => e.departmentId === department.id);
    const totalComp = members.reduce((sum, e) => sum + e.salary, 0);
    const avgComp = members.length > 0 ? Math.round(totalComp / members.length) : 0;
    const avgPerformance =
      members.length > 0 ? Math.round(members.reduce((sum, e) => sum + e.performanceScore, 0) / members.length) : 0;

    return {
      departmentId: department.id,
      departmentName: department.name,
      headcount: members.length,
      totalComp,
      avgComp,
      avgPerformance,
    };
  });
}

export function compensationDistribution() {
  const buckets = [
    { label: "< $70k", min: 0, max: 70000 },
    { label: "$70k-100k", min: 70000, max: 100000 },
    { label: "$100k-140k", min: 100000, max: 140000 },
    { label: "$140k-180k", min: 140000, max: 180000 },
    { label: "$180k-250k", min: 180000, max: 250000 },
    { label: "$250k+", min: 250000, max: Number.POSITIVE_INFINITY },
  ];

  return buckets.map((bucket) => ({
    label: bucket.label,
    count: activeEmployees.filter((e) => e.salary >= bucket.min && e.salary < bucket.max).length,
  }));
}

export function totalPayroll(employees: Employee[] = activeEmployees) {
  return employees.reduce((sum, employee) => sum + employee.salary, 0);
}
