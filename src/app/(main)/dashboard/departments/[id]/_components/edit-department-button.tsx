"use client";

import { Button } from "@/components/ui/button";

import { demoActionToast } from "../../../_components/hr/demo-toast";

export function EditDepartmentButton({ departmentName }: { departmentName: string }) {
  return (
    <Button
      variant="outline"
      onClick={() => demoActionToast("Editing department", `Changes to ${departmentName} are not persisted.`)}
    >
      Edit department
    </Button>
  );
}
