# Contributing to Dimension People

Thanks for your interest in improving **Dimension People**, a front-end demo of an enterprise HR & workforce management platform. This guide covers how to set up your environment and where things live.

---

## Overview

This project is built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. It is a front-end-only demonstration: all data is generated locally in `src/lib/hr/` with a seeded random dataset, and there is no backend, database, or authentication. Keep changes consistent with that constraint — new features should extend the local mock-data layer, not call out to a real API.

---

## Project Layout

This project uses a **co-location-based file system**. Each screen keeps its own page, components, and mock-data helpers inside its route folder.

```
src
├── app
│   ├── (external)          # Public/landing routes
│   └── (main)
│       └── dashboard
│           ├── employees          # + [id] profile
│           ├── departments        # + [id] detail
│           ├── organization
│           ├── recruitment
│           ├── candidates         # + [id] profile
│           ├── positions          # + [id] detail
│           ├── onboarding
│           ├── attendance
│           ├── leave
│           ├── performance
│           ├── goals
│           ├── training
│           ├── documents
│           ├── compensation
│           ├── benefits
│           ├── workforce-planning
│           ├── reports
│           ├── analytics
│           ├── settings
│           ├── _components        # Shared shell: header, sidebar, HR widgets
│           └── page.tsx           # Executive dashboard
├── components/ui            # shadcn/ui components (do not modify directly)
├── components/calendar       # Shared calendar primitive (do not modify directly)
├── hooks                    # Reusable hooks
├── lib/hr                   # Mock data generators, types, and aggregates
├── lib                      # Other shared utilities/config
├── navigation/sidebar        # Sidebar nav config
└── styles                   # Tailwind / theme presets
```

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the dev server**
   ```bash
   npm run dev
   ```
   App will be available at [http://localhost:3000](http://localhost:3000).

---

## Contribution Flow

- Always create a new branch before working on changes:
  ```bash
  git checkout -b feature/my-update
  ```

- Use clear, conventional commit messages:
  ```bash
  git commit -m "feat: add compensation band comparison chart"
  ```

- Open a Pull Request once ready.
- If your change adds a new screen or component, include a screenshot in your PR description (light and dark mode, plus mobile if the layout changed).

---

## Where to Contribute

- **HR Screens**: `src/app/(main)/dashboard/<screen>/` — one folder per nav item (employees, departments, recruitment, etc.)
- **Shared Dashboard Shell**: header, sidebar, and cross-screen HR widgets (KPI cards, status badges, data table shell) → `src/app/(main)/dashboard/_components/`
- **Mock Data**: generators, types, and derived aggregates → `src/lib/hr/`
- **Reusable shadcn Components**: `src/components/ui/` (do not modify directly — style/customize where they're used instead)
- **Hooks**: `src/hooks/`
- **Themes**: new presets under `src/styles/presets/`

---

## Guidelines

- Prefer **TypeScript types** over `any`.
- Husky pre-commit hooks are enabled — linting and formatting run automatically when you commit, and if there are errors the commit will be blocked until they are fixed.
- Follow **shadcn/ui** and Tailwind v4 conventions; use semantic theme tokens, not raw hex/oklch values.
- Keep accessibility in mind (ARIA, keyboard navigation, focus states).
- Any interactive action (approve, export, save, upload) is a demo action — surface it with a toast rather than pretending it persisted.
- Avoid unnecessary dependencies — prefer existing utilities where possible.

---

## Submitting PRs

- Ensure your branch is up to date with `main` before submitting.
- Run `npm run check`, `npx tsc --noEmit`, and `npm run build` locally before opening the PR.
- Reference any related issue in your PR for context.

---

Your contributions keep this project growing. 🚀
