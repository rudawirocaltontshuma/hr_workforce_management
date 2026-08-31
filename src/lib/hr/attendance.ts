import { SEED } from "./constants";
import { departmentById } from "./departments";
import { activeEmployees, employeeById } from "./employees";
import { leaveRequests } from "./leave";
import { addDays, isWeekend, NOW, Rng, toISODate } from "./rng";
import type { AttendanceRecord, AttendanceStatus } from "./types";

const rng = new Rng(SEED + 6);

function isApprovedLeaveOn(employeeId: string, dateStr: string) {
  return leaveRequests.some(
    (request) =>
      request.employeeId === employeeId &&
      request.status === "Approved" &&
      request.startDate <= dateStr &&
      request.endDate >= dateStr,
  );
}

function workdaysBack(count: number): Date[] {
  const days: Date[] = [];
  let cursor = new Date(NOW);
  while (days.length < count) {
    if (!isWeekend(cursor)) days.push(new Date(cursor));
    cursor = addDays(cursor, -1);
  }
  return days.reverse();
}

export function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  let idCounter = 5000;
  const days = workdaysBack(20);
  const sampleSize = 15;

  for (const day of days) {
    const dateStr = toISODate(day);
    const sample = rng.pickMany(activeEmployees, sampleSize);

    for (const employee of sample) {
      const onLeave = isApprovedLeaveOn(employee.id, dateStr);
      const status: AttendanceStatus = onLeave
        ? "On Leave"
        : rng.pickWeighted<AttendanceStatus>([
            ["Present", 74],
            ["Remote", 14],
            ["Late", 7],
            ["Absent", 5],
          ]);

      const checkInHour = status === "Late" ? rng.int(9, 10) : rng.int(7, 9);
      const checkInMinute = rng.int(0, 59);
      const checkOutHour = checkInHour + rng.int(7, 9);
      const hours =
        status === "Absent" || status === "On Leave" ? 0 : Math.round((checkOutHour - checkInHour) * 10) / 10;

      records.push({
        id: `ATT-${idCounter++}`,
        employeeId: employee.id,
        date: dateStr,
        status,
        checkIn:
          status === "Absent" || status === "On Leave"
            ? null
            : `${String(checkInHour).padStart(2, "0")}:${String(checkInMinute).padStart(2, "0")}`,
        checkOut:
          status === "Absent" || status === "On Leave"
            ? null
            : `${String(checkOutHour % 24).padStart(2, "0")}:${String(rng.int(0, 59)).padStart(2, "0")}`,
        hours,
      });
    }
  }

  return records.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const attendanceRecords: AttendanceRecord[] = generateAttendance();

export const latestAttendanceDate = attendanceRecords[0]?.date ?? toISODate(NOW);

export function attendanceForDate(date: string) {
  return attendanceRecords.filter((record) => record.date === date);
}

export function attendanceTrend() {
  const byDate = new Map<string, AttendanceRecord[]>();
  for (const record of attendanceRecords) {
    const list = byDate.get(record.date) ?? [];
    list.push(record);
    byDate.set(record.date, list);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, records]) => {
      const present = records.filter((r) => r.status === "Present" || r.status === "Remote").length;
      return {
        date,
        rate: Math.round((present / records.length) * 1000) / 10,
      };
    });
}

export function attendanceKpis() {
  const totals: Record<AttendanceStatus, number> = { Present: 0, Absent: 0, Late: 0, Remote: 0, "On Leave": 0 };
  for (const record of attendanceRecords) totals[record.status]++;
  const rate =
    attendanceRecords.length > 0
      ? Math.round(((totals.Present + totals.Remote) / attendanceRecords.length) * 1000) / 10
      : 0;
  return { ...totals, attendanceRate: rate };
}

export function departmentAttendanceRates() {
  const byDepartment = new Map<string, { present: number; total: number }>();

  for (const record of attendanceRecords) {
    const employee = employeeById.get(record.employeeId);
    if (!employee) continue;
    const entry = byDepartment.get(employee.departmentId) ?? { present: 0, total: 0 };
    entry.total++;
    if (record.status === "Present" || record.status === "Remote") entry.present++;
    byDepartment.set(employee.departmentId, entry);
  }

  return [...byDepartment.entries()]
    .map(([departmentId, { present, total }]) => ({
      department: departmentById.get(departmentId)?.name ?? departmentId,
      rate: total > 0 ? Math.round((present / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.rate - a.rate);
}

export function lateArrivalsTrend() {
  const byDate = new Map<string, number>();
  for (const record of attendanceRecords) {
    if (record.status !== "Late") continue;
    byDate.set(record.date, (byDate.get(record.date) ?? 0) + 1);
  }
  return [...byDate.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([date, count]) => ({ date, count }));
}

export function absenceDistribution() {
  const byDepartment = new Map<string, number>();
  for (const record of attendanceRecords) {
    if (record.status !== "Absent") continue;
    const employee = employeeById.get(record.employeeId);
    if (!employee) continue;
    const name = departmentById.get(employee.departmentId)?.name ?? employee.departmentId;
    byDepartment.set(name, (byDepartment.get(name) ?? 0) + 1);
  }
  return [...byDepartment.entries()]
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count);
}
