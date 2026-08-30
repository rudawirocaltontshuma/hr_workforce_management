import { CalendarX } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attendanceRecords, type Employee, getLeaveBalancesForEmployee, leaveRequests } from "@/lib/hr";

import { EmptyState } from "../../../_components/hr/empty-state";
import { formatDate } from "../../../_components/hr/format";
import { StatusBadge } from "../../../_components/hr/status-badge";

export function TabAttendanceLeave({ employee }: { employee: Employee }) {
  const records = attendanceRecords.filter((record) => record.employeeId === employee.id).slice(0, 10);
  const requests = leaveRequests.filter((request) => request.employeeId === employee.id);
  const balances = getLeaveBalancesForEmployee(employee.id);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground text-sm">
              No attendance records in the sampled window.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>
                        <StatusBadge status={record.status} />
                      </TableCell>
                      <TableCell>{record.checkIn ?? "—"}</TableCell>
                      <TableCell>{record.checkOut ?? "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">{record.hours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Leave Balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {balances.map((balance) => (
              <div key={balance.type} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{balance.type}</span>
                  <span className="text-muted-foreground text-xs">
                    {balance.remaining} of {balance.entitlement} days left
                  </span>
                </div>
                <Progress value={balance.entitlement > 0 ? (balance.used / balance.entitlement) * 100 : 0} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <EmptyState
                icon={CalendarX}
                title="No leave requests"
                description="This employee has not requested any time off."
              />
            ) : (
              <ul className="space-y-3">
                {requests.slice(0, 6).map((request) => (
                  <li key={request.id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <div className="font-medium">
                        {request.type} · {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </div>
                      <div className="truncate text-muted-foreground text-xs">{request.reason}</div>
                    </div>
                    <StatusBadge status={request.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
