import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { benefitsForEmployee, departmentCompensationSummary, type Employee } from "@/lib/hr";
import { formatCurrency } from "@/lib/utils";

export function TabCompensationBenefits({ employee }: { employee: Employee }) {
  const deptSummary = departmentCompensationSummary().find((summary) => summary.departmentId === employee.departmentId);
  const vsMedian = deptSummary ? Math.round(((employee.salary - deptSummary.avgComp) / deptSummary.avgComp) * 100) : 0;
  const benefits = benefitsForEmployee(employee.id);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Compensation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-muted-foreground text-xs">Annual base salary</div>
            <div className="font-heading text-3xl tracking-tight">
              {formatCurrency(employee.salary, { noDecimals: true })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">Level</div>
              <div>{employee.level}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">vs. department average</div>
              <div
                className={
                  vsMedian >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }
              >
                {vsMedian >= 0 ? "+" : ""}
                {vsMedian}%
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Figures are illustrative demo data only. Nexora People does not process real payroll.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Benefits Enrollment</CardTitle>
        </CardHeader>
        <CardContent>
          {benefits.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground text-sm">Not enrolled in any benefit plans.</p>
          ) : (
            <ul className="space-y-3">
              {benefits.map((plan) => (
                <li key={plan.id} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-muted-foreground text-xs">{plan.category}</div>
                  </div>
                  <Badge variant="outline" className="rounded-sm">
                    Enrolled
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
