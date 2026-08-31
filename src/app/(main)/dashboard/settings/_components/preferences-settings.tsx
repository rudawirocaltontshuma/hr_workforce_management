"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PreferencesSettings() {
  const [timezone, setTimezone] = React.useState("America/Los_Angeles");
  const [dateFormat, setDateFormat] = React.useState("MMM d, yyyy");
  const [weekStart, setWeekStart] = React.useState("sunday");
  const [landingPage, setLandingPage] = React.useState("/dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">General Preferences</CardTitle>
        <CardDescription>Personal defaults for how dates and pages appear across the app.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldContent>
            <FieldLabel>Timezone</FieldLabel>
          </FieldContent>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="America/Los_Angeles">Pacific Time (US)</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Berlin">Berlin</SelectItem>
                <SelectItem value="Asia/Singapore">Singapore</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldContent>
            <FieldLabel>Date format</FieldLabel>
          </FieldContent>
          <Select value={dateFormat} onValueChange={setDateFormat}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="MMM d, yyyy">Aug 30, 2026</SelectItem>
                <SelectItem value="dd/MM/yyyy">30/08/2026</SelectItem>
                <SelectItem value="MM/dd/yyyy">08/30/2026</SelectItem>
                <SelectItem value="yyyy-MM-dd">2026-08-30</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldContent>
            <FieldLabel>Week starts on</FieldLabel>
          </FieldContent>
          <Select value={weekStart} onValueChange={setWeekStart}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldContent>
            <FieldLabel>Default landing page</FieldLabel>
          </FieldContent>
          <Select value={landingPage} onValueChange={setLandingPage}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="/dashboard">Dashboard</SelectItem>
                <SelectItem value="/dashboard/employees">Employees</SelectItem>
                <SelectItem value="/dashboard/recruitment">Recruitment</SelectItem>
                <SelectItem value="/dashboard/analytics">Analytics</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </CardContent>
    </Card>
  );
}
