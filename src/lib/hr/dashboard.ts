import { attendanceTrend } from "./attendance";
import { HOLIDAYS_2026 } from "./constants";
import { departmentHeadcount, departments } from "./departments";
import { documents } from "./documents";
import { activeEmployees, employeeById, employees } from "./employees";
import { employeesOnLeaveToday, leaveRequests } from "./leave";
import { performanceReviews } from "./performance";
import { openPositions, positions } from "./positions";
import { addDays, formatMonthLabel, NOW, toISODate } from "./rng";
import { courseById, trainingRecords } from "./training";
import type { ActivityItem, UpcomingEvent } from "./types";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function lastNMonths(count: number) {
  const months: Date[] = [];
  const cursor = new Date(NOW.getFullYear(), NOW.getMonth(), 1);
  for (let i = count - 1; i >= 0; i--) {
    months.push(new Date(cursor.getFullYear(), cursor.getMonth() - i, 1));
  }
  return months;
}

export function headcountTrend() {
  return lastNMonths(12).map((month) => {
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const count = employees.filter((employee) => {
      const start = new Date(employee.startDate);
      const end = employee.endDate ? new Date(employee.endDate) : null;
      return start <= monthEnd && (!end || end > monthEnd);
    }).length;
    return { month: formatMonthLabel(month), headcount: count };
  });
}

export function hiringTrend() {
  return lastNMonths(12).map((month) => {
    const key = monthKey(month);
    const hires = employees.filter((employee) => monthKey(new Date(employee.startDate)) === key).length;
    return { month: formatMonthLabel(month), hires };
  });
}

export function turnoverTrend() {
  return lastNMonths(12).map((month) => {
    const key = monthKey(month);
    const departures = employees.filter(
      (employee) => employee.endDate && monthKey(new Date(employee.endDate)) === key,
    ).length;
    return { month: formatMonthLabel(month), departures };
  });
}

export function departmentDistribution() {
  return departments.map((department) => ({
    department: department.name,
    headcount: departmentHeadcount(department.id),
  }));
}

export function performanceDistribution() {
  const buckets = [
    { label: "Exceptional (90-100)", min: 90, max: 101 },
    { label: "Exceeds (80-89)", min: 80, max: 90 },
    { label: "Meets (65-79)", min: 65, max: 80 },
    { label: "Below (50-64)", min: 50, max: 65 },
    { label: "Needs Improvement (<50)", min: 0, max: 50 },
  ];
  return buckets.map((bucket) => ({
    label: bucket.label,
    count: activeEmployees.filter((e) => e.performanceScore >= bucket.min && e.performanceScore < bucket.max).length,
  }));
}

export function trainingCompletionTrend() {
  return lastNMonths(6).map((month) => {
    const key = monthKey(month);
    const monthRecords = trainingRecords.filter((record) => monthKey(new Date(record.enrolledDate)) === key);
    const completed = monthRecords.filter((record) => record.status === "Completed").length;
    return {
      month: formatMonthLabel(month),
      completionRate: monthRecords.length > 0 ? Math.round((completed / monthRecords.length) * 100) : 0,
    };
  });
}

export function dashboardKpis() {
  const totalEmployees = activeEmployees.length;
  const newEmployees = activeEmployees.filter((employee) => new Date(employee.startDate) >= addDays(NOW, -90)).length;
  const openPositionsCount = openPositions.reduce((sum, position) => sum + position.openings, 0);
  const onLeave = employeesOnLeaveToday.length;
  const trend = attendanceTrend();
  const attendanceRate = trend.length > 0 ? trend[trend.length - 1].rate : 0;

  const terminatedLast12Months = employees.filter(
    (employee) => employee.endDate && new Date(employee.endDate) >= addDays(NOW, -365),
  ).length;
  const avgHeadcount = (totalEmployees + terminatedLast12Months) / 2 || 1;
  const turnoverRate = Math.round((terminatedLast12Months / avgHeadcount) * 1000) / 10;

  const currentPeriodReviews = performanceReviews.filter((review) => review.period === "2026 H1");
  const performanceCompletion =
    currentPeriodReviews.length > 0
      ? Math.round(
          (currentPeriodReviews.filter((r) => r.status === "Completed").length / currentPeriodReviews.length) * 100,
        )
      : 0;

  const trainingCompletion =
    trainingRecords.length > 0
      ? Math.round((trainingRecords.filter((r) => r.status === "Completed").length / trainingRecords.length) * 100)
      : 0;

  return {
    totalEmployees,
    newEmployees,
    openPositions: openPositionsCount,
    employeesOnLeave: onLeave,
    attendanceRate,
    turnoverRate,
    performanceCompletion,
    trainingCompletion,
  };
}

export function recentActivity(limit = 10): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const employee of activeEmployees) {
    if (new Date(employee.startDate) >= addDays(NOW, -21)) {
      items.push({
        id: `act-hire-${employee.id}`,
        type: "hire",
        message: `${employee.name} joined as ${employee.jobTitle}`,
        timestamp: employee.startDate,
        employeeId: employee.id,
      });
    }
  }

  for (const request of leaveRequests) {
    if (request.status === "Approved" && request.appliedDate >= toISODate(addDays(NOW, -14))) {
      const employee = employeeById.get(request.employeeId);
      if (!employee) continue;
      items.push({
        id: `act-leave-${request.id}`,
        type: "leave",
        message: `${employee.name}'s ${request.type.toLowerCase()} leave was approved`,
        timestamp: request.appliedDate,
        employeeId: employee.id,
      });
    }
  }

  for (const review of performanceReviews) {
    if (review.status === "Completed" && review.reviewDate >= toISODate(addDays(NOW, -14))) {
      const employee = employeeById.get(review.employeeId);
      if (!employee) continue;
      items.push({
        id: `act-review-${review.id}`,
        type: "review",
        message: `${employee.name}'s ${review.period} performance review was completed`,
        timestamp: review.reviewDate,
        employeeId: employee.id,
      });
    }
  }

  for (const position of positions) {
    if (position.status === "Open" && position.postedDate >= toISODate(addDays(NOW, -10))) {
      items.push({
        id: `act-position-${position.id}`,
        type: "position",
        message: `New requisition opened for ${position.title}`,
        timestamp: position.postedDate,
      });
    }
  }

  for (const document of documents) {
    if (document.uploadedDate >= toISODate(addDays(NOW, -7))) {
      items.push({
        id: `act-doc-${document.id}`,
        type: "document",
        message: `${document.title} was uploaded to the document center`,
        timestamp: document.uploadedDate,
        employeeId: document.employeeId ?? undefined,
      });
    }
  }

  for (const record of trainingRecords) {
    if (record.status === "Completed" && record.completedDate && record.completedDate >= toISODate(addDays(NOW, -14))) {
      const employee = employeeById.get(record.employeeId);
      const course = courseById.get(record.courseId);
      if (!employee || !course) continue;
      items.push({
        id: `act-training-${record.id}`,
        type: "training",
        message: `${employee.name} completed "${course.title}"`,
        timestamp: record.completedDate,
        employeeId: employee.id,
      });
    }
  }

  return items.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)).slice(0, limit);
}

export function upcomingEvents(): UpcomingEvent[] {
  const events: UpcomingEvent[] = [
    {
      id: "evt-1",
      title: "Q3 Performance Review Cycle Opens",
      date: toISODate(addDays(NOW, 4)),
      category: "Review",
      description: "Self-assessments open for all employees ahead of the mid-year calibration cycle.",
    },
    {
      id: "evt-2",
      title: "New Hire Orientation - September Cohort",
      date: toISODate(addDays(NOW, 6)),
      category: "Onboarding",
      description: "Company-wide orientation session for all employees starting in September.",
    },
    {
      id: "evt-3",
      title: "Benefits Open Enrollment Opens",
      date: toISODate(addDays(NOW, 12)),
      category: "Benefits",
      description: "Annual open enrollment window opens for the 2027 benefits plan year.",
    },
    {
      id: "evt-4",
      title: "Manager Effectiveness Workshop",
      date: toISODate(addDays(NOW, 9)),
      category: "Training",
      description: "Instructor-led workshop covering feedback delivery and coaching fundamentals.",
    },
    {
      id: "evt-5",
      title: "All-Hands Company Meeting",
      date: toISODate(addDays(NOW, 2)),
      category: "Company",
      description: "Quarterly business update, presented by the executive leadership team.",
    },
  ];

  for (const holiday of HOLIDAYS_2026) {
    if (holiday.date >= toISODate(NOW)) {
      events.push({
        id: `evt-holiday-${holiday.title}`,
        title: holiday.title,
        date: holiday.date,
        category: "Holiday",
        description: "Company holiday - offices closed.",
      });
    }
  }

  return events.sort((a, b) => (a.date < b.date ? -1 : 1)).slice(0, 8);
}
