import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { countDescendants, departmentById, type OrgNode } from "@/lib/hr";

import { getAvatarTone } from "../../_components/hr/avatar-tone";
import "./org-tree.css";

function NodeCard({ node, showTeamSize }: { node: OrgNode; showTeamSize: boolean }) {
  const department = departmentById.get(node.employee.departmentId);
  const teamSize = countDescendants(node);

  return (
    <Link href={`/dashboard/employees/${node.employee.id}`} className="inline-block">
      <Card
        size="sm"
        className="w-44 items-center gap-2 px-3 py-3 text-center transition-shadow hover:shadow-md sm:w-52"
      >
        <Avatar size="lg" className={getAvatarTone(node.employee.id)}>
          <AvatarFallback>{node.employee.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="truncate font-medium text-sm">{node.employee.name}</div>
          <div className="truncate text-muted-foreground text-xs">{node.employee.jobTitle}</div>
        </div>
        {showTeamSize && teamSize > 0 ? (
          <Badge variant="outline" className="rounded-sm text-[10px]">
            {department?.name ?? "Team"} · {teamSize + 1}
          </Badge>
        ) : null}
      </Card>
    </Link>
  );
}

function TreeNode({ node, depth, maxDepth }: { node: OrgNode; depth: number; maxDepth: number }) {
  const showChildren = depth < maxDepth && node.children.length > 0;

  return (
    <li>
      <NodeCard node={node} showTeamSize={depth === maxDepth} />
      {showChildren ? (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child.employee.id} node={child} depth={depth + 1} maxDepth={maxDepth} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function OrgChart({ root, maxDepth = 2 }: { root: OrgNode; maxDepth?: number }) {
  return (
    <div className="scrollbar-thin overflow-x-auto pb-4 [scrollbar-color:var(--border)_transparent]">
      <div className="org-tree min-w-max px-6 py-2">
        <ul>
          <TreeNode node={root} depth={0} maxDepth={maxDepth} />
        </ul>
      </div>
    </div>
  );
}
