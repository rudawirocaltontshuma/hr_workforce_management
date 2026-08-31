# Dimension People

**Dimension People** is a front-end demonstration of an enterprise HR & workforce management platform, built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

It covers the full breadth of a modern people-operations product: an executive dashboard, employee directory and 360 profiles, department and org-chart views, recruitment and candidate pipelines, onboarding, attendance, leave management, performance reviews, goals, training, a document center, compensation, benefits, workforce planning, a report center, deep analytics, and settings.

> This is a portfolio/demo project. All data (employees, candidates, departments, requests, reviews, etc.) is generated locally with a seeded random dataset — there is no backend, database, authentication, or real persistence. Actions like exporting a file, approving a request, or saving a setting only update local UI state for the duration of the session.

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix primitives)
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Forms & State**: React Hook Form, Zustand
- **Validation**: Zod
- **Tooling**: Biome, Husky

## Screens

- **Dashboard** — company-wide KPIs, headcount/hiring/turnover/attendance/performance/training trends, recent activity, upcoming events
- **Employees** — directory with filters/sorting/column visibility, and an employee 360 profile (personal, employment, attendance, leave, performance, goals, training, documents, compensation, benefits)
- **Departments** — directory and per-department detail (headcount, budget, performance, activity)
- **Organization** — visual, scrollable org chart from executive leadership down through department heads
- **Recruitment** — pipeline KPIs, hiring funnel, sourcing and time-to-hire analytics
- **Candidates** — pipeline table and kanban board, plus a candidate profile with resume summary and interview timeline
- **Job Positions** — requisition directory and detail (description, requirements, candidates, funnel)
- **Onboarding** — new-hire checklists with progress tracking
- **Attendance** — daily presence/remote/absence KPIs, trends, and a filterable attendance log
- **Leave Management** — requests, an approval dialog, a team leave calendar, and balances
- **Performance** — review-cycle completion, ratings distribution, and a review table
- **Goals** — goal tracking with progress and status by employee/department
- **Training** — course catalog with enrollment and completion stats
- **Documents** — a categorized document center (contracts, policies, certificates, IDs, etc.)
- **Compensation** — salary bands, department spend, and compensation-vs-performance
- **Benefits** — plan catalog by category with participation and eligibility
- **Workforce Planning** — headcount and hiring forecasts, department growth, cost projections
- **Reports** — a report center with previewable, downloadable (demo) reports
- **Analytics** — cross-functional analytics across workforce, recruitment, attendance, performance, training, and turnover
- **Settings** — organization profile, appearance, notifications, preferences, and display

## Co-location File System Architecture

This project follows a co-location-based architecture: each screen keeps its own page, components, and mock-data helpers inside its route folder (`src/app/(main)/dashboard/<screen>/`), while shared UI, hooks, and the mock-data layer (`src/lib/hr/`) live at the top level.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

Your app will be running at [http://localhost:3000](http://localhost:3000)

### Formatting and Linting

```bash
npm run check:fix
```
> See the [Biome documentation](https://biomejs.dev/) for more on available rules and CLI options.

### Production build

```bash
npm run build
npm run start
```

## Acknowledgements

This project's UI shell, theming system, and component conventions started from [Studio Admin](https://github.com/arhamkhnz/next-shadcn-admin-dashboard), an open-source Next.js admin template by Mohammed Arham Khan (MIT licensed — see `LICENSE`). All HR-specific screens, data, and business logic in this repository were built on top of that foundation.
