import { COMPANY_NAME, SEED } from "./constants";
import { activeEmployees, employeeById } from "./employees";
import { addDays, NOW, Rng, toISODate } from "./rng";
import { courseById, courses, trainingRecords } from "./training";
import type { DocumentCategory, DocumentRecord, DocumentStatus } from "./types";

const rng = new Rng(SEED + 9);

const COMPANY_WIDE_DOCS: { title: string; category: DocumentCategory }[] = [
  { title: "Employee Handbook", category: "Policies" },
  { title: "Code of Conduct", category: "Policies" },
  { title: "Remote Work Policy", category: "Policies" },
  { title: "Expense Reimbursement Policy", category: "Policies" },
  { title: "Data Privacy Policy", category: "Policies" },
  { title: "Anti-Harassment & Equal Opportunity Policy", category: "Policies" },
  { title: "Information Security Policy", category: "Policies" },
  { title: "Business Travel Policy", category: "Policies" },
  { title: "FY26 Company Org Chart", category: "Company Documents" },
  { title: "Benefits Enrollment Guide", category: "Company Documents" },
  { title: "Brand & Design Guidelines", category: "Company Documents" },
  { title: "Company Holiday Calendar", category: "Company Documents" },
  { title: "Equity & Stock Option Plan Overview", category: "Company Documents" },
  { title: "Business Continuity Plan", category: "Company Documents" },
  { title: "Vendor Code of Conduct", category: "Company Documents" },
];

function randomFileType() {
  return rng.pickWeighted<DocumentRecord["fileType"]>([
    ["PDF", 70],
    ["DOCX", 22],
    ["XLSX", 8],
  ]);
}

export function generateDocuments(): DocumentRecord[] {
  const documents: DocumentRecord[] = [];
  let idCounter = 8000;

  for (const doc of COMPANY_WIDE_DOCS) {
    documents.push({
      id: `DOC-${idCounter++}`,
      title: doc.title,
      category: doc.category,
      employeeId: null,
      fileType: doc.category === "Company Documents" && doc.title.includes("Org Chart") ? "XLSX" : randomFileType(),
      sizeKb: rng.int(80, 3200),
      uploadedDate: toISODate(rng.date(addDays(NOW, -540), addDays(NOW, -14))),
      status: "Active",
      confidential: doc.title.includes("Equity") || doc.title.includes("Business Continuity"),
      owner: "People Operations",
    });
  }

  const contractSample = rng.pickMany(activeEmployees, 64);
  for (const employee of contractSample) {
    documents.push({
      id: `DOC-${idCounter++}`,
      title: `Employment Agreement - ${employee.name}`,
      category: "Contracts",
      employeeId: employee.id,
      fileType: "PDF",
      sizeKb: rng.int(120, 480),
      uploadedDate: toISODate(new Date(employee.startDate)),
      status: rng.pickWeighted<DocumentStatus>([
        ["Active", 92],
        ["Pending Signature", 8],
      ]),
      confidential: true,
      owner: `${COMPANY_NAME} · People Operations`,
    });
  }

  const idSample = rng.pickMany(activeEmployees, 48);
  for (const employee of idSample) {
    const uploaded = rng.date(new Date(employee.startDate), addDays(NOW, -1));
    const expired = rng.bool(0.08);
    documents.push({
      id: `DOC-${idCounter++}`,
      title: `Government ID Verification - ${employee.name}`,
      category: "Identification",
      employeeId: employee.id,
      fileType: "PDF",
      sizeKb: rng.int(60, 220),
      uploadedDate: toISODate(uploaded),
      status: expired ? "Expired" : "Active",
      confidential: true,
      owner: `${COMPANY_NAME} · People Operations`,
    });
  }

  for (const course of courses) {
    documents.push({
      id: `DOC-${idCounter++}`,
      title: `${course.title} - Course Workbook`,
      category: "Training",
      employeeId: null,
      fileType: rng.pickWeighted([
        ["PDF", 60],
        ["DOCX", 40],
      ]),
      sizeKb: rng.int(200, 1800),
      uploadedDate: toISODate(rng.date(addDays(NOW, -360), addDays(NOW, -30))),
      status: "Active",
      confidential: false,
      owner: "Learning & Development",
    });
  }

  const certificateRecords = trainingRecords.filter((record) => record.certificateIssued);
  for (const record of certificateRecords) {
    const employee = employeeById.get(record.employeeId);
    const course = courseById.get(record.courseId);
    if (!employee || !course || !record.completedDate) continue;
    documents.push({
      id: `DOC-${idCounter++}`,
      title: `${course.title} - Certificate of Completion`,
      category: "Certificates",
      employeeId: employee.id,
      fileType: "PDF",
      sizeKb: rng.int(40, 140),
      uploadedDate: record.completedDate,
      status: "Active",
      confidential: false,
      owner: "Learning & Development",
    });
  }

  return documents;
}

export const documents: DocumentRecord[] = generateDocuments();

export function documentsForEmployee(employeeId: string) {
  return documents.filter((document) => document.employeeId === employeeId);
}
