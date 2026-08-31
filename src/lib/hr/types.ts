export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Intern";
export type EmployeeStatus = "Active" | "On Leave" | "Probation" | "Terminated";
export type EmployeeLevel = "Executive" | "Head" | "Manager" | "Senior" | "Mid" | "Junior";

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  departmentId: string;
  jobTitle: string;
  level: EmployeeLevel;
  managerId: string | null;
  location: string;
  startDate: string;
  endDate: string | null;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  salary: number;
  performanceScore: number;
  attendanceRate: number;
  bio: string;
  skills: string[];
  emergencyContact: { name: string; relationship: string; phone: string };
  address: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  managerId: string | null;
  budget: number;
  location: string;
  status: "Active" | "Restructuring" | "Hiring Freeze";
  foundedYear: number;
}

export type PositionStatus = "Open" | "On Hold" | "Closed";

export interface JobPosition {
  id: string;
  title: string;
  departmentId: string;
  location: string;
  hiringManagerId: string;
  openings: number;
  postedDate: string;
  status: PositionStatus;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

export type CandidateStage = "Applied" | "Screening" | "Interview" | "Assessment" | "Offer" | "Hired" | "Rejected";
export type CandidateStatus = "Active" | "Hired" | "Rejected" | "Withdrawn";

export interface InterviewEvent {
  stage: string;
  date: string;
  interviewer: string;
  outcome: "Scheduled" | "Passed" | "Failed" | "Pending";
  notes: string;
}

export interface Candidate {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  positionId: string;
  departmentId: string;
  recruiterId: string;
  stage: CandidateStage;
  status: CandidateStatus;
  score: number;
  appliedDate: string;
  source: string;
  experienceYears: number;
  currentTitle: string;
  currentCompany: string;
  location: string;
  education: string;
  skills: string[];
  resumeSummary: string;
  expectedSalary: number;
  interviewTimeline: InterviewEvent[];
}

export type LeaveType = "Annual" | "Sick" | "Personal" | "Parental" | "Unpaid";
export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  reason: string;
  appliedDate: string;
  approverId: string | null;
}

export interface LeaveBalance {
  employeeId: string;
  type: LeaveType;
  entitlement: number;
  used: number;
  remaining: number;
}

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Remote" | "On Leave";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  checkIn: string | null;
  checkOut: string | null;
  hours: number;
}

export type GoalStatus = "Not Started" | "In Progress" | "At Risk" | "Completed";
export type GoalPriority = "Low" | "Medium" | "High";

export interface Goal {
  id: string;
  title: string;
  description: string;
  employeeId: string;
  departmentId: string;
  managerId: string | null;
  category: string;
  dueDate: string;
  progress: number;
  priority: GoalPriority;
  status: GoalStatus;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  durationHours: number;
  instructor: string;
  format: "Self-paced" | "Instructor-led" | "Workshop";
  description: string;
}

export type TrainingStatus = "Enrolled" | "In Progress" | "Completed" | "Overdue";

export interface TrainingRecord {
  id: string;
  employeeId: string;
  courseId: string;
  status: TrainingStatus;
  progress: number;
  enrolledDate: string;
  completedDate: string | null;
  hoursLogged: number;
  certificateIssued: boolean;
}

export type DocumentCategory =
  | "Contracts"
  | "Policies"
  | "Certificates"
  | "Training"
  | "Identification"
  | "Company Documents";
export type DocumentStatus = "Active" | "Expired" | "Pending Signature";

export interface DocumentRecord {
  id: string;
  title: string;
  category: DocumentCategory;
  employeeId: string | null;
  fileType: "PDF" | "DOCX" | "XLSX";
  sizeKb: number;
  uploadedDate: string;
  status: DocumentStatus;
  confidential: boolean;
  owner: string;
}

export type ReviewStatus = "Completed" | "In Progress" | "Not Started";

export interface PerformanceReview {
  id: string;
  employeeId: string;
  departmentId: string;
  managerId: string | null;
  period: string;
  reviewDate: string;
  status: ReviewStatus;
  rating: number;
  score: number;
  goalsCompleted: number;
  goalsTotal: number;
  strengths: string[];
  growthAreas: string[];
  summary: string;
}

export type BenefitCategory = "Health" | "Retirement" | "Insurance" | "Allowances" | "Wellness";

export interface BenefitPlan {
  id: string;
  name: string;
  category: BenefitCategory;
  description: string;
  eligibility: string;
  monthlyCost: number;
  participationRate: number;
  enrolledCount: number;
  status: "Active" | "Upcoming" | "Archived";
}

export interface OrgNode {
  employee: Employee;
  children: OrgNode[];
}

export interface ActivityItem {
  id: string;
  type: "hire" | "leave" | "review" | "position" | "document" | "training" | "promotion";
  message: string;
  timestamp: string;
  employeeId?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  category: "Onboarding" | "Review" | "Training" | "Benefits" | "Holiday" | "Company";
  description: string;
}
