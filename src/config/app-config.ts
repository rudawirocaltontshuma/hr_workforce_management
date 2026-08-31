import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Dimension People",
  version: packageJson.version,
  copyright: `© ${currentYear}, Dimension People.`,
  meta: {
    title: "Dimension People - Enterprise HR & Workforce Management Platform",
    description:
      "Dimension People is an enterprise HR and workforce management platform demo covering employees, recruitment, attendance, leave, performance, compensation and workforce analytics. Built with Next.js, Tailwind CSS and shadcn/ui.",
  },
};

export const COMPANY_NAME = "Solstice Technologies, Inc.";
