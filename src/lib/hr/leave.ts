import { LEAVE_REASONS, SEED } from "./constants";
import { activeEmployees, employees } from "./employees";
import { addDays, NOW, Rng, toISODate } from "./rng";
import type { LeaveBalance, LeaveRequest, LeaveStatus, LeaveType } from "./types";

const rng = new Rng(SEED + 5);

const LEAVE_TYPES: LeaveType[] = ["Annual", "Sick", "Personal", "Parental", "Unpaid"];

const ENTITLEMENTS: Record<LeaveType, number> = {
  Annual: 20,
  Sick: 10,
  Personal: 5,
  Parental: 90,
  Unpaid: 0,
};

function typeDurationRange(type: LeaveType): [number, number] {
  switch (type) {
    case "Annual":
      return [2, 10];
    case "Sick":
      return [1, 4];
    case "Personal":
      return [1, 3];
    case "Parental":
      return [30, 90];
    case "Unpaid":
      return [3, 20];
  }
}

const managersAndHeads = employees.filter((employee) => employee.level === "Manager" || employee.level === "Head");

export function generateLeaveRequests(): LeaveRequest[] {
  const requests: LeaveRequest[] = [];
  let idCounter = 4000;
  const targetCount = 132;

  for (let i = 0; i < targetCount; i++) {
    const employee = rng.pick(activeEmployees);
    const type = rng.pickWeighted<LeaveType>([
      ["Annual", 46],
      ["Sick", 30],
      ["Personal", 14],
      ["Parental", 4],
      ["Unpaid", 6],
    ]);
    const [minDays, maxDays] = typeDurationRange(type);
    const days = rng.int(minDays, maxDays);
    const appliedDate = rng.date(addDays(NOW, -150), addDays(NOW, 20));
    const startDate = addDays(appliedDate, rng.int(2, 14));
    const endDate = addDays(startDate, days - 1);

    const status = rng.pickWeighted<LeaveStatus>([
      ["Approved", 62],
      ["Pending", startDate > NOW ? 18 : 6],
      ["Rejected", 12],
      ["Cancelled", 8],
    ]);

    requests.push({
      id: `LV-${idCounter++}`,
      employeeId: employee.id,
      type,
      startDate: toISODate(startDate),
      endDate: toISODate(endDate),
      days,
      status,
      reason: rng.pick(LEAVE_REASONS[type]),
      appliedDate: toISODate(appliedDate),
      approverId: status === "Pending" ? null : rng.pick(managersAndHeads).id,
    });
  }

  return requests.sort((a, b) => (a.appliedDate < b.appliedDate ? 1 : -1));
}

export const leaveRequests: LeaveRequest[] = generateLeaveRequests();

export function generateLeaveBalances(): LeaveBalance[] {
  const balances: LeaveBalance[] = [];

  for (const employee of activeEmployees) {
    for (const type of LEAVE_TYPES) {
      if (type === "Unpaid") continue;
      const usedFromRequests = leaveRequests
        .filter(
          (request) => request.employeeId === employee.id && request.type === type && request.status === "Approved",
        )
        .reduce((sum, request) => sum + request.days, 0);
      const entitlement = ENTITLEMENTS[type];
      const used = Math.min(entitlement, usedFromRequests);
      balances.push({
        employeeId: employee.id,
        type,
        entitlement,
        used,
        remaining: Math.max(0, entitlement - used),
      });
    }
  }

  return balances;
}

export const leaveBalances: LeaveBalance[] = generateLeaveBalances();

export function getLeaveBalancesForEmployee(employeeId: string) {
  return leaveBalances.filter((balance) => balance.employeeId === employeeId);
}

export function isOnLeaveToday(employeeId: string) {
  const todayStr = toISODate(NOW);
  return leaveRequests.some(
    (request) =>
      request.employeeId === employeeId &&
      request.status === "Approved" &&
      request.startDate <= todayStr &&
      request.endDate >= todayStr,
  );
}

export const employeesOnLeaveToday = activeEmployees.filter((employee) => isOnLeaveToday(employee.id));
