import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Nexora People",
  version: packageJson.version,
  copyright: `© ${currentYear}, Nexora People.`,
  meta: {
    title: "Nexora People - Enterprise HR & Workforce Management Platform",
    description:
      "Nexora People is an enterprise HR and workforce management platform demo covering employees, recruitment, attendance, leave, performance, compensation and workforce analytics. Built with Next.js, Tailwind CSS and shadcn/ui.",
  },
};

export const COMPANY_NAME = "Solstice Technologies, Inc.";
