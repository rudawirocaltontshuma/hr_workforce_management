import { DEPARTMENT_DEFINITIONS, LOCATIONS, SEED } from "./constants";
import { employees } from "./employees";
import { addDays, NOW, Rng, toISODate } from "./rng";
import type { EmployeeLevel, EmploymentType, JobPosition, PositionStatus } from "./types";

const rng = new Rng(SEED + 3);

const LEVEL_SALARY_RANGE: Record<EmployeeLevel, [number, number]> = {
  Executive: [260000, 420000],
  Head: [180000, 250000],
  Manager: [135000, 180000],
  Senior: [110000, 155000],
  Mid: [82000, 112000],
  Junior: [58000, 80000],
};

const RESPONSIBILITY_TEMPLATES = [
  "Partner with cross-functional stakeholders to deliver on {dept} priorities.",
  "Own execution and quality for key {dept} initiatives end to end.",
  "Report on progress and outcomes to department and company leadership.",
  "Mentor junior teammates and help raise the bar across the team.",
  "Identify process improvements that increase team velocity.",
];

const REQUIREMENT_TEMPLATES = [
  "3+ years of relevant experience in a comparable role.",
  "Strong written and verbal communication skills.",
  "A track record of delivering high-quality work under deadlines.",
  "Comfort working in a fast-paced, cross-functional environment.",
  "Bachelor's degree or equivalent practical experience.",
];

function pickTemplates(templates: string[], count: number) {
  return rng.pickMany(templates, count);
}

export function generatePositions(): JobPosition[] {
  const positions: JobPosition[] = [];
  let idCounter = 2000;

  for (const dept of DEPARTMENT_DEFINITIONS) {
    if (dept.id === "dept-executive") continue;

    const deptManagers = employees.filter(
      (employee) => employee.departmentId === dept.id && (employee.level === "Head" || employee.level === "Manager"),
    );
    const positionCount = rng.int(2, 4);

    for (let i = 0; i < positionCount; i++) {
      const level = rng.pickWeighted<EmployeeLevel>([
        ["Senior", 22],
        ["Mid", 40],
        ["Junior", 30],
        ["Manager", 8],
      ]);
      const [min, max] = LEVEL_SALARY_RANGE[level];
      const hiringManager = deptManagers.length > 0 ? rng.pick(deptManagers) : employees[0];
      const postedDate = rng.date(addDays(NOW, -150), addDays(NOW, -3));
      const status = rng.pickWeighted<PositionStatus>([
        ["Open", 55],
        ["On Hold", 15],
        ["Closed", 30],
      ]);
      const employmentType: EmploymentType = rng.pickWeighted([
        ["Full-time", 88],
        ["Contract", 8],
        ["Intern", 4],
      ]);
      const titlePool = deptTitlePool(dept.id, level);

      positions.push({
        id: `POS-${idCounter++}`,
        title: titlePool,
        departmentId: dept.id,
        location: rng.pickWeighted(LOCATIONS.map((loc) => [loc, loc === "Remote" ? 3 : 1] as const)),
        hiringManagerId: hiringManager.id,
        openings: rng.pickWeighted([
          [1, 60],
          [2, 25],
          [3, 15],
        ]),
        postedDate: toISODate(postedDate),
        status,
        employmentType,
        level,
        salaryMin: Math.round(min / 1000) * 1000,
        salaryMax: Math.round(max / 1000) * 1000,
        description: `We're looking for a ${titlePool} to join the ${dept.name} team and help us scale ${dept.description.toLowerCase()}`,
        requirements: pickTemplates(REQUIREMENT_TEMPLATES, 4),
        responsibilities: pickTemplates(
          RESPONSIBILITY_TEMPLATES.map((t) => t.replaceAll("{dept}", dept.name)),
          4,
        ),
      });
    }
  }

  return positions;
}

function deptTitlePool(departmentId: string, level: EmployeeLevel): string {
  const pools: Record<string, Partial<Record<EmployeeLevel, string[]>>> = {
    "dept-engineering": {
      Senior: ["Senior Software Engineer", "Staff Backend Engineer"],
      Mid: ["Software Engineer II", "Full-Stack Engineer"],
      Junior: ["Software Engineer I", "Associate QA Engineer"],
      Manager: ["Engineering Manager"],
    },
    "dept-product": {
      Senior: ["Senior Product Manager"],
      Mid: ["Product Manager"],
      Junior: ["Associate Product Manager"],
      Manager: ["Group Product Manager"],
    },
    "dept-design": {
      Senior: ["Senior Product Designer"],
      Mid: ["Product Designer"],
      Junior: ["Junior Product Designer"],
      Manager: ["Design Lead"],
    },
    "dept-data": {
      Senior: ["Senior Data Scientist", "Senior Analytics Engineer"],
      Mid: ["Data Analyst", "Data Scientist"],
      Junior: ["Junior Data Analyst"],
      Manager: ["Analytics Manager"],
    },
    "dept-it": {
      Senior: ["Security Engineer"],
      Mid: ["Systems Administrator"],
      Junior: ["IT Support Specialist"],
      Manager: ["IT Manager"],
    },
    "dept-sales": {
      Senior: ["Senior Account Executive"],
      Mid: ["Account Executive"],
      Junior: ["Sales Development Representative"],
      Manager: ["Sales Manager"],
    },
    "dept-marketing": {
      Senior: ["Senior Marketing Manager"],
      Mid: ["Growth Marketing Manager", "Content Marketing Manager"],
      Junior: ["Marketing Specialist"],
      Manager: ["Marketing Manager"],
    },
    "dept-customer-success": {
      Senior: ["Senior Customer Success Manager"],
      Mid: ["Customer Success Manager"],
      Junior: ["Onboarding Specialist"],
      Manager: ["Customer Success Lead"],
    },
    "dept-customer-support": {
      Senior: ["Senior Support Engineer"],
      Mid: ["Support Engineer"],
      Junior: ["Support Associate"],
      Manager: ["Support Team Lead"],
    },
    "dept-finance": {
      Senior: ["Senior Financial Analyst"],
      Mid: ["FP&A Analyst"],
      Junior: ["Financial Analyst"],
      Manager: ["FP&A Manager"],
    },
    "dept-accounting": {
      Senior: ["Senior Accountant"],
      Mid: ["Staff Accountant"],
      Junior: ["Accounts Payable Specialist"],
      Manager: ["Accounting Manager"],
    },
    "dept-hr": {
      Senior: ["Senior HR Business Partner"],
      Mid: ["HR Business Partner"],
      Junior: ["HR Generalist"],
      Manager: ["HR Manager"],
    },
    "dept-talent": {
      Senior: ["Senior Technical Recruiter"],
      Mid: ["Recruiter"],
      Junior: ["Recruiting Coordinator"],
      Manager: ["Recruiting Manager"],
    },
    "dept-legal": {
      Senior: ["Corporate Counsel"],
      Mid: ["Compliance Analyst"],
      Junior: ["Paralegal"],
      Manager: ["Compliance Manager"],
    },
    "dept-operations": {
      Senior: ["Facilities Manager"],
      Mid: ["Operations Coordinator"],
      Junior: ["Office Coordinator"],
      Manager: ["Operations Manager"],
    },
  };

  const pool = pools[departmentId]?.[level] ?? pools[departmentId]?.Mid ?? ["Team Member"];
  return rng.pick(pool);
}

export const positions: JobPosition[] = generatePositions();

export const positionById = new Map(positions.map((position) => [position.id, position]));

export function getPosition(id: string) {
  return positionById.get(id);
}

export const openPositions = positions.filter((position) => position.status === "Open");
