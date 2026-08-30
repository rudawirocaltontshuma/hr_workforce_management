import { activeEmployees } from "./employees";
import type { Employee, OrgNode } from "./types";

function buildNode(employee: Employee): OrgNode {
  const children = activeEmployees
    .filter((candidate) => candidate.managerId === employee.id)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(buildNode);

  return { employee, children };
}

export function buildOrgTree(): OrgNode | null {
  const root = activeEmployees.find((employee) => employee.managerId === null);
  if (!root) return null;
  return buildNode(root);
}

export const orgTree = buildOrgTree();

export function countDescendants(node: OrgNode): number {
  return node.children.reduce((sum, child) => sum + 1 + countDescendants(child), 0);
}
