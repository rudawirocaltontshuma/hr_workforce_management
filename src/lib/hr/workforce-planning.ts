import { totalPayroll } from "./compensation";
import { SEED } from "./constants";
import { departmentHeadcount, departments } from "./departments";
import { activeEmployees } from "./employees";
import { openPositions } from "./positions";
import { Rng } from "./rng";

const rng = new Rng(SEED + 12);

export interface DepartmentForecast {
  departmentId: string;
  departmentName: string;
  currentHeadcount: number;
  plannedHeadcount: number;
  openRoles: number;
  growthRate: number;
}

export function departmentForecasts(): DepartmentForecast[] {
  return departments.map((department) => {
    const current = departmentHeadcount(department.id);
    const openRoles = openPositions.filter((p) => p.departmentId === department.id).reduce((s, p) => s + p.openings, 0);
    const growthRate = department.id === "dept-executive" ? 0 : Math.round(rng.float(-2, 18) * 10) / 10;
    const planned = Math.max(current, Math.round(current * (1 + growthRate / 100)) + openRoles);

    return {
      departmentId: department.id,
      departmentName: department.name,
      currentHeadcount: current,
      plannedHeadcount: planned,
      openRoles,
      growthRate,
    };
  });
}

export const forecasts = departmentForecasts();

export const currentHeadcount = activeEmployees.length;
export const plannedHeadcount = forecasts.reduce((sum, f) => sum + f.plannedHeadcount, 0);

export function hiringForecastByQuarter() {
  const totalPlannedHires = Math.max(0, plannedHeadcount - currentHeadcount);
  const distribution = [0.32, 0.28, 0.22, 0.18];
  let allocated = 0;
  const quarters = ["Q1 FY27", "Q2 FY27", "Q3 FY27", "Q4 FY27"].map((label, index) => {
    const count = index === 3 ? totalPlannedHires - allocated : Math.round(totalPlannedHires * distribution[index]);
    allocated += count;
    return { quarter: label, hires: Math.max(0, count) };
  });
  return quarters;
}

export function workforceCostForecast() {
  const currentCost = totalPayroll();
  const points: { label: string; cost: number }[] = [{ label: "Current", cost: currentCost }];
  let running = currentCost;
  for (let i = 1; i <= 4; i++) {
    running = Math.round(running * (1 + rng.float(0.02, 0.06)));
    points.push({ label: `Q${i} FY27`, cost: running });
  }
  return points;
}
