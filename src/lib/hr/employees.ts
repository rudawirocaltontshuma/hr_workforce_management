import {
  COMPANY_DOMAIN,
  DEPARTMENT_DEFINITIONS,
  DEPARTMENT_HEAD_TITLES,
  DEPARTMENT_IC_TITLES,
  DEPARTMENT_MANAGER_TITLES,
  EXECUTIVE_TEAM,
  FIRST_NAMES,
  LAST_NAMES,
  LOCATIONS,
  SEED,
  SKILLS_POOL,
} from "./constants";
import { NOW, Rng, toISODate } from "./rng";
import type { Employee, EmployeeLevel, EmployeeStatus, EmploymentType } from "./types";

const LEVEL_SALARY_RANGE: Record<EmployeeLevel, [number, number]> = {
  Executive: [280000, 450000],
  Head: [190000, 260000],
  Manager: [140000, 185000],
  Senior: [115000, 160000],
  Mid: [85000, 115000],
  Junior: [60000, 82000],
};

const DEPARTMENT_SALARY_MULTIPLIER: Record<string, number> = {
  "dept-executive": 1,
  "dept-engineering": 1.08,
  "dept-product": 1.03,
  "dept-design": 1.02,
  "dept-data": 1.08,
  "dept-it": 1,
  "dept-sales": 0.95,
  "dept-marketing": 0.97,
  "dept-customer-success": 0.92,
  "dept-customer-support": 0.88,
  "dept-finance": 1,
  "dept-accounting": 0.98,
  "dept-hr": 0.95,
  "dept-talent": 0.95,
  "dept-legal": 1.05,
  "dept-operations": 0.9,
};

const BIO_TEMPLATES = [
  "Focused on {title} work for {dept}, partnering closely with cross-functional teams to move key initiatives forward.",
  "Brings hands-on {dept} experience to the {title} role, with a track record of delivering steady, dependable results.",
  "Joined to strengthen the {dept} team, specializing in {title} responsibilities across the wider organization.",
  "Known across {dept} for a collaborative approach to {title} work and a strong bias toward clear communication.",
];

function slugPart(value: string) {
  return value
    .normalize("NFD")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

export function generateEmployees(): Employee[] {
  const rng = new Rng(SEED + 1);
  const employees: Employee[] = [];
  const usedNames = new Set<string>();
  let idCounter = 1000;

  const nextId = () => `EMP-${idCounter++}`;

  function pickName() {
    for (let attempt = 0; attempt < 25; attempt++) {
      const first = rng.pick(FIRST_NAMES);
      const last = rng.pick(LAST_NAMES);
      const key = `${first} ${last}`;
      if (!usedNames.has(key)) {
        usedNames.add(key);
        return { first, last };
      }
    }
    return { first: rng.pick(FIRST_NAMES), last: rng.pick(LAST_NAMES) };
  }

  function makeSalary(level: EmployeeLevel, departmentId: string) {
    const [min, max] = LEVEL_SALARY_RANGE[level];
    const multiplier = DEPARTMENT_SALARY_MULTIPLIER[departmentId] ?? 1;
    return Math.round((rng.int(min, max) * multiplier) / 500) * 500;
  }

  function makeEmploymentType(level: EmployeeLevel): EmploymentType {
    if (level === "Executive" || level === "Head" || level === "Manager") return "Full-time";
    return rng.pickWeighted([
      ["Full-time", 82],
      ["Part-time", 8],
      ["Contract", 6],
      ["Intern", 4],
    ]);
  }

  function makeStatus(startDate: Date): { status: EmployeeStatus; endDate: string | null } {
    const tenureDays = Math.round((NOW.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const roll = rng.pickWeighted<EmployeeStatus>([
      ["Active", 89],
      ["On Leave", 4],
      ["Probation", tenureDays <= 90 ? 5 : 0],
      ["Terminated", 4],
    ]);

    if (roll === "Terminated") {
      const endDate = rng.date(
        new Date(Math.max(startDate.getTime() + 86400000 * 60, NOW.getTime() - 86400000 * 540)),
        NOW,
      );
      return { status: "Terminated", endDate: toISODate(endDate) };
    }

    return { status: roll === "Probation" && tenureDays > 90 ? "Active" : roll, endDate: null };
  }

  function makeBio(title: string, deptName: string) {
    const template = rng.pick(BIO_TEMPLATES);
    return template.replaceAll("{title}", title).replaceAll("{dept}", deptName);
  }

  function makeEmergencyContact(surname: string) {
    const contactFirst = rng.pick(FIRST_NAMES);
    const relationship = rng.pick(["Spouse", "Parent", "Sibling", "Partner", "Friend"]);
    return {
      name: `${contactFirst} ${surname}`,
      relationship,
      phone: makePhone(),
    };
  }

  function makePhone() {
    return `+1 (${rng.int(200, 989)}) ${rng.int(200, 999)}-${rng.int(1000, 9999)}`;
  }

  function makeAddress(location: string) {
    const streetNumber = rng.int(100, 9899);
    const streetName = rng.pick([
      "Maple Ave",
      "Sunset Blvd",
      "5th Street",
      "Harbor Way",
      "Ridgewood Dr",
      "Elm Street",
      "Bridge Road",
      "Willow Lane",
      "Cedar Court",
      "Lakeside Dr",
    ]);
    const cityPart = location === "Remote" ? "Remote" : location;
    return `${streetNumber} ${streetName}, ${cityPart}`;
  }

  function makeEmployee(params: {
    title: string;
    level: EmployeeLevel;
    departmentId: string;
    managerId: string | null;
    startRange: [Date, Date];
    location?: string;
  }): Employee {
    const { first, last } = pickName();
    const name = `${first} ${last}`;
    const departmentName =
      DEPARTMENT_DEFINITIONS.find((d) => d.id === params.departmentId)?.name ?? params.departmentId;
    const startDate = rng.date(params.startRange[0], params.startRange[1]);
    const { status, endDate } = makeStatus(startDate);
    const location =
      params.location ?? rng.pickWeighted([...LOCATIONS.map((loc) => [loc, loc === "Remote" ? 22 : 11] as const)]);
    const performanceScore = Math.round((rng.float(58, 99) + rng.float(58, 99)) / 2);
    const attendanceRate = Math.round(rng.float(88, 100) * 10) / 10;

    return {
      id: nextId(),
      employeeNumber: "",
      firstName: first,
      lastName: last,
      name,
      initials: `${first[0]}${last[0]}`.toUpperCase(),
      email: `${slugPart(first)}.${slugPart(last)}@${COMPANY_DOMAIN}`,
      phone: makePhone(),
      departmentId: params.departmentId,
      jobTitle: params.title,
      level: params.level,
      managerId: params.managerId,
      location,
      startDate: toISODate(startDate),
      endDate,
      employmentType: makeEmploymentType(params.level),
      status,
      salary: makeSalary(params.level, params.departmentId),
      performanceScore,
      attendanceRate,
      bio: makeBio(params.title, departmentName),
      skills: rng.pickMany(SKILLS_POOL, rng.int(4, 6)),
      emergencyContact: makeEmergencyContact(last),
      address: makeAddress(location),
    };
  }

  // Executive leadership
  const execByTitle = new Map<string, Employee>();
  const ceo = makeEmployee({
    title: "Chief Executive Officer",
    level: "Executive",
    departmentId: "dept-executive",
    managerId: null,
    startRange: [new Date("2014-01-01"), new Date("2016-06-01")],
    location: "San Francisco, CA",
  });
  employees.push(ceo);
  execByTitle.set("Chief Executive Officer", ceo);

  for (const exec of EXECUTIVE_TEAM.slice(1)) {
    const manager = exec.reportsTo ? execByTitle.get(exec.reportsTo) : null;
    const employee = makeEmployee({
      title: exec.title,
      level: "Executive",
      departmentId: "dept-executive",
      managerId: manager?.id ?? ceo.id,
      startRange: [new Date("2015-01-01"), new Date("2019-06-01")],
      location: rng.pick(["San Francisco, CA", "New York, NY"]),
    });
    employees.push(employee);
    execByTitle.set(exec.title, employee);
  }

  for (let i = 0; i < 2; i++) {
    employees.push(
      makeEmployee({
        title: "Executive Assistant",
        level: "Junior",
        departmentId: "dept-executive",
        managerId: ceo.id,
        startRange: [new Date("2019-01-01"), new Date("2024-01-01")],
        location: "San Francisco, CA",
      }),
    );
  }

  // Functional departments
  for (const dept of DEPARTMENT_DEFINITIONS) {
    if (dept.id === "dept-executive") continue;

    const sponsor = dept.reportsTo ? execByTitle.get(dept.reportsTo) : null;
    const head = makeEmployee({
      title: DEPARTMENT_HEAD_TITLES[dept.id],
      level: "Head",
      departmentId: dept.id,
      managerId: sponsor?.id ?? ceo.id,
      startRange: [new Date("2016-01-01"), new Date("2021-06-01")],
    });
    employees.push(head);

    const managerCount = Math.min(3, Math.max(1, Math.round(dept.targetHeadcount / 9)));
    const managers: Employee[] = [];
    for (let i = 0; i < managerCount; i++) {
      const manager = makeEmployee({
        title: DEPARTMENT_MANAGER_TITLES[dept.id],
        level: "Manager",
        departmentId: dept.id,
        managerId: head.id,
        startRange: [new Date("2018-01-01"), new Date("2023-01-01")],
      });
      employees.push(manager);
      managers.push(manager);
    }

    const icCount = Math.max(0, dept.targetHeadcount - 1 - managerCount);
    const icTitles = DEPARTMENT_IC_TITLES[dept.id] ?? [{ title: "Specialist", level: "Mid" as const }];

    for (let i = 0; i < icCount; i++) {
      const level = rng.pickWeighted<EmployeeLevel>([
        ["Senior", 26],
        ["Mid", 44],
        ["Junior", 30],
      ]);
      const matches = icTitles.filter((t) => t.level === level);
      const titleDef = matches.length > 0 ? rng.pick(matches) : rng.pick(icTitles);
      const reportsTo = managers.length > 0 ? rng.pick(managers) : head;

      employees.push(
        makeEmployee({
          title: titleDef.title,
          level,
          departmentId: dept.id,
          managerId: reportsTo.id,
          startRange: [new Date("2019-06-01"), NOW],
        }),
      );
    }
  }

  for (const employee of employees) {
    employee.employeeNumber = employee.id;
  }

  return employees;
}

export const employees: Employee[] = generateEmployees();

export const employeeById = new Map(employees.map((employee) => [employee.id, employee]));

export function getEmployee(id: string): Employee | undefined {
  return employeeById.get(id);
}

export function getDirectReports(employeeId: string): Employee[] {
  return employees.filter((employee) => employee.managerId === employeeId);
}

export const activeEmployees = employees.filter((employee) => employee.status !== "Terminated");
