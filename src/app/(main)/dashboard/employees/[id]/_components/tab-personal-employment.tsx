import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { departmentById, type Employee, employeeById } from "@/lib/hr";

import { formatDate } from "../../../_components/hr/format";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

export function TabPersonalEmployment({ employee }: { employee: Employee }) {
  const department = departmentById.get(employee.departmentId);
  const manager = employee.managerId ? employeeById.get(employee.managerId) : undefined;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" value={employee.firstName} />
            <Field label="Last name" value={employee.lastName} />
            <Field label="Home address" value={employee.address} />
            <Field label="Phone" value={employee.phone} />
          </div>

          <Separator />

          <div>
            <div className="mb-2 text-muted-foreground text-xs">Contact Information</div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Work email" value={employee.email} />
              <Field label="Work phone" value={employee.phone} />
            </div>
          </div>

          <Separator />

          <div>
            <div className="mb-2 text-muted-foreground text-xs">Emergency Contact</div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={employee.emergencyContact.name} />
              <Field label="Relationship" value={employee.emergencyContact.relationship} />
              <Field label="Phone" value={employee.emergencyContact.phone} />
            </div>
          </div>

          <Separator />

          <div>
            <div className="mb-2 text-muted-foreground text-xs">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {employee.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="rounded-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Employment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Field label="Employee ID" value={<span className="font-mono">{employee.id}</span>} />
          <Field label="Job title" value={employee.jobTitle} />
          <Field label="Department" value={department?.name ?? "Unassigned"} />
          <Field label="Manager" value={manager?.name ?? "None"} />
          <Field label="Level" value={employee.level} />
          <Field label="Employment type" value={employee.employmentType} />
          <Field label="Start date" value={formatDate(employee.startDate)} />
          <Field label="Location" value={employee.location} />
          <Field label="Status" value={employee.status} />
          {employee.endDate ? <Field label="End date" value={formatDate(employee.endDate)} /> : null}
          <div className="col-span-2">
            <div className="mb-1 text-muted-foreground text-xs">About</div>
            <p className="text-sm leading-relaxed">{employee.bio}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
