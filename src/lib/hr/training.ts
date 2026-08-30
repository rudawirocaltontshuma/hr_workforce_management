import { COURSE_CATALOG, SEED } from "./constants";
import { activeEmployees } from "./employees";
import { addDays, NOW, Rng, toISODate } from "./rng";
import type { Course, TrainingRecord, TrainingStatus } from "./types";

const rng = new Rng(SEED + 8);

export const courses: Course[] = COURSE_CATALOG.map((course, index) => ({
  id: `CRS-${1000 + index}`,
  ...course,
}));

export const courseById = new Map(courses.map((course) => [course.id, course]));

function progressForStatus(status: TrainingStatus, rng: Rng): number {
  if (status === "Completed") return 100;
  if (status === "In Progress") return rng.int(15, 85);
  if (status === "Overdue") return rng.int(0, 40);
  return 0;
}

export function generateTrainingRecords(): TrainingRecord[] {
  const records: TrainingRecord[] = [];
  let idCounter = 7000;

  for (const course of courses) {
    const enrollmentCount = rng.int(6, 13);
    const enrolledEmployees = rng.pickMany(activeEmployees, enrollmentCount);

    for (const employee of enrolledEmployees) {
      const status = rng.pickWeighted<TrainingStatus>([
        ["Completed", 46],
        ["In Progress", 28],
        ["Enrolled", 20],
        ["Overdue", 6],
      ]);
      const enrolledDate = rng.date(addDays(NOW, -180), addDays(NOW, -5));
      const progress = progressForStatus(status, rng);
      const completedDate = status === "Completed" ? addDays(enrolledDate, rng.int(3, 60)) : null;

      records.push({
        id: `TRN-${idCounter++}`,
        employeeId: employee.id,
        courseId: course.id,
        status,
        progress,
        enrolledDate: toISODate(enrolledDate),
        completedDate: completedDate ? toISODate(completedDate) : null,
        hoursLogged: Math.round(((course.durationHours * progress) / 100) * 10) / 10,
        certificateIssued: status === "Completed" && rng.bool(0.72),
      });
    }
  }

  return records;
}

export const trainingRecords: TrainingRecord[] = generateTrainingRecords();

export function trainingForEmployee(employeeId: string) {
  return trainingRecords.filter((record) => record.employeeId === employeeId);
}

export function courseStats(courseId: string) {
  const records = trainingRecords.filter((record) => record.courseId === courseId);
  const completed = records.filter((record) => record.status === "Completed").length;
  return {
    enrolled: records.length,
    completionRate: records.length > 0 ? Math.round((completed / records.length) * 100) : 0,
    certificates: records.filter((record) => record.certificateIssued).length,
  };
}
