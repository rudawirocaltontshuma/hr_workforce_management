import { SEED } from "./constants";
import { activeEmployees } from "./employees";
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
